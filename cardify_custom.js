(function () {
    'use strict';

    var PLUGIN_NAME = 'cinematic_card';
    var CSS_ID = 'lampa-cinematic-card-style';

    function get$() {
        return window.$ || (window.Lampa && window.Lampa.$);
    }

    // 1. Стили видеофона: видео на весь экран под самый верх
    function injectStyles() {
        if (document.getElementById(CSS_ID)) return;

        var css = '' +
            '/* Делаем верхнюю панель прозрачной с мягким градиентом, чтобы видео уходило под самый верх */' +
            '.cinematic-trailer-active .head {' +
            '    background: -webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,0.6)), to(transparent)) !important;' +
            '    background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%) !important;' +
            '    box-shadow: none !important;' +
            '}' +
            '/* Контейнер видео-трейлера на весь экран */' +
            '.cinematic-trailer-layer {' +
            '    position: fixed !important;' +
            '    top: 0 !important;' +
            '    left: 0 !important;' +
            '    width: 100vw !important;' +
            '    height: 100vh !important;' +
            '    overflow: hidden !important;' +
            '    pointer-events: none !important;' +
            '    z-index: 0 !important;' +
            '    opacity: 0;' +
            '    background-color: #000000 !important;' +
            '    transition: opacity 0.8s ease-in-out !important;' +
            '}' +
            '.cinematic-trailer-layer.is-visible {' +
            '    opacity: 1 !important;' +
            '}' +
            '/* Зум 1.18x убирает черные рамки у трейлеров формата 21:9 и растягивает видео до краев */' +
            '.cinematic-trailer-layer iframe {' +
            '    position: absolute !important;' +
            '    top: 50% !important;' +
            '    left: 50% !important;' +
            '    width: 100vw !important;' +
            '    height: 56.25vw !important;' +
            '    min-height: 100vh !important;' +
            '    min-width: 177.77vh !important;' +
            '    -webkit-transform: translate(-50%, -50%) scale(1.18) !important;' +
            '    transform: translate(-50%, -50%) scale(1.18) !important;' +
            '    border: none !important;' +
            '}' +
            '/* Полупрозрачный градиент для читаемости текста */' +
            '.cinematic-trailer-overlay {' +
            '    position: absolute !important;' +
            '    top: 0 !important;' +
            '    left: 0 !important;' +
            '    width: 100% !important;' +
            '    height: 100% !important;' +
            '    background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(10,10,15,0.65) 65%, rgba(10,10,15,0.98) 100%) !important;' +
            '    z-index: 1 !important;' +
            '}' +
            '.full-start, .full-start-new, .activity__body {' +
            '    position: relative !important;' +
            '    z-index: 2 !important;' +
            '}' +
            '.full-start__background.trailer-running {' +
            '    opacity: 0 !important;' +
            '    transition: opacity 0.8s ease-in-out !important;' +
            '}';

        var style = document.createElement('style');
        style.id = CSS_ID;
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // 2. Поиск трейлера
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

    // 3. Запуск трейлера
    function startTrailer(activity, youtubeKey) {
        var $ = get$();
        if (!$ || !activity || !activity.render) return;

        var dom = activity.render();
        var bg = dom.find('.full-start__background');

        var origin = 'https://lampa.mx';
        if (window.location && window.location.origin && window.location.origin.indexOf('http') === 0) {
            origin = window.location.origin;
        }

        var iframeUrl = 'https://www.youtube.com/embed/' + youtubeKey +
            '?autoplay=1&mute=1&controls=0&loop=1&playlist=' + youtubeKey +
            '&playsinline=1&rel=0&showinfo=0&modestbranding=1&enablejsapi=1' +
            '&origin=' + encodeURIComponent(origin);

        var html = '' +
            '<div class="cinematic-trailer-layer">' +
            '    <iframe src="' + iframeUrl + '" ' +
            '        referrerpolicy="strict-origin-when-cross-origin" ' +
            '        allow="autoplay; encrypted-media; fullscreen">' +
            '    </iframe>' +
            '    <div class="cinematic-trailer-overlay"></div>' +
            '</div>';

        var layer = $(html);
        dom.prepend(layer);

        // Делаем шапку полупрозрачной
        $('body').addClass('cinematic-trailer-active');

        var timer = setTimeout(function () {
            layer.addClass('is-visible');
            if (bg && bg.length) {
                bg.addClass('trailer-running');
            }
        }, 800);

        var clean = function (e) {
            if (e.type === 'destroy' || e.type === 'back') {
                clearTimeout(timer);
                $('body').removeClass('cinematic-trailer-active');
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
                    if (e.type === 'complite' || e.type === 'start') {
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

        if (Lampa.Noty) {
            Lampa.Noty.show('Кинематографичные карточки подключены!');
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
