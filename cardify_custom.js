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
            '    background-color: #000000 !important;' +
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
            '}' +
            '.full-start, .full-start-new, .activity__body {' +
            '    position: relative !important;' +
            '    z-index: 2 !important;' +
            '}' +
            '.full-start__background.trailer-running {' +
            '    opacity: 0 !important;' +
            '    transition: opacity 0.8s ease-in-out !important;' +
            '}' +
            '/* ПАРЯЩИЙ ПОСТЕР С ОБЪЕМНОЙ ТЕНЬЮ */' +
            '.full-start__poster, .full-start-new__poster, .full--poster {' +
            '    border-radius: 18px !important;' +
            '    overflow: hidden !important;' +
            '    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85), 0 0 1px rgba(255, 255, 255, 0.2) !important;' +
            '}' +
            '/* НАВОДИМ ПОРЯДОК В КНОПКАХ */' +
            '/* Скрываем лишние дублирующие строки (Shots, одинокие бейджи) */' +
            '.full-start__status, .full-start__pg, .view--torrent.hide {' +
            '    display: none !important;' +
            '}' +
            '.full-start__buttons, .buttons--container {' +
            '    display: -webkit-box !important;' +
            '    display: -webkit-flex !important;' +
            '    display: flex !important;' +
            '    align-items: center !important;' +
            '    flex-wrap: nowrap !important;' +
            '    margin-top: 1em !important;' +
            '}' +
            '/* Круглая кнопка звука в нативном стиле Lampa */' +
            '.button--sound {' +
            '    display: inline-flex !important;' +
            '    align-items: center !important;' +
            '    justify-content: center !important;' +
            '    cursor: pointer !important;' +
            '}' +
            '.button--sound svg {' +
            '    width: 1.4em !important;' +
            '    height: 1.4em !important;' +
            '    fill: currentColor !important;' +
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

        // Параметры YouTube: полное скрытие элементов управления, стрелок перемотки и аннотаций
        var iframeUrl = 'https://www.youtube.com/embed/' + youtubeKey +
            '?autoplay=1&mute=1&controls=0&loop=1&playlist=' + youtubeKey +
            '&playsinline=1&rel=0&showinfo=0&modestbranding=1&enablejsapi=1' +
            '&disablekb=1&fs=0&iv_load_policy=3' +
            '&origin=' + encodeURIComponent(origin);

        var layer = $('' +
            '<div class="cinematic-trailer-layer">' +
            '    <iframe src="' + iframeUrl + '" ' +
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

        // Кнопка звука в ряду действий
        var soundBtn = null;
        var buttonsContainer = dom.find('.full-start__buttons, .buttons--container');
        if (!buttonsContainer.length) {
            var anyBtn = dom.find('.button--play, .full-start__button:first');
            if (anyBtn.length) buttonsContainer = anyBtn.parent();
        }

        if (buttonsContainer && buttonsContainer.length) {
            buttonsContainer.find('.button--sound').remove();

            soundBtn = $('' +
                '<div class="full-start__button selector button--sound">' +
                '    ' + ICON_MUTED +
                '</div>'
            );

            soundBtn.on('hover:enter click', function (e) {
                if (e) e.stopPropagation();
                toggleSound();
            });

            buttonsContainer.append(soundBtn);
        }

        // Горячая клавиша «Вверх»
        var keyHandler = function (e) {
            if (e.keyCode === 38 || e.code === 'ArrowUp') {
                toggleSound();
            }
        };
        window.removeEventListener('keydown', keyHandler);
        window.addEventListener('keydown', keyHandler);

        var timer = setTimeout(function () {
            layer.addClass('is-visible');
            if (bg && bg.length) {
                bg.addClass('trailer-running');
            }
        }, 800);

        var clean = function (e) {
            if (e.type === 'destroy' || e.type === 'back') {
                clearTimeout(timer);
                window.removeEventListener('keydown', keyHandler);
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
