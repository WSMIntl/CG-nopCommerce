Production package for the international guest cleanup task.

Files:
- Nop.Plugin.Custom.Chemglass.dll
- DeleteInternationalGuestsTask.cs
- ChemglassPlugin.cs
- Deploy-DeleteInternationalGuests.sql
- Insert-DeleteInternationalGuests-Task.sql

Next steps:
1. Run Deploy-DeleteInternationalGuests.sql on production.
2. Deploy the updated Nop.Plugin.Custom.Chemglass.dll to:
   Plugins\Nop.Plugin.Custom.Chemglass\
3. Restart the site/app pool.
4. Run Insert-DeleteInternationalGuests-Task.sql on production.
5. In Admin -> System -> Schedule tasks, find "Delete international guests" and click Run now.
