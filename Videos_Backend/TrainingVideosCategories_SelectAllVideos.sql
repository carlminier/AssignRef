ALTER PROCEDURE [dbo].[TrainingVideosCategories_SelectAllVideos]
						@ConferenceId INT
AS
/*
	Declare @ConferenceId int = 1

	EXECUTE [dbo].[TrainingVideosCategories_SelectAllVideos] 
						@ConferenceId 

	SELECT * FROM dbo.TrainingVideos
*/
BEGIN
	
	SELECT	 vc.[Id]
			,vc.[Name]
			,Videos = (
				SELECT tv.[Id],
						tv.[Title], 
						tv.[Subject], 
						tv.[ImageUrl],
						tv.[MediaUrl]
				FROM dbo.TrainingVideos as tv
				WHERE tv.CategoryId = vc.[Id]
					AND tv.ConferenceId = @ConferenceId
				FOR JSON AUTO
			) 
	FROM dbo.VideoCategories as vc

END
