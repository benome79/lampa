(function () {
    'use strict';

    var PLUGIN_NAME = 'cinematic_card';
    var CSS_ID = 'lampa-cinematic-card-style';

    function get$() {
        return window.$ || (window.Lampa && window.Lampa.$);
    }

    // 1. Стили видеофона и кинематографичного вида (ES5)
    function injectStyles() {
        if (document.getElementById(CSS_ID)) return;

        var css = '' +
            '/* Контейнер видео-трейлера на весь экран */' +
            '.cinematic-trailer-layer {' +
            '    position: absolute !important;' +
            '    top: 0 !important;' +
            '    left: 0 !important;' +
            '    width: 100% !important;' +
            '    height: 100% !important;' +
            '    overflow: hidden !important;' +
            '    pointer-events: none !important;' +
            '    z-index: 0 !important;' +
            '    opacity: 0;' +
            '    transition: opacity 1s ease-in-out !important;' +
            '}' +
            '.cinematic-trailer-layer.is-visible {' +
            '    opacity: 1 !important;' +
            '}' +
            '.cinematic-trailer-layer iframe {' +
            '    position: absolute !important;' +
            '    top: 50% !important;' +
            '    left: 50% !important;' +
            '    width: 100vw !important;' +
            '    height: 56.25vw !important;' +
            '    min-height: 100vh !important;' +
            '    min-width: 177.77vh !important;' +
            '    -webkit-transform: translate(-50%, -50%) !important;' +
            '    transform: translate(-50%, -50%) !important;' +
            '    border: none !important;' +
            '}' +
            '/* Градиент затемнения поверх видео, чтобы текст легко читался */' +
            '.cinematic-trailer-overlay {' +
            '    position: absolute !important;' +
            '    top: 0 !important;' +
            '    left: 0 !important;' +
            '    width: 100% !important;' +
            '    height: 100% !important;' +
            '    background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(10,10,15,0.7) 60%, rgba(10,10,15,0.98) 100%) !important;' +
            '    z-index: 1 !important;' +
            '}' +
            '/* Поднимаем элементы карточки над видеоплеером */' +
            '.full-start, .full-start__details, .full-start__buttons, .full-start-new {' +
            '    position: relative !important;' +
            '    z-index: 2 !important;' +
            '}' +
            '/* Мягкое растворение статичного постера */' +
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

    // 2. Извлечение ключа YouTube трейлера
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

    // 3. Запуск трейлера в DOM Lampa
    function startTrailer(activity, youtubeKey) {
        var $ = get$();
        if (!$ || !activity || !activity.render) return;

        var dom = activity.render();
        var bg = dom.find('.full-start__background');

        var iframeUrl = 'https://www.youtube.com/embed/' + youtubeKey +
            '?autoplay=1&mute=1&controls=0&loop=1&playlist=' + youtubeKey +
            '&playsinline=1&rel=0&showinfo=0&modestbranding=1&enablejsapi=1';

        var html = '' +
            '<div class="cinematic-trailer-layer">' +
            '    <iframe src="' + iframeUrl + '" allow="autoplay; encrypted-media; fullscreen"></iframe>' +
            '    <div class="cinematic-trailer-overlay"></div>' +
            '</div>';

        var layer = $(html);
        dom.prepend(layer);

        var timer = setTimeout(function () {
            layer.addClass('is-visible');
            if (bg && bg.length) {
                bg.addClass('trailer-running');
            }
        }, 1200);

        var clean = function (e) {
            if (e.type === 'destroy' || e.type === 'back') {
                clearTimeout(timer);
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
