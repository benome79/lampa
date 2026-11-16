(function () {
    'use strict';

    var PLUGIN_NAME = 'visual_style_mod';
    var STYLE_TAG_ID = 'lampa-visual-style-css';

    // Цветовые палитры тем
    var THEMES = {
        oled: {
            title: 'OLED Pure Black',
            bg: '#000000',
            card_bg: '#0a0a0a',
            accent: '#ffffff',
            focus_border: '#ffffff',
            focus_glow: 'rgba(255, 255, 255, 0.45)'
        },
        midnight: {
            title: 'Midnight Blue',
            bg: '#070b14',
            card_bg: '#0e1726',
            accent: '#38bdf8',
            focus_border: '#38bdf8',
            focus_glow: 'rgba(56, 189, 248, 0.5)'
        },
        cyberpunk: {
            title: 'Cyberpunk Neon',
            bg: '#080512',
            card_bg: '#120b24',
            accent: '#f43f5e',
            focus_border: '#06b6d4',
            focus_glow: 'rgba(6, 182, 212, 0.6)'
        },
        emerald: {
            title: 'Deep Emerald',
            bg: '#040d0a',
            card_bg: '#091c16',
            accent: '#10b981',
            focus_border: '#10b981',
            focus_glow: 'rgba(16, 185, 129, 0.55)'
        }
    };

    function getStorage(key, def) {
        return Lampa.Storage.get(PLUGIN_NAME + '_' + key, def);
    }

    function setStorage(key, val) {
        Lampa.Storage.set(PLUGIN_NAME + '_' + key, val);
    }

    // Генерация и внедрение CSS-стилей
    function applyStyles() {
        var currentThemeKey = getStorage('theme', 'oled');
        var theme = THEMES[currentThemeKey] || THEMES.oled;
        var rounded = getStorage('rounded', true);
        var glow = getStorage('glow', true);

        var radius = rounded ? '14px' : '4px';
        var glowEffect = glow 
            ? 'box-shadow: 0 0 25px ' + theme.focus_glow + ', 0 0 5px ' + theme.focus_border + ' !important;' 
            : 'box-shadow: none !important;';

        var css = `
            /* Основной фон приложения и бокового меню */
            body, .background, .activity, .settings, .menu {
                background-color: ${theme.bg} !important;
            }

            /* Задники карточек и панелей */
            .card, .full-start, .navigation-tabs, .search, .layer--layer {
                background-color: ${theme.card_bg} !important;
            }

            /* Скругление углов постеров и карточек */
            .card__view, .card__img, .card, .full-start__poster img {
                border-radius: ${radius} !important;
                overflow: hidden !important;
                transition: transform 0.22s cubic-bezier(0.2, 0, 0.1, 1), box-shadow 0.22s ease !important;
            }

            /* Активный элемент под курсором/пультом */
            .card.focus .card__view, 
            .selector.focus, 
            .button.focus, 
            .menu__item.focus {
                border: 2px solid ${theme.focus_border} !important;
                ${glowEffect}
            }

            /* Плавное увеличение активной карточки */
            .card.focus {
                transform: scale(1.05) translateZ(0) !important;
                z-index: 10 !important;
            }

            /* Акцентные кнопки и маркеры */
            .button.focus, .simple-button.focus {
                background: ${theme.accent} !important;
                color: #000000 !important;
                font-weight: bold !important;
            }

            /* Тонкая полоска прогресса и акценты */
            .card__timeline > div {
                background-color: ${theme.accent} !important;
            }
        `;

        var existing = document.getElementById(STYLE_TAG_ID);
        if (!existing) {
            existing = document.createElement('style');
            existing.id = STYLE_TAG_ID;
            document.head.appendChild(existing);
        }
        existing.innerHTML = css;
    }

    function initPlugin() {
        // Применяем стили при первом запуске
        applyStyles();

        // Добавляем пункт в настройки Lampa
        Lampa.SettingsApi.addComponent({
            component: 'visual_mod_settings',
            name: 'Стиль и темы',
            icon: '<svg height="24" width="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l1.9-1.9C9.22 19.57 10.56 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>'
        });

        // 1. Выбор цветовой темы
        Lampa.SettingsApi.addParam({
            component: 'visual_mod_settings',
            param: {
                name: PLUGIN_NAME + '_theme',
                type: 'select',
                values: {
                    oled: 'OLED Черный',
                    midnight: 'Midnight Blue (Синий)',
                    cyberpunk: 'Cyberpunk Neon',
                    emerald: 'Deep Emerald (Изумруд)'
                },
                default: 'oled'
            },
            field: {
                name: 'Цветовая схема',
                description: 'Выберите стиль фона и цветовую палитру интерфейса'
            },
            onChange: function (value) {
                setStorage('theme', value);
                applyStyles();
            }
        });

        // 2. Включение скругления карточек
        Lampa.SettingsApi.addParam({
            component: 'visual_mod_settings',
            param: {
                name: PLUGIN_NAME + '_rounded',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Скругленные углы',
                description: 'Современные мягкие скругления у постеров и кнопок'
            },
            onChange: function (value) {
                setStorage('rounded', value);
                applyStyles();
            }
        });

        // 3. Неоновая подсветка фокуса
        Lampa.SettingsApi.addParam({
            component: 'visual_mod_settings',
            param: {
                name: PLUGIN_NAME + '_glow',
                type: 'trigger',
                default: true
            },
            field: {
                name: 'Свечение при наведении',
                description: 'Неоновый эффект (Glow) вокруг выбранной карточки'
            },
            onChange: function (value) {
                setStorage('glow', value);
                applyStyles();
            }
        });

        Lampa.Noty.show('Плагин оформления интерфейса загружен!');
    }

    if (window.appready) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                initPlugin();
            }
        });
    }
})();
