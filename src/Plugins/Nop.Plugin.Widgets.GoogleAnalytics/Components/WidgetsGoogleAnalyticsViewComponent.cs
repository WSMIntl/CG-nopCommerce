using Microsoft.AspNetCore.Mvc;
using Nop.Core;
using Nop.Core.Domain.Logging;
using Nop.Services.Customers;
using Nop.Services.Logging;
using Nop.Web.Framework.Components;

namespace Nop.Plugin.Widgets.GoogleAnalytics.Components;

public class WidgetsGoogleAnalyticsViewComponent : NopViewComponent
{
    #region Fields

    protected readonly GoogleAnalyticsSettings _googleAnalyticsSettings;
    protected readonly ICustomerService _customerService;
    protected readonly ILogger _logger;
    protected readonly IWorkContext _workContext;

    #endregion

    #region Ctor

    public WidgetsGoogleAnalyticsViewComponent(
        GoogleAnalyticsSettings googleAnalyticsSettings,
        ICustomerService customerService,
        ILogger logger,
        IWorkContext workContext)
    {
        _googleAnalyticsSettings = googleAnalyticsSettings;
        _customerService = customerService;
        _logger = logger;
        _workContext = workContext;
    }

    #endregion

    #region Utilities

    /// <returns>A task that represents the asynchronous operation</returns>
    protected async Task<string> GetScriptAsync()
    {
        try
        {
            var analyticsTrackingScript = _googleAnalyticsSettings.TrackingScript + "\n";
            analyticsTrackingScript = analyticsTrackingScript.Replace("{GOOGLEID}", _googleAnalyticsSettings.GoogleId);
            //remove {ECOMMERCE} (used in previous versions of the plugin)
            analyticsTrackingScript = analyticsTrackingScript.Replace("{ECOMMERCE}", "");
            //remove {CustomerID} (used in previous versions of the plugin)
            analyticsTrackingScript = analyticsTrackingScript.Replace("{CustomerID}", "");

            //whether to include customer identifier
            var customerIdCode = string.Empty;
            var customer = await _workContext.GetCurrentCustomerAsync();
            if (_googleAnalyticsSettings.IncludeCustomerId && !await _customerService.IsGuestAsync(customer))
                customerIdCode = $"gtag('set', {{'user_id': '{customer.Id}'}});{Environment.NewLine}";
            analyticsTrackingScript = analyticsTrackingScript.Replace("{CUSTOMER_TRACKING}", customerIdCode);
            analyticsTrackingScript = analyticsTrackingScript.Replace("{ECOMMERCE_TRACKING}", "");

            if (_googleAnalyticsSettings.SuppressLegacyUniversalAnalytics)
                analyticsTrackingScript = RemoveLegacyUniversalAnalytics(analyticsTrackingScript);

            return PrepareCookiebotTrackingScript(analyticsTrackingScript);
        }
        catch (Exception ex)
        {
            await _logger.InsertLogAsync(LogLevel.Error, "Error creating scripts for Google eCommerce tracking", ex.ToString());
        }

        return "";
    }

    protected virtual string RemoveLegacyUniversalAnalytics(string trackingScript)
    {
        const string legacyId = "UA-49725360-1";
        var escapedId = System.Text.RegularExpressions.Regex.Escape(legacyId);

        // Remove a standalone legacy loader without touching a GA4 loader in the same setting.
        trackingScript = System.Text.RegularExpressions.Regex.Replace(
            trackingScript,
            $"<script\\b[^>]*\\bsrc\\s*=[^>]*{escapedId}[^>]*>\\s*</script>",
            string.Empty,
            System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Singleline);

        // Remove legacy configuration calls when a saved script contains both UA and GA4 code.
        trackingScript = System.Text.RegularExpressions.Regex.Replace(
            trackingScript,
            $"gtag\\s*\\(\\s*(['\\\"])config\\1\\s*,\\s*(['\\\"]){escapedId}\\2\\s*\\)\\s*;?",
            string.Empty,
            System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        trackingScript = System.Text.RegularExpressions.Regex.Replace(
            trackingScript,
            $"ga\\s*\\(\\s*(['\\\"])create\\1\\s*,\\s*(['\\\"]){escapedId}\\2[^)]*\\)\\s*;?",
            string.Empty,
            System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        trackingScript = System.Text.RegularExpressions.Regex.Replace(
            trackingScript,
            $"_gaq\\.push\\s*\\(\\s*\\[\\s*(['\\\"])(?:_setAccount|_createTracker)\\1\\s*,\\s*(['\\\"]){escapedId}\\2[^\\]]*\\]\\s*\\)\\s*;?",
            string.Empty,
            System.Text.RegularExpressions.RegexOptions.IgnoreCase);

        // Remove any remaining legacy-only line, including custom tracking formats.
        return System.Text.RegularExpressions.Regex.Replace(
            trackingScript,
            $"^[^\\r\\n]*{escapedId}[^\\r\\n]*(?:\\r?\\n|$)",
            string.Empty,
            System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Multiline);
    }

    protected virtual string PrepareCookiebotTrackingScript(string trackingScript)
    {
        return System.Text.RegularExpressions.Regex.Replace(trackingScript, "<script\\b(?<attributes>[^>]*)>", match =>
        {
            var attributes = match.Groups["attributes"].Value;

            if (attributes.Contains("data-cookieconsent", StringComparison.OrdinalIgnoreCase))
                return match.Value;

            if (System.Text.RegularExpressions.Regex.IsMatch(attributes, "\\s+type\\s*=\\s*(['\\\"])text/(javascript|ecmascript)\\1", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
                attributes = System.Text.RegularExpressions.Regex.Replace(attributes, "\\s+type\\s*=\\s*(['\\\"])text/(javascript|ecmascript)\\1", " type=\"text/plain\"", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            else if (!System.Text.RegularExpressions.Regex.IsMatch(attributes, "\\s+type\\s*=", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
                attributes += " type=\"text/plain\"";

            return $"<script{attributes} data-cookieconsent=\"statistics\">";
        }, System.Text.RegularExpressions.RegexOptions.IgnoreCase);
    }

    #endregion

    #region Methods

    /// <returns>A task that represents the asynchronous operation</returns>
    public async Task<IViewComponentResult> InvokeAsync(string widgetZone, object additionalData)
    {
        var script = await GetScriptAsync();
        return View("~/Plugins/Widgets.GoogleAnalytics/Views/PublicInfo.cshtml", script);
    }

    #endregion
}
