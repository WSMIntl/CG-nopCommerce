Use C:\dev\Brookwood\README_CONTEXT.md and the brookwood-context skill for this session.


site url: https://127.0.0.1:56732




Fresh build

dotnet build-server shutdown
taskkill /F /IM Nop.Web.exe
taskkill /F /IM dotnet.exe
dotnet restore .\NopCommerce.sln
dotnet build .\NopCommerce.sln -c Debug
dotnet run --project .\Presentation\Nop.Web\Nop.Web.csproj


build the site
dotnet build .\Nop.Plugin.Custom.Chemglass\Nop.Plugin.Custom.Chemglass.csproj -c Debug

run the site
dotnet run --project .\Presentation\Nop.Web\Nop.Web.csproj




