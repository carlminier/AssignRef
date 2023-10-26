ALTER proc [dbo].[TrainingVideos_SelectBy_ConferenceId_SeasonIdV2]
				@ConferenceId int,
				@SeasonId int,
				@PageIndex int,
				@PageSize int

as
/*
		Declare 
				@ConferenceId int = 3
				,@SeasonId int = 49
				,@PageIndex int = 0
				,@PageSize int = 10

		Execute 
				[dbo].[TrainingVideos_SelectBy_ConferenceId_SeasonIdV2]
				@ConferenceId
				,@SeasonId
				,@PageIndex
				,@PageSize
*/

BEGIN

	Declare @offset int = @PageIndex * @PageSize

	SELECT tv.[Id]
		  ,vc.[Id] as CategoryId
		  ,vc.[Name] as CategoryName
		  ,[Title]
		  ,[Subject]
		  ,s.[Id] as SeasonId
		  ,s.[Name] as SeasonName
		  ,s.[Year] as SeasonYear
		  ,c.[Id] as ConferenceId
		  ,c.[Logo] as ConferenceLogo
		  ,c.[Name] as ConferenceName
		  ,c.[Code] as ConferenceCode
		  ,[MediaUrl]
		  ,[ImageUrl]
		  ,[IsPublished]
		  ,tv.[DateCreated]
		  ,tv.[DateModified]
		  ,[IsDeleted]
		  ,tv.[CreatedBy]
		  ,tv.[ModifiedBy]
		  ,TotalCount = COUNT(1) OVER()
	FROM [dbo].[TrainingVideos] as tv
		inner join dbo.Seasons as s 
		on s.Id = tv.SeasonId
		inner join dbo.VideoCategories as vc
		on vc.Id = tv.CategoryId
		inner join dbo.Conferences as c
		on c.Id = tv.ConferenceId
	Where tv.SeasonId = @SeasonId
		and tv.ConferenceId = @ConferenceId
	Order By tv.SeasonId
	OFFSET @offset ROWS
	FETCH NEXT @PageSize ROWS ONLY;

END

