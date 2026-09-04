USE [chemglass2025]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[DeleteInternationalGuests]
(
    @OnlyWithoutShoppingCart bit = 1,
    @CreatedFromUtc datetime,
    @CreatedToUtc datetime,
    @TotalRecordsDeleted int = null OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    CREATE TABLE #tmp_guests (CustomerId int);
    CREATE TABLE #tmp_adresses (AddressId int);

    INSERT #tmp_guests (CustomerId)
    SELECT c.[Id]
    FROM [Customer] c WITH (NOLOCK)
        LEFT JOIN [ShoppingCartItem] sci WITH (NOLOCK) ON sci.[CustomerId] = c.[Id]
        INNER JOIN (
            SELECT ccrm.[Customer_Id]
            FROM [Customer_CustomerRole_Mapping] ccrm WITH (NOLOCK)
                INNER JOIN [CustomerRole] cr WITH (NOLOCK) ON cr.[Id] = ccrm.[CustomerRole_Id]
            WHERE cr.[SystemName] = N'internationalguest'
        ) g ON g.[Customer_Id] = c.[Id]
        LEFT JOIN [Order] o WITH (NOLOCK) ON o.[CustomerId] = c.[Id]
        LEFT JOIN [BlogComment] bc WITH (NOLOCK) ON bc.[CustomerId] = c.[Id]
        LEFT JOIN [NewsComment] nc WITH (NOLOCK) ON nc.[CustomerId] = c.[Id]
        LEFT JOIN [ProductReview] pr WITH (NOLOCK) ON pr.[CustomerId] = c.[Id]
        LEFT JOIN [ProductReviewHelpfulness] prh WITH (NOLOCK) ON prh.[CustomerId] = c.[Id]
        LEFT JOIN [PollVotingRecord] pvr WITH (NOLOCK) ON pvr.[CustomerId] = c.[Id]
        LEFT JOIN [Forums_Topic] ft WITH (NOLOCK) ON ft.[CustomerId] = c.[Id]
        LEFT JOIN [Forums_Post] fp WITH (NOLOCK) ON fp.[CustomerId] = c.[Id]
    WHERE 1 = 1
        AND (o.Id IS NULL)
        AND (bc.Id IS NULL)
        AND (nc.Id IS NULL)
        AND (pr.Id IS NULL)
        AND (prh.Id IS NULL)
        AND (pvr.Id IS NULL)
        AND (ft.Id IS NULL)
        AND (fp.Id IS NULL)
        AND (c.IsSystemAccount = 0)
        AND ((@CreatedFromUtc IS NULL) OR (c.[CreatedOnUtc] > @CreatedFromUtc))
        AND ((@CreatedToUtc IS NULL) OR (c.[CreatedOnUtc] < @CreatedToUtc))
        AND ((@OnlyWithoutShoppingCart = 0) OR (sci.Id IS NULL));

    INSERT #tmp_adresses (AddressId)
    SELECT [Address_Id]
    FROM [CustomerAddresses]
    WHERE [Customer_Id] IN (SELECT [CustomerId] FROM #tmp_guests);

    DELETE [Customer]
    WHERE [Id] IN (SELECT [CustomerId] FROM #tmp_guests);

    DELETE [GenericAttribute]
    WHERE [EntityId] IN (SELECT [CustomerId] FROM #tmp_guests)
      AND [KeyGroup] = N'Customer';

    DELETE [Address]
    WHERE [Id] IN (SELECT [AddressId] FROM #tmp_adresses);

    DELETE
    FROM [Customer_CustomerRole_Mapping]
    WHERE [Customer_Id] NOT IN (SELECT [Id] FROM [Customer]);

    SELECT @TotalRecordsDeleted = COUNT(1)
    FROM #tmp_guests;

    DROP TABLE #tmp_guests;
    DROP TABLE #tmp_adresses;
END
GO
