(function () {
    'use strict';

    var PLUGIN_NAME = 'cinematic_card';
    var CSS_ID = 'lampa-cinematic-card-style';

    function get$() {
        return window.$ || (window.Lampa && window.Lampa.$);
    }

    // 1. Внедрение стилей нового вида карточки и видеофона (чистый ES5)
    function injectStyles() {
        if (document.getElementById(CSS_ID)) return;

        var css = '' +
            '.cinematic-card-active .full-start-new__body {' +
            '    height: 75vh !important;' +
            '    display: -webkit-box !important;' +
            '    display: -webkit-flex !important;' +
            '    display: flex !important;' +
            '    -webkit-box-orient: vertical !important;' +
            '    -webkit-box-direction: normal !important;' +
            '    -webkit-flex-direction: column !important;' +
            '    flex-direction: column !important;' +
            '    -webkit-box-pack: end !important;' +
            '    -webkit-justify-content: flex-end !important;' +
            '    justify-content: flex-end !important;' +
            '    position: relative !important;' +
            '}' +
            '.cinematic-card-active .full-start-new__bg {' +
            '    mask-image: -webkit-gradient(linear, left top, left bottom, color-stop(50%, black), to(transparent)) !important;' +
            '    mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;' +
            '    -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%) !important;' +
            '    transition: opacity 0.6s ease-in-out !important;' +
            '}' +
            '.cinematic-trailer-container {' +
            '    position: absolute !important;' +
            '    top: 0 !important;' +
            '    left: 0 !important;' +
            '    width: 100% !important;' +
            '    height: 100% !important;' +
            '    overflow: hidden !important;' +
            '    pointer-events: none !important;' +
            '    z-index: 1 !important;' +
            '    opacity: 0;' +
            '    transition: opacity 0.8s ease-in-out !important;' +
            '}' +
            '.cinematic-trailer-container.visible {' +
            '    opacity: 1 !important;' +
            '}' +
            '.cinematic-trailer-iframe {' +
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
            '    pointer-events: none !important;' +
            '}' +
            '.cinematic-trailer-overlay {' +
            '    position: absolute !important;' +
            '    top: 0 !important;' +
            '    left: 0 !important;' +
            '    width: 100% !important;' +
            '    height: 100% !important;' +
            '    background: -webkit-gradient(linear, left top, left bottom, from(rgba(10,10,15,0.2)), color-stop(85%, rgba(10,10,15,0.85)), to(#0a0a0f)) !important;' +
            '    background: linear-gradient(to bottom, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.85) 85%, #0a0a0f 100%) !important;' +
            '    z-index: 2 !important;' +
            '}' +
            '.cinematic-card-active .full-start-new__left,' +
            '.cinematic-card-active .full-start-new__right {' +
            '    position: relative !important;' +
            '    z-index: 5 !important;' +
            '}' +
            '.cinematic-card-active .full-start-new__buttons .button {' +
            '    border-radius: 10px !important;' +
            '}';

        var style = document.createElement('style');
        style.id = CSS_ID;
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // 2. Поиск YouTube трейлера (ES5 совместимый)
    function findBestTrailer(data) {
        if (!data || !data.videos || !data.videos.results || !data.videos.results.length) {
            return null;
        }

        var results = data.videos.results;
        var trailers = [];
        var i;

        for (i = 0; i < results.length; i++) {
            var v = results[i];
            if (v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')) {
                trailers.push(v);
            }
        }

        if (!trailers.length) {
            for (i = 0; i < results.length; i++) {
                if (results[i].site === 'YouTube') {
                    trailers.push(results[i]);
                }
            }
        }

        if (!trailers.length) return null;

        var userLang = (Lampa.Storage && Lampa.Storage.get('language', 'uk')) || 'uk';

        for (i = 0; i < trailers.length; i++) {
            if (trailers[i].iso_639_1 === userLang || trailers[i].iso_639_1 === 'ru') {
                return trailers[i].key;
            }
        }

        return trailers[0].key;
    }

    // 3. Запуск видео на фоне карточки
    function attachTrailer(cardElement, youtubeKey) {
        if (!youtubeKey) return;
        var $ = get$();
        if (!$) return;

        var body = cardElement.find('.full-start-new__body');
        if (!body || !body.length) return;

        cardElement.addClass('cinematic-card-active');

        var origin = '';
        try {
            origin = encodeURIComponent(window.location.origin || '');
        } catch (err) {}

        var iframeSrc = 'https://www.youtube-nocookie.com/embed/' + youtubeKey +
            '?autoplay=1&mute=1&controls=0&loop=1&playlist=' + youtubeKey +
            '&enablejsapi=1&origin=' + origin;

        var html = '<div class="cinematic-trailer-container">' +
            '<iframe class="cinematic-trailer-iframe" src="' + iframeSrc + '" allow="autoplay; encrypted-media"></iframe>' +
            '<div class="cinematic-trailer-overlay"></div>' +
            '</div>';

        var container = $(html);
        body.prepend(container);

        setTimeout(function () {
            container.addClass('visible');
        }, 1200);

        var cleanHandler = function (e) {
            if (e.type === 'destroy' || e.type === 'back') {
                container.remove();
                if (Lampa.Listener && Lampa.Listener.remove) {
                    Lampa.Listener.remove('activity', cleanHandler);
                }
            }
        };

        if (Lampa.Listener && Lampa.Listener.follow) {
            Lampa.Listener.follow('activity', cleanHandler);
        }
    }

    // 4. Инициализация плагина
    function startPlugin() {
        try {
            injectStyles();

            if (Lampa.SettingsApi) {
                Lampa.SettingsApi.addComponent({
                    component: 'cinematic_card_settings',
                    name: 'Кинематографичные карточки',
                    icon: '<svg height="24" width="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>'
                });

                Lampa.SettingsApi.addParam({
                    component: 'cinematic_card_settings',
                    param: {
                        name: PLUGIN_NAME + '_trailers_enabled',
                        type: 'trigger',
                        default: true
                    },
                    field: {
                        name: 'Живые видео-трейлеры',
                        description: 'Автоматически проигрывать трейлер на фоне карточки фильма'
                    }
                });
            }

            if (Lampa.Listener) {
                Lampa.Listener.follow('full', function (e) {
                    try {
                        var enabled = true;
                        if (Lampa.Storage && Lampa.Storage.get) {
                            enabled = Lampa.Storage.get(PLUGIN_NAME + '_trailers_enabled', true);
                        }
                        if (!enabled) return;

                        if (e.type === 'complite' || e.type === 'start') {
                            var youtubeKey = findBestTrailer(e.data);
                            if (youtubeKey && e.object && e.object.html) {
                                attachTrailer(e.object.html, youtubeKey);
                            }
                        }
                    } catch (cardErr) {
                        console.error('CinematicCard error on full:', cardErr);
                    }
                });
            }

            if (Lampa.Noty) {
                Lampa.Noty.show('Кинематографичные карточки активированы!');
            }
        } catch (initErr) {
            console.error('CinematicCard init error:', initErr);
        }
    }

    if (window.appready) {
        startPlugin();
    } else {
        if (window.Lampa && Lampa.Listener) {
            Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') {
                    startPlugin();
                }
            });
        }
    }
})();
