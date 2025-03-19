using Microsoft.AspNetCore.Mvc;
using Nop.Core;
using Nop.Plugin.Widgets.NivoSlider.Models;
using Nop.Services.Configuration;
using Nop.Services.Localization;
using Nop.Services.Media;
using Nop.Services.Messages;
using Nop.Services.Security;
using Nop.Web.Framework;
using Nop.Web.Framework.Controllers;
using Nop.Web.Framework.Mvc.Filters;

namespace Nop.Plugin.Widgets.NivoSlider.Controllers;

[AuthorizeAdmin]
[Area(AreaNames.ADMIN)]
[AutoValidateAntiforgeryToken]
public class WidgetsNivoSliderController : BasePluginController
{
    protected readonly ILocalizationService _localizationService;
    protected readonly INotificationService _notificationService;
    protected readonly IPermissionService _permissionService;
    protected readonly IPictureService _pictureService;
    protected readonly ISettingService _settingService;
    protected readonly IStoreContext _storeContext;

    public WidgetsNivoSliderController(ILocalizationService localizationService,
        INotificationService notificationService,
        IPermissionService permissionService,
        IPictureService pictureService,
        ISettingService settingService,
        IStoreContext storeContext)
    {
        _localizationService = localizationService;
        _notificationService = notificationService;
        _permissionService = permissionService;
        _pictureService = pictureService;
        _settingService = settingService;
        _storeContext = storeContext;
    }

    public async Task<IActionResult> Configure()
    {
        if (!await _permissionService.AuthorizeAsync(StandardPermissionProvider.ManageWidgets))
            return AccessDeniedView();

        //load settings for a chosen store scope
        var storeScope = await _storeContext.GetActiveStoreScopeConfigurationAsync();
        var nivoSliderSettings = await _settingService.LoadSettingAsync<NivoSliderSettings>(storeScope);
        var model = new ConfigurationModel
        {
            Picture1Id = nivoSliderSettings.Picture1Id,
            Text1 = nivoSliderSettings.Text1,
            Link1 = nivoSliderSettings.Link1,
            AltText1 = nivoSliderSettings.AltText1,
            Picture2Id = nivoSliderSettings.Picture2Id,
            Text2 = nivoSliderSettings.Text2,
            Link2 = nivoSliderSettings.Link2,
            AltText2 = nivoSliderSettings.AltText2,
            Picture3Id = nivoSliderSettings.Picture3Id,
            Text3 = nivoSliderSettings.Text3,
            Link3 = nivoSliderSettings.Link3,
            AltText3 = nivoSliderSettings.AltText3,
            Picture4Id = nivoSliderSettings.Picture4Id,
            Text4 = nivoSliderSettings.Text4,
            Link4 = nivoSliderSettings.Link4,
            AltText4 = nivoSliderSettings.AltText4,
            Picture5Id = nivoSliderSettings.Picture5Id,
            Text5 = nivoSliderSettings.Text5,
            Link5 = nivoSliderSettings.Link5,
            AltText5 = nivoSliderSettings.AltText5,
            Picture6Id = nivoSliderSettings.Picture6Id,
            Text6 = nivoSliderSettings.Text6,
            Link6 = nivoSliderSettings.Link6,
            AltText6 = nivoSliderSettings.AltText6,
            Picture7Id = nivoSliderSettings.Picture7Id,
            Text7 = nivoSliderSettings.Text7,
            Link7 = nivoSliderSettings.Link7,
            AltText7 = nivoSliderSettings.AltText7,
            Picture8Id = nivoSliderSettings.Picture8Id,
            Text8 = nivoSliderSettings.Text8,
            Link8 = nivoSliderSettings.Link8,
            AltText8 = nivoSliderSettings.AltText8,
            ActiveStoreScopeConfiguration = storeScope
        };

        if (storeScope > 0)
        {
            model.Picture1Id_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Picture1Id, storeScope);
            model.Text1_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Text1, storeScope);
            model.Link1_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Link1, storeScope);
            model.AltText1_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.AltText1, storeScope);
            model.Picture2Id_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Picture2Id, storeScope);
            model.Text2_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Text2, storeScope);
            model.Link2_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Link2, storeScope);
            model.AltText2_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.AltText2, storeScope);
            model.Picture3Id_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Picture3Id, storeScope);
            model.Text3_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Text3, storeScope);
            model.Link3_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Link3, storeScope);
            model.AltText3_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.AltText3, storeScope);
            model.Picture4Id_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Picture4Id, storeScope);
            model.Text4_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Text4, storeScope);
            model.Link4_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Link4, storeScope);
            model.AltText4_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.AltText4, storeScope);
            model.Picture5Id_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Picture5Id, storeScope);
            model.Text5_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Text5, storeScope);
            model.Link5_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Link5, storeScope);
            model.AltText5_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.AltText5, storeScope);
            model.Picture6Id_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Picture6Id, storeScope);
            model.Text6_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Text6, storeScope);
            model.Link6_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Link6, storeScope);
            model.AltText6_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.AltText6, storeScope);
            model.Picture7Id_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Picture7Id, storeScope);
            model.Text7_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Text7, storeScope);
            model.Link7_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Link7, storeScope);
            model.AltText7_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.AltText7, storeScope);
            model.Picture8Id_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Picture8Id, storeScope);
            model.Text8_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Text8, storeScope);
            model.Link8_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.Link8, storeScope);
            model.AltText8_OverrideForStore = await _settingService.SettingExistsAsync(nivoSliderSettings, x => x.AltText8, storeScope);
        }

        return View("~/Plugins/Widgets.NivoSlider/Views/Configure.cshtml", model);
    }

    [HttpPost]
    public async Task<IActionResult> Configure(ConfigurationModel model)
    {
        if (!await _permissionService.AuthorizeAsync(StandardPermissionProvider.ManageWidgets))
            return AccessDeniedView();

        //load settings for a chosen store scope
        var storeScope = await _storeContext.GetActiveStoreScopeConfigurationAsync();
        var nivoSliderSettings = await _settingService.LoadSettingAsync<NivoSliderSettings>(storeScope);

        //get previous picture identifiers
        var previousPictureIds = new[]
        {
            nivoSliderSettings.Picture1Id,
            nivoSliderSettings.Picture2Id,
            nivoSliderSettings.Picture3Id,
            nivoSliderSettings.Picture4Id,
            nivoSliderSettings.Picture5Id,
            nivoSliderSettings.Picture6Id,
            nivoSliderSettings.Picture7Id,
            nivoSliderSettings.Picture8Id,
        };

        nivoSliderSettings.Picture1Id = model.Picture1Id;
        nivoSliderSettings.Text1 = model.Text1;
        nivoSliderSettings.Link1 = model.Link1;
        nivoSliderSettings.AltText1 = model.AltText1;
        nivoSliderSettings.Picture2Id = model.Picture2Id;
        nivoSliderSettings.Text2 = model.Text2;
        nivoSliderSettings.Link2 = model.Link2;
        nivoSliderSettings.AltText2 = model.AltText2;
        nivoSliderSettings.Picture3Id = model.Picture3Id;
        nivoSliderSettings.Text3 = model.Text3;
        nivoSliderSettings.Link3 = model.Link3;
        nivoSliderSettings.AltText3 = model.AltText3;
        nivoSliderSettings.Picture4Id = model.Picture4Id;
        nivoSliderSettings.Text4 = model.Text4;
        nivoSliderSettings.Link4 = model.Link4;
        nivoSliderSettings.AltText4 = model.AltText4;
        nivoSliderSettings.Picture5Id = model.Picture5Id;
        nivoSliderSettings.Text5 = model.Text5;
        nivoSliderSettings.Link5 = model.Link5;
        nivoSliderSettings.AltText5 = model.AltText5;
        nivoSliderSettings.Picture6Id = model.Picture6Id;
        nivoSliderSettings.Text6 = model.Text6;
        nivoSliderSettings.Link6 = model.Link6;
        nivoSliderSettings.AltText6 = model.AltText6;
        nivoSliderSettings.Picture7Id = model.Picture7Id;
        nivoSliderSettings.Text7 = model.Text7;
        nivoSliderSettings.Link7 = model.Link7;
        nivoSliderSettings.AltText7 = model.AltText7;
        nivoSliderSettings.Picture8Id = model.Picture8Id;
        nivoSliderSettings.Text8 = model.Text8;
        nivoSliderSettings.Link8 = model.Link8;
        nivoSliderSettings.AltText8 = model.AltText8;

        /* We do not clear cache after each setting update.
         * This behavior can increase performance because cached settings will not be cleared 
         * and loaded from database after each update */
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Picture1Id, model.Picture1Id_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Text1, model.Text1_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Link1, model.Link1_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.AltText1, model.AltText1_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Picture2Id, model.Picture2Id_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Text2, model.Text2_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Link2, model.Link2_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.AltText2, model.AltText2_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Picture3Id, model.Picture3Id_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Text3, model.Text3_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Link3, model.Link3_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.AltText3, model.AltText3_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Picture4Id, model.Picture4Id_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Text4, model.Text4_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Link4, model.Link4_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.AltText4, model.AltText4_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Picture5Id, model.Picture5Id_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Text5, model.Text5_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Link5, model.Link5_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.AltText5, model.AltText5_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Picture6Id, model.Picture6Id_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Text6, model.Text6_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Link6, model.Link6_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.AltText6, model.AltText6_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Picture7Id, model.Picture7Id_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Text7, model.Text7_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Link7, model.Link7_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.AltText7, model.AltText7_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Picture8Id, model.Picture8Id_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Text8, model.Text8_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.Link8, model.Link8_OverrideForStore, storeScope, false);
        await _settingService.SaveSettingOverridablePerStoreAsync(nivoSliderSettings, x => x.AltText8, model.AltText8_OverrideForStore, storeScope, false);

        //now clear settings cache
        await _settingService.ClearCacheAsync();

        //get current picture identifiers
        var currentPictureIds = new[]
        {
            nivoSliderSettings.Picture1Id,
            nivoSliderSettings.Picture2Id,
            nivoSliderSettings.Picture3Id,
            nivoSliderSettings.Picture4Id,
            nivoSliderSettings.Picture5Id,
            nivoSliderSettings.Picture6Id,
            nivoSliderSettings.Picture7Id,
            nivoSliderSettings.Picture8Id,
        };

        //delete an old picture (if deleted or updated)
        foreach (var pictureId in previousPictureIds.Except(currentPictureIds))
        {
            var previousPicture = await _pictureService.GetPictureByIdAsync(pictureId);
            if (previousPicture != null)
                await _pictureService.DeletePictureAsync(previousPicture);
        }

        _notificationService.SuccessNotification(await _localizationService.GetResourceAsync("Admin.Plugins.Saved"));

        return await Configure();
    }
}