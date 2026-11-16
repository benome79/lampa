(function () {
    'use strict';

    var PLUGIN_NAME = 'cinematic_card';
    var CSS_ID = 'lampa-cinematic-card-style';

    function get$() {
        return window.$ || (window.Lampa && window.Lampa.$);
    }

    // 1. Премиальные стили: Кино-виньетка, парящий постер, чистые кнопки и скрытие стрелок YouTube
    function injectStyles() {
        if (document.getElementById(CSS_ID)) return;

        var css = '' +
            '/* Прозрачная верхняя панель */' +
            '.cinematic-trailer-active .head {' +
            '    background: -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,0.6)), to(transparent)) !important;' +
            '    background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%) !important;' +
            '    box-shadow: none !important;' +
            '}' +
            '/* Полноэкранный слой видео-трейлера */' +
            '.cinematic-trailer-layer {' +
            '    position: fixed !important;' +
            '    top: 0 !important;' +
            '    left: 0 !important;' +
            '    width: 100vw !important;' +
            '    height: 100vh !important;' +
            '    overflow: hidden !important;' +
            '    pointer-events: none !important;' +
            '    user-select: none !important;' +
            '    z-index: 0 !important;' +
            '    opacity: 0;' +
            '    background-color: transparent !important;' +
            '    transition: opacity 0.8s ease-in-out !important;' +
            '}' +
            '.cinematic-trailer-layer.is-visible {' +
            '    opacity: 1 !important;' +
            '}' +
            '/* Растягивание видео со скрытием рамок и интерфейса YouTube */' +
            '.cinematic-trailer-layer iframe {' +
            '    position: absolute !important;' +
            '    top: 50% !important;' +
            '    left: 50% !important;' +
            '    width: 100vw !important;' +
            '    height: 56.25vw !important;' +
            '    min-height: 100vh !important;' +
            '    min-width: 177.77vh !important;' +
            '    -webkit-transform: translate(-50%, -50%) scale(1.22) !important;' +
            '    transform: translate(-50%, -50%) scale(1.22) !important;' +
            '    border: none !important;' +
            '    pointer-events: none !important;' +
            '}' +
            '/* КИНОТЕАТРАЛЬНЫЙ ГРАДИЕНТ (СЛЕВА НАПРАВО + СНИЗУ ВВЕРХ) */' +
            '/* Обеспечивает 100% читаемость текста на ярких дневных сценах */' +
            '.cinematic-trailer-overlay {' +
            '    position: absolute !important;' +
            '    top: 0 !important;' +
            '    left: 0 !important;' +
            '    width: 100% !important;' +
            '    height: 100% !important;' +
            '    background: ' +
            '        linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 35%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0) 100%), ' +
            '        linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(10,10,15,0.4) 60%, rgba(10,10,15,0.96) 100%) !important;' +
            '    z-index: 1 !important;' +
            '    pointer-events: auto !important;' +
            '}' +
            '.full-start, .full-start-new, .activity__body {' +
            '    position: relative !important;' +
            '    z-index: 2 !important;' +
            '}' +
            '.full-start__background {' +
            '    transition: opacity 1s ease-in-out !important;' +
            '}' +
            '.full-start__background.trailer-running {' +
            '    opacity: 0 !important;' +
            '}' +
            '/* ПАРЯЩИЙ ПОСТЕР С ОБЪЕМНОЙ ТЕНЬЮ */' +
            '.full-start__poster, .full-start-new__poster, .full--poster {' +
            '    border-radius: 18px !important;' +
            '    overflow: hidden !important;' +
            '    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85), 0 0 1px rgba(255, 255, 255, 0.2) !important;' +
            '}' +
            '/* НАВОДИМ ПОРЯДОК В КНОПКАХ: СКРЫВАЕМ ЛИШНИЕ И ДЕЛАЕМ ЕДИНЫЙ РЯД */' +
            '/* Скрываем дублирующие строки, Shots, Трейлеры, Колокольчик (подписки) и нижние контейнеры */' +
            '.full-start__status, .full-start__pg, .view--torrent, .button--shots, .view--shots, .view--trailer, .button--trailer, .view--subs, .button--subs, .view--sub, .view--subscribe, .button--subscribe, .button--notice, .view--notice, .view--bell, .button--bell, .button--notification, .view--notification, .buttons--container {' +
            '    display: none !important;' +
            '}' +
            '/* Единый горизонтальный ряд кнопок действий */' +
            '.full-start__buttons, .full-start-new__buttons {' +
            '    display: -webkit-box !important;' +
            '    display: -webkit-flex !important;' +
            '    display: flex !important;' +
            '    -webkit-box-align: center !important;' +
            '    -webkit-align-items: center !important;' +
            '    align-items: center !important;' +
            '    flex-wrap: nowrap !important;' +
            '    margin-top: 1.2em !important;' +
            '}' +
            '/* 1. ГЛАВНАЯ КНОПКА: APPLE TV PRIMARY PILL (Смотреть) */' +
            '.full-start__button:first-child, .full-start-new__button:first-child, .button--play, .view--play {' +
            '    width: auto !important;' +
            '    min-width: 9.5em !important;' +
            '    height: 3.2em !important;' +
            '    border-radius: 2em !important;' +
            '    -webkit-border-radius: 2em !important;' +
            '    display: -webkit-inline-box !important;' +
            '    display: -webkit-inline-flex !important;' +
            '    display: inline-flex !important;' +
            '    -webkit-box-align: center !important;' +
            '    -webkit-align-items: center !important;' +
            '    align-items: center !important;' +
            '    -webkit-box-pack: center !important;' +
            '    -webkit-justify-content: center !important;' +
            '    justify-content: center !important;' +
            '    padding: 0 1.6em !important;' +
            '    margin: 0 0.8em 0 0 !important;' +
            '    background: rgba(255, 255, 255, 0.92) !important;' +
            '    border: 1px solid rgba(255, 255, 255, 1) !important;' +
            '    color: #0b0b10 !important;' +
            '    font-size: 1em !important;' +
            '    cursor: pointer !important;' +
            '    white-space: nowrap !important;' +
            '    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;' +
            '    -webkit-transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;' +
            '    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35) !important;' +
            '}' +
            '.full-start__button:first-child svg, .full-start-new__button:first-child svg, .button--play svg, .view--play svg {' +
            '    width: 1.3em !important;' +
            '    height: 1.3em !important;' +
            '    margin-right: 0.6em !important;' +
            '    fill: #0b0b10 !important;' +
            '    flex-shrink: 0 !important;' +
            '}' +
            '.full-start__button:first-child span, .full-start-new__button:first-child span, .button--play span, .view--play span {' +
            '    display: inline-block !important;' +
            '    font-size: 1.05em !important;' +
            '    font-weight: 600 !important;' +
            '    letter-spacing: 0.015em !important;' +
            '    color: #0b0b10 !important;' +
            '}' +
            '.full-start__button:first-child.focus, .full-start-new__button:first-child.focus, .button--play.focus, .view--play.focus {' +
            '    background: #ffffff !important;' +
            '    transform: scale(1.06) !important;' +
            '    -webkit-transform: scale(1.06) !important;' +
            '    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.75) !important;' +
            '}' +
            '/* 2. ВТОРИЧНЫЕ КНОПКИ: APPLE TV CIRCULAR SATELLITES (Звук, Закладка, Галочка, ...) */' +
            '.full-start__button:not(.button--play):not(.view--play):not(:first-child), .full-start-new__button:not(.button--play):not(.view--play):not(:first-child), .button--sound {' +
            '    width: 2.8em !important;' +
            '    height: 2.8em !important;' +
            '    min-width: 2.8em !important;' +
            '    max-width: 2.8em !important;' +
            '    border-radius: 50% !important;' +
            '    -webkit-border-radius: 50% !important;' +
            '    display: -webkit-inline-box !important;' +
            '    display: -webkit-inline-flex !important;' +
            '    display: inline-flex !important;' +
            '    -webkit-box-align: center !important;' +
            '    -webkit-align-items: center !important;' +
            '    align-items: center !important;' +
            '    -webkit-box-pack: center !important;' +
            '    -webkit-justify-content: center !important;' +
            '    justify-content: center !important;' +
            '    padding: 0 !important;' +
            '    margin: 0 0.8em 0 0 !important;' +
            '    background: rgba(255, 255, 255, 0.14) !important;' +
            '    border: 1px solid rgba(255, 255, 255, 0.18) !important;' +
            '    color: #ffffff !important;' +
            '    cursor: pointer !important;' +
            '    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;' +
            '    -webkit-transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;' +
            '}' +
            '.full-start__button:not(.button--play):not(.view--play):not(:first-child) svg, .full-start-new__button:not(.button--play):not(.view--play):not(:first-child) svg, .button--sound svg {' +
            '    width: 1.2em !important;' +
            '    height: 1.2em !important;' +
            '    margin: 0 !important;' +
            '    fill: currentColor !important;' +
            '    flex-shrink: 0 !important;' +
            '}' +
            '/* Скрываем текст внутри круглых спутников ВСЕГДА (и в обычном состоянии, и при фокусе) */' +
            '.full-start__button:not(.button--play):not(.view--play):not(:first-child) span, .full-start__button:not(.button--play):not(.view--play):not(:first-child).focus span, .full-start-new__button:not(.button--play):not(.view--play):not(:first-child) span, .full-start-new__button:not(.button--play):not(.view--play):not(:first-child).focus span, .button--sound span, .button--sound.focus span {' +
            '    display: none !important;' +
            '}' +
            '/* Подсветка круглых спутников при наведении пульта */' +
            '.full-start__button:not(.button--play):not(.view--play):not(:first-child).focus, .full-start-new__button:not(.button--play):not(.view--play):not(:first-child).focus, .button--sound.focus {' +
            '    background: #ffffff !important;' +
            '    color: #0b0b10 !important;' +
            '    transform: scale(1.1) !important;' +
            '    -webkit-transform: scale(1.1) !important;' +
            '    box-shadow: 0 0 18px rgba(255, 255, 255, 0.65) !important;' +
            '}' +
            '.full-start__button:not(.button--play):not(.view--play):not(:first-child).focus svg, .full-start-new__button:not(.button--play):not(.view--play):not(:first-child).focus svg, .button--sound.focus svg {' +
            '    fill: #0b0b10 !important;' +
            '}' +
            '/* КОМПАКТНОЕ ПАРЯЩЕЕ УВЕДОМЛЕНИЕ-КАПСУЛА */' +
            '.noty {' +
            '    position: fixed !important;' +
            '    left: 50% !important;' +
            '    bottom: 2em !important;' +
            '    transform: translateX(-50%) !important;' +
            '    -webkit-transform: translateX(-50%) !important;' +
            '    width: auto !important;' +
            '    min-width: 140px !important;' +
            '    max-width: 75% !important;' +
            '    padding: 0.45em 1.3em !important;' +
            '    background: rgba(16, 16, 22, 0.88) !important;' +
            '    color: #ffffff !important;' +
            '    font-size: 0.95em !important;' +
            '    font-weight: 500 !important;' +
            '    letter-spacing: 0.015em !important;' +
            '    text-align: center !important;' +
            '    border-radius: 25px !important;' +
            '    border: 1px solid rgba(255, 255, 255, 0.2) !important;' +
            '    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.7), 0 0 10px rgba(255, 255, 255, 0.06) !important;' +
            '    backdrop-filter: blur(18px) !important;' +
            '    -webkit-backdrop-filter: blur(18px) !important;' +
            '    pointer-events: none !important;' +
            '    z-index: 99999 !important;' +
            '    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;' +
            '}' +
            '/* СТИЛЬ ЛЕВОГО МЕНЮ: КИНОТЕАТРАЛЬНЫЙ ГРАДИЕНТ И ЧЕТКАЯ ПЛАШКА */' +
            '.wrap__left {' +
            '    background: linear-gradient(to right, rgba(10, 10, 14, 0.96) 0%, rgba(10, 10, 14, 0.88) 80%, rgba(10, 10, 14, 0.5) 100%) !important;' +
            '    backdrop-filter: blur(20px) !important;' +
            '    -webkit-backdrop-filter: blur(20px) !important;' +
            '    border-right: 1px solid rgba(255, 255, 255, 0.08) !important;' +
            '    box-shadow: 10px 0 35px rgba(0, 0, 0, 0.6) !important;' +
            '}' +
            'body.menu--open .wrap__left, body.menu--always.menu--open .wrap__left > .scroll {' +
            '    width: 17em !important;' +
            '}' +
            '.wrap__left > .scroll, .menu {' +
            '    background: transparent !important;' +
            '}' +
            '.menu__item {' +
            '    border-radius: 14px !important;' +
            '    -webkit-border-radius: 14px !important;' +
            '    background: transparent !important;' +
            '    color: rgba(255, 255, 255, 0.85) !important;' +
            '    transition: all 0.2s ease !important;' +
            '    -webkit-transition: all 0.2s ease !important;' +
            '}' +
            '.menu__item .menu__ico {' +
            '    opacity: 0.9 !important;' +
            '    transition: transform 0.2s ease !important;' +
            '    -webkit-transition: -webkit-transform 0.2s ease !important;' +
            '}' +
            '.menu__item .menu__text {' +
            '    font-weight: 400 !important;' +
            '    color: rgba(255, 255, 255, 0.88) !important;' +
            '    letter-spacing: 0.015em !important;' +
            '    white-space: nowrap !important;' +
            '}' +
            '/* АКТИВНЫЙ ПУНКТ МЕНЮ: КОНТРАСТНАЯ ЧЕТКАЯ ПЛАШКА */' +
            '.menu__item.focus {' +
            '    background: #ffffff !important;' +
            '    color: #0b0b10 !important;' +
            '    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 255, 255, 0.4) !important;' +
            '}' +
            '.menu__item.focus .menu__ico {' +
            '    opacity: 1 !important;' +
            '    color: #0b0b10 !important;' +
            '    transform: scale(1.08) !important;' +
            '    -webkit-transform: scale(1.08) !important;' +
            '}' +
            '.menu__item.focus .menu__text {' +
            '    color: #0b0b10 !important;' +
            '    font-weight: 600 !important;' +
            '}' +
            '.menu__split {' +
            '    border-top: 1px solid rgba(255, 255, 255, 0.08) !important;' +
            '    margin: 0.8em 1.2em !important;' +
            '}';

        var style = document.createElement('style');
        style.id = CSS_ID;
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // 2. Поиск YouTube трейлера
    function getTrailerKey(data) {
        if (!data || !data.videos || !data.videos.results || !data.videos.results.length) {
            return null;
        }

        var results = data.videos.results;
        var list = [];
        var i;

        for (i = 0; i < results.length; i++) {
            var item = results[i];
            if (item.site === 'YouTube' && (item.type === 'Trailer' || item.type === 'Teaser')) {
                list.push(item);
            }
        }

        if (!list.length) {
            for (i = 0; i < results.length; i++) {
                if (results[i].site === 'YouTube') {
                    list.push(results[i]);
                }
            }
        }

        if (!list.length) return null;

        var lang = (Lampa.Storage && Lampa.Storage.get('language', 'uk')) || 'uk';

        for (i = 0; i < list.length; i++) {
            if (list[i].iso_639_1 === lang || list[i].iso_639_1 === 'ru') {
                return list[i].key;
            }
        }

        return list[0].key;
    }

    var ICON_MUTED = '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
    var ICON_UNMUTED = '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';

    // 3. Запуск трейлера
    function startTrailer(activity, youtubeKey) {
        var $ = get$();
        if (!$ || !activity || !activity.render) return;

        var dom = activity.render();
        var bg = dom.find('.full-start__background');

        // Защита от дубликатов
        dom.find('.cinematic-trailer-layer').remove();

        var origin = 'https://lampa.mx';
        if (window.location && window.location.origin && window.location.origin.indexOf('http') === 0) {
            origin = window.location.origin;
        }

        // Параметры YouTube: строго без playlist (убирает стрелки |< и >|), скрытие элементов управления
        var iframeUrl = 'https://www.youtube-nocookie.com/embed/' + youtubeKey +
            '?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&showinfo=0&modestbranding=1&enablejsapi=1' +
            '&disablekb=1&fs=0&iv_load_policy=3' +
            '&origin=' + encodeURIComponent(origin);

        var layer = $('' +
            '<div class="cinematic-trailer-layer">' +
            '    <iframe src="' + iframeUrl + '" ' +
            '        tabindex="-1" aria-hidden="true" ' +
            '        referrerpolicy="strict-origin-when-cross-origin" ' +
            '        allow="autoplay; encrypted-media; fullscreen">' +
            '    </iframe>' +
            '    <div class="cinematic-trailer-overlay"></div>' +
            '</div>'
        );

        dom.prepend(layer);
        $('body').addClass('cinematic-trailer-active');

        var iframeEl = layer.find('iframe')[0];
        var isMuted = true;

        function sendYTCommand(func, args) {
            try {
                if (iframeEl && iframeEl.contentWindow) {
                    iframeEl.contentWindow.postMessage(JSON.stringify({
                        event: 'command',
                        func: func,
                        args: args || []
                    }), '*');
                }
            } catch (e) {}
        }

        var hasStarted = false;
        var hasEnded = false;
        var loadTimeout = null;

        function revealTrailer() {
            if (hasStarted || hasEnded) return;
            hasStarted = true;
            if (loadTimeout) {
                clearTimeout(loadTimeout);
                loadTimeout = null;
            }
            layer.addClass('is-visible');
            if (bg && bg.length) {
                bg.addClass('trailer-running');
            }
            if (soundBtn) {
                soundBtn.css('display', '');
            }
        }

        function endTrailer() {
            if (hasEnded) return;
            hasEnded = true;
            if (loadTimeout) {
                clearTimeout(loadTimeout);
                loadTimeout = null;
            }

            // Плавное возвращение к оригинальному постеру (кинематографичный fade-out)
            layer.removeClass('is-visible');
            if (bg && bg.length) {
                bg.removeClass('trailer-running');
            }
            $('body').removeClass('cinematic-trailer-active');

            if (soundBtn) {
                soundBtn.remove();
            }

            setTimeout(function () {
                layer.remove();
            }, 1200);
        }

        // Подключаем handshake с YouTube IFrame API и команду на воспроизведение
        if (iframeEl) {
            iframeEl.onload = function () {
                try {
                    if (iframeEl.contentWindow) {
                        iframeEl.contentWindow.postMessage(JSON.stringify({
                            event: 'listening'
                        }), '*');
                        sendYTCommand('playVideo');
                    }
                } catch (e) {}
            };
        }

        // Слушатель событий плеера YouTube
        var onMessage = function (event) {
            try {
                var data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                if (!data) return;

                // Ошибка видео или запрет встраивания правообладателем — возвращаем стандартный постер
                if (data.event === 'onError' || (data.info && data.info.error)) {
                    endTrailer();
                    return;
                }

                var state = null;
                if (data.event === 'infoDelivery' && data.info && data.info.playerState !== undefined) {
                    state = data.info.playerState;
                } else if (data.event === 'onStateChange') {
                    state = data.info;
                }

                // 1 = YT.PlayerState.PLAYING (видео реально пошло!)
                if (state === 1) {
                    revealTrailer();
                }
                // 2 = YT.PlayerState.PAUSED (плеер встал на паузу — немедленно возобновляем показ и прячем значок ||)
                else if (state === 2) {
                    sendYTCommand('playVideo');
                }
                // 0 = YT.PlayerState.ENDED (трейлер закончился)
                else if (state === 0) {
                    endTrailer();
                }
            } catch (err) {}
        };
        window.addEventListener('message', onMessage);

        function toggleSound() {
            if (isMuted) {
                sendYTCommand('unMute');
                sendYTCommand('setVolume', [85]);
                isMuted = false;
                if (soundBtn) soundBtn.html(ICON_UNMUTED);
                if (Lampa.Noty) Lampa.Noty.show('Звук трейлера увімкнено');
            } else {
                sendYTCommand('mute');
                isMuted = true;
                if (soundBtn) soundBtn.html(ICON_MUTED);
                if (Lampa.Noty) Lampa.Noty.show('Звук трейлера вимкнено');
            }
        }

        // Кнопка звука в ряду действий (изначально скрыта, пока видео не пошло)
        var soundBtn = null;
        var buttonsContainer = dom.find('.full-start__buttons, .full-start-new__buttons');
        if (!buttonsContainer.length) {
            var anyBtn = dom.find('.button--play, .full-start__button:first');
            if (anyBtn.length) buttonsContainer = anyBtn.parent();
        }

        if (buttonsContainer && buttonsContainer.length) {
            // Удаляем кнопку колокольчика (подписки на серии)
            buttonsContainer.find('.view--subs, .button--subs, .view--sub, .view--subscribe, .button--subscribe, .button--notice, .view--notice, .view--bell, .button--bell, .button--notification, .view--notification').remove();
            buttonsContainer.find('.full-start__button, .full-start-new__button').each(function () {
                var b = $(this);
                var html = b.html() || '';
                if (html.indexOf('M12 22') !== -1 || html.indexOf('M18 16') !== -1 || html.indexOf('bell') !== -1 || html.indexOf('notify') !== -1 || html.indexOf('Підпис') !== -1 || html.indexOf('Подпис') !== -1 || html.indexOf('Сповіщ') !== -1 || html.indexOf('Уведомл') !== -1) {
                    b.remove();
                }
            });

            buttonsContainer.find('.button--sound').remove();

            soundBtn = $('' +
                '<div class="full-start__button selector button--sound" style="display: none;">' +
                '    ' + ICON_MUTED +
                '</div>'
            );

            // Раздельная регистрация для пульта ТВ (hover:enter) и кликов
            soundBtn.on('hover:enter', function (e) {
                if (e && e.stopPropagation) e.stopPropagation();
                toggleSound();
            });

            soundBtn.on('click', function (e) {
                if (e && e.stopPropagation) e.stopPropagation();
                toggleSound();
            });

            if (soundBtn[0]) {
                soundBtn[0].onclick = function (e) {
                    if (e && e.stopPropagation) e.stopPropagation();
                    toggleSound();
                };
            }

            // Ставим кнопку звука СРАЗУ ПОСЛЕ кнопки «Дивитись» (и ПЕРЕД закладками)
            var playBtn = buttonsContainer.find('.button--play, .view--play, .full-start__button:first');
            if (playBtn.length) {
                soundBtn.insertAfter(playBtn);
            } else {
                buttonsContainer.prepend(soundBtn);
            }
        }

        // Таймаут безопасности: если за 12 секунд видео не загрузилось из-за слабого интернета — оставляем стандартный постер
        loadTimeout = setTimeout(function () {
            if (!hasStarted) {
                endTrailer();
            }
        }, 12000);

        var clean = function (e) {
            if (e.type === 'destroy' || e.type === 'back') {
                if (loadTimeout) clearTimeout(loadTimeout);
                window.removeEventListener('message', onMessage);
                $('body').removeClass('cinematic-trailer-active');
                if (soundBtn) soundBtn.remove();
                layer.remove();
                if (bg && bg.length) {
                    bg.removeClass('trailer-running');
                }
                if (Lampa.Listener && Lampa.Listener.remove) {
                    Lampa.Listener.remove('activity', clean);
                }
            }
        };

        if (Lampa.Listener && Lampa.Listener.follow) {
            Lampa.Listener.follow('activity', clean);
        }
    }

    function init() {
        injectStyles();

        if (Lampa.Listener) {
            Lampa.Listener.follow('full', function (e) {
                try {
                    if (e.type === 'complite') {
                        var key = getTrailerKey(e.data);
                        var activity = e.object && e.object.activity;
                        if (key && activity) {
                            startTrailer(activity, key);
                        }
                    }
                } catch (err) {
                    console.error('Cinematic trailer error:', err);
                }
            });
        }
    }

    if (window.appready) {
        init();
    } else {
        if (window.Lampa && Lampa.Listener) {
            Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') init();
            });
        }
    }
})();
