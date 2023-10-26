USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[TrainingVideos_Search]    Script Date: 7/3/2023 8:35:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER proc [dbo].[TrainingVideos_Search]
					@PageIndex int,
					@PageSize int,
					@isDeleted bit,
					@Query nvarchar(50)
as
/*

	Declare @PageIndex int = 0
			,@PageSize int = 40
			,@isDeleted bit = 'false'
			,@Query nvarchar(50) = 'best'

	EXECUTE [dbo].[TrainingVideos_Search]
			@PageIndex,
			@PageSize,
			@isDeleted,
			@Query

*/

BEGIN

	DECLARE @offset int = @PageIndex * @PageSize

	SELECT tv.[Id]
		  ,vc.[Id] as CategoryId
		  ,vc.[Name] as CategoryName
		  ,tv.[Title]
		  ,tv.[Subject]
		  ,s.[Id] as SeasonId
		  ,s.[Name] as SeasonName
		  ,s.[Year] as SeasonYear
		  ,c.[Id] as ConferenceId
		  ,c.[Logo] as ConferenceLogo
		  ,c.[Name] as ConferenceName
		  ,c.[Code] as ConferenceCode
		  ,tv.[MediaUrl]
		  ,tv.[ImageUrl]
		  ,tv.[IsPublished]
		  ,tv.[DateCreated]
		  ,tv.[DateModified]
		  ,tv.[IsDeleted]
		  ,tv.[CreatedBy]
		  ,tv.[ModifiedBy]
		  ,TotalCount = COUNT(1)OVER()
	FROM [dbo].[TrainingVideos] as tv
		inner join dbo.Seasons as s 
		on s.Id = tv.SeasonId
		inner join dbo.VideoCategories as vc
		on vc.Id = tv.CategoryId
		inner join dbo.Conferences as c
		on c.Id = tv.ConferenceId
	Where ((tv.IsDeleted = @isDeleted)
			and (tv.[Title] LIKE '%' + @Query + '%')
			)
	ORDER BY s.[Year] DESC
	OFFSET @offset ROWS
	FETCH NEXT @PageSize ROWS ONLY
END

