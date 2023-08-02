USE [AssignRef]
GO
/****** Object:  StoredProcedure [dbo].[TrainingVideosCategories_SelectAllVideos]    Script Date: 7/17/2023 9:02:10 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Carl Minier
-- Create date: 7/03/2023
-- Description:[dbo].[TrainingVideosCategories_SelectAllVideos]
--			    
-- Code Reviewer: Sarorn Lin
-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
--
-- =============================================
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
