(function () {
    'use strict';

    function hasConsent(placeholder) {
        var category = placeholder.getAttribute('data-cookie-category') || 'statistics';
        return window.Cookiebot && window.Cookiebot.consent && window.Cookiebot.consent[category] === true;
    }

    function loadConsentMedia() {
        document.querySelectorAll('[data-cookiebot-consent-media], [data-cookiebot-statistics-media]').forEach(function (placeholder) {
            if (!hasConsent(placeholder)) {
                return;
            }

            if (placeholder.querySelector('iframe')) {
                return;
            }

            var iframe = document.createElement('iframe');
            iframe.src = placeholder.getAttribute('data-src');
            iframe.title = placeholder.getAttribute('data-title') || 'Embedded video';
            iframe.width = placeholder.getAttribute('data-width') || '100%';
            iframe.height = placeholder.getAttribute('data-height') || '360';
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', placeholder.getAttribute('data-allow') || 'autoplay; fullscreen; picture-in-picture');
            iframe.setAttribute('allowfullscreen', '');
            placeholder.replaceChildren(iframe);
        });
    }

    function clearConsentMedia() {
        document.querySelectorAll('[data-cookiebot-consent-media], [data-cookiebot-statistics-media]').forEach(function (placeholder) {
            var iframe = placeholder.querySelector('iframe');
            if (iframe) {
                iframe.remove();
            }
            if (!placeholder.querySelector('p')) {
                var message = document.createElement('p');
                message.textContent = placeholder.getAttribute('data-message') || 'This content is available after the required cookies are accepted.';
                placeholder.appendChild(message);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', loadConsentMedia);
    window.addEventListener('CookiebotOnAccept', loadConsentMedia);
    window.addEventListener('CookiebotOnDecline', clearConsentMedia);
    window.addEventListener('CookiebotOnConsentWithdrawal', clearConsentMedia);
}());
