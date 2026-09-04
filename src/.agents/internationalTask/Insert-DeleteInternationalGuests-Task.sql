IF NOT EXISTS (
    SELECT 1
    FROM dbo.ScheduleTask
    WHERE [Type] = 'Nop.Plugin.Custom.Chemglass.Services.DeleteInternationalGuestsTask, Nop.Plugin.Custom.Chemglass'
)
BEGIN
    INSERT INTO dbo.ScheduleTask
    (
        [Name],
        [Seconds],
        [Type],
        [LastEnabledUtc],
        [Enabled],
        [StopOnError],
        [LastStartUtc],
        [LastEndUtc],
        [LastSuccessUtc]
    )
    VALUES
    (
        'Delete international guests',
        600,
        'Nop.Plugin.Custom.Chemglass.Services.DeleteInternationalGuestsTask, Nop.Plugin.Custom.Chemglass',
        GETUTCDATE(),
        1,
        0,
        NULL,
        NULL,
        NULL
    );
END
GO
