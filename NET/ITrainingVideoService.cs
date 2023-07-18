using Sabio.Models;
using Sabio.Models.Domain.TrainingVideos;
using Sabio.Models.Requests.TrainingVideos;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface ITrainingVideoService
    {
        int Add(TrainingVideoAddRequest model, int userId);
        void Delete(int id);
        Paged<TrainingVideo> GetByConferenceId(int seasonId, int pageIndex, int pageSize);
        Paged<TrainingVideo> GetByConferenceV2(int conferenceId, int pageIndex, int pageSize);
        Paged<TrainingVideo> GetByCreatedBy(int pageIndex, int pageSize);
        Paged<TrainingVideo> GetByCategoryId(int categoryId, int seasonId, int pageIndex, int pageSize);
        Paged<TrainingVideo> GetByConferenceId_SeasonIdV2(int conferenceId, int seasonId, int pageIndex, int pageSize);
        Paged<TrainingVideo> Search(int pageIndex, int pageSize, byte isDeleted, string query);
        List<TrainingVideo> GetIsPublishedByConferenceId(int conferenceId);
        List<VideoMain> GetCategories_SelectAllVideos(int conferenceId);
        List<TrainingVideo> GetAll();
        void Update(TrainingVideoUpdateRequest model, int userId);
    }
}