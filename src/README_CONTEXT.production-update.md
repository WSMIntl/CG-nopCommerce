# Context Roots

For all work in this project space, always use these folders as primary context:

1. `C:\dev\Brookwood\CG-nopCommerce`
2. `C:\dev\Brookwood\CG-nop-plugin`
3. `C:\Users\cn_mdinatale\chemglass\v3.chemglass.com\v3.chemglass.com`

## Rules
- Treat these 3 folders as one working system.
- When debugging or tracing behavior, search all 3 before concluding.
- If changes span repos, call that out and list impacted files per folder.
- All changes must be upgrade-safe; avoid modifying core code when an extension/override approach is available.

## Production Reference
- The production site root is `C:\Users\cn_mdinatale\chemglass\v3.chemglass.com\v3.chemglass.com`.
- Treat that folder as the source of truth for final production placement.
- When I ask to "get all files changed ready for production", prepare a deploy-ready mirror under `C:\dev\deploy-ready\v3.chemglass.com\` using the same relative paths as production.
- Only place the changed files in that deploy-ready folder, not the entire site.

## Source To Production Mapping

### Main Web App
- Source root: `C:\dev\Brookwood\CG-nopCommerce\src\Presentation\Nop.Web`
- Production root: `C:\Users\cn_mdinatale\chemglass\v3.chemglass.com\v3.chemglass.com`
- Deploy-ready staging root: `C:\dev\deploy-ready\v3.chemglass.com`
- Rule: anything changed under `Presentation\Nop.Web\...` should keep the same relative path under production and under the deploy-ready staging folder.

Examples:
- `C:\dev\Brookwood\CG-nopCommerce\src\Presentation\Nop.Web\App_Data\plugins.json`
  -> `C:\Users\cn_mdinatale\chemglass\v3.chemglass.com\v3.chemglass.com\App_Data\plugins.json`
  -> `C:\dev\deploy-ready\v3.chemglass.com\App_Data\plugins.json`
- `C:\dev\Brookwood\CG-nopCommerce\src\Presentation\Nop.Web\Views\Shared\_Root.cshtml`
  -> `C:\Users\cn_mdinatale\chemglass\v3.chemglass.com\v3.chemglass.com\Views\Shared\_Root.cshtml`
  -> `C:\dev\deploy-ready\v3.chemglass.com\Views\Shared\_Root.cshtml`
- `C:\dev\Brookwood\CG-nopCommerce\src\Presentation\Nop.Web\wwwroot\...`
  -> `C:\Users\cn_mdinatale\chemglass\v3.chemglass.com\v3.chemglass.com\wwwroot\...`
  -> `C:\dev\deploy-ready\v3.chemglass.com\wwwroot\...`

### Chemglass Plugin Source
- Source root: `C:\dev\Brookwood\CG-nop-plugin\Nop.Plugin.Custom.Chemglass`
- Build output root: `C:\dev\Brookwood\CG-nopCommerce\src\Presentation\Nop.Web\Plugins\Nop.Plugin.Custom.Chemglass`
- Production root: `C:\Users\cn_mdinatale\chemglass\v3.chemglass.com\v3.chemglass.com\Plugins\Nop.Plugin.Custom.Chemglass`
- Deploy-ready staging root: `C:\dev\deploy-ready\v3.chemglass.com\Plugins\Nop.Plugin.Custom.Chemglass`
- The plugin project writes its output to `Presentation\Nop.Web\Plugins\Nop.Plugin.Custom.Chemglass` via its `.csproj`.
- When plugin source files change, production deployment should be based on the built output folder unless I explicitly ask for raw source references too.

Examples:
- Source edit: `C:\dev\Brookwood\CG-nop-plugin\Nop.Plugin.Custom.Chemglass\Views\Shared\Components\OpcShippingMethodsTopView\Default.cshtml`
  -> built file path: `C:\dev\Brookwood\CG-nopCommerce\src\Presentation\Nop.Web\Plugins\Nop.Plugin.Custom.Chemglass\Views\Shared\Components\OpcShippingMethodsTopView\Default.cshtml`
  -> production file path: `C:\Users\cn_mdinatale\chemglass\v3.chemglass.com\v3.chemglass.com\Plugins\Nop.Plugin.Custom.Chemglass\Views\Shared\Components\OpcShippingMethodsTopView\Default.cshtml`
  -> deploy-ready file path: `C:\dev\deploy-ready\v3.chemglass.com\Plugins\Nop.Plugin.Custom.Chemglass\Views\Shared\Components\OpcShippingMethodsTopView\Default.cshtml`
- Source edit: `C:\dev\Brookwood\CG-nop-plugin\Nop.Plugin.Custom.Chemglass\Services\EventConsumer.cs`
  -> deployment target should include the rebuilt plugin artifacts from `C:\dev\Brookwood\CG-nopCommerce\src\Presentation\Nop.Web\Plugins\Nop.Plugin.Custom.Chemglass\`
  -> production folder: `C:\Users\cn_mdinatale\chemglass\v3.chemglass.com\v3.chemglass.com\Plugins\Nop.Plugin.Custom.Chemglass\`
  -> deploy-ready folder: `C:\dev\deploy-ready\v3.chemglass.com\Plugins\Nop.Plugin.Custom.Chemglass\`

### Chemglass Theme
- Source root: `C:\dev\Brookwood\CG-nopCommerce\src\Presentation\Nop.Web\Themes\Chemglass`
- Alternate theme source reference: `C:\dev\Brookwood\CG-nop-plugin\ChemglassTheme`
- Production root: `C:\Users\cn_mdinatale\chemglass\v3.chemglass.com\v3.chemglass.com\Themes\Chemglass`
- Deploy-ready staging root: `C:\dev\deploy-ready\v3.chemglass.com\Themes\Chemglass`
- Rule: keep theme file paths identical under `Themes\Chemglass`.

Examples:
- `C:\dev\Brookwood\CG-nopCommerce\src\Presentation\Nop.Web\Themes\Chemglass\Content\css\chemglass.css`
  -> `C:\Users\cn_mdinatale\chemglass\v3.chemglass.com\v3.chemglass.com\Themes\Chemglass\Content\css\chemglass.css`
  -> `C:\dev\deploy-ready\v3.chemglass.com\Themes\Chemglass\Content\css\chemglass.css`
- `C:\dev\Brookwood\CG-nopCommerce\src\Presentation\Nop.Web\Themes\Chemglass\Views\Product\_ProductDetailsPictures.cshtml`
  -> `C:\Users\cn_mdinatale\chemglass\v3.chemglass.com\v3.chemglass.com\Themes\Chemglass\Views\Product\_ProductDetailsPictures.cshtml`
  -> `C:\dev\deploy-ready\v3.chemglass.com\Themes\Chemglass\Views\Product\_ProductDetailsPictures.cshtml`

## Deployment Prep Instructions
- If a request says "ready for production", gather every changed file and place it in `C:\dev\deploy-ready\v3.chemglass.com\...` using production-relative paths.
- Preserve the production folder structure exactly.
- For plugin code changes, include the built plugin output files from `Presentation\Nop.Web\Plugins\Nop.Plugin.Custom.Chemglass\...`, not just the source `.cs` files.
- For direct `Nop.Web` edits, copy the changed file from `Presentation\Nop.Web\...` into the matching deploy-ready path.
- For theme edits, copy the changed file into the matching `Themes\Chemglass\...` deploy-ready path.
- If a changed file does not clearly map to production, call that out before staging files.
