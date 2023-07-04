using Microsoft.Extensions.Hosting;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Seasons;
using Sabio.Models.Domain.TrainingVideos;
using Sabio.Models.Requests.TrainingVideos;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models;
using Sabio.Services.Interfaces;
using Microsoft.Extensions.Configuration.UserSecrets;
using Sabio.Models.Domain.Conferences;
using Sabio.Models.Domain.Venues;

namespace Sabio.Services
{
    public class TrainingVideoService : ITrainingVideoService
    {
        IDataProvider _data = null;

        public TrainingVideoService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(TrainingVideoAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[TrainingVideos_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@CreatedBy", userId);
                col.AddWithValue("@ModifiedBy", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);

                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);
            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object tvId = returnCollection["@Id"].Value;

                int.TryParse(tvId.ToString(), out id);
            });

            return id;
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[TrainingVideos_Delete]";

            _data.ExecuteNonQuery(procName, 
                inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, returnParameters: null);
        }

        public void Update(TrainingVideoUpdateRequest model, int userId)
        {
            string procName = "[dbo].[TrainingVideos_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@ModifiedBy", userId);
                col.AddWithValue("@Id", model.Id);
            }, returnParameters: null);
        }

        public List<TrainingVideo> GetIsPublishedByConferenceId(int conferenceId)
        {
            List<TrainingVideo> videosList = null;

            string procName = "[dbo].[TrainingVideos_SelectPublished_ByConferenceId]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@ConferenceId", conferenceId);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                TrainingVideo trainVid = MapTrainingVideo(reader, ref startingIndex);

                if (videosList == null) videosList = new List<TrainingVideo>();

                videosList.Add(trainVid);
            });

            return videosList;
        }

        public List<TrainingVideo> GetAll()
        {
            List<TrainingVideo> videosList = null;

            string procName = "dbo.TrainingVideos_SelectAll";

            _data.ExecuteCmd(procName, null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                TrainingVideo trainVid = MapTrainingVideo(reader, ref startingIndex);

                if (videosList == null) videosList = new List<TrainingVideo>();

                videosList.Add(trainVid);
            });

            return videosList;
        }

        public Paged<TrainingVideo> GetByCreatedBy(int pageIndex, int pageSize)
        {
            Paged<TrainingVideo> pagedList = null;
            List<TrainingVideo> videosList = null;

            int totalCount = 0;

            string procName = "[dbo].[TrainingVideos_SelectByCreatedBy]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@PageIndex", pageIndex);
                paramCol.AddWithValue("@PageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                TrainingVideo trainVid = MapTrainingVideo(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (videosList == null) videosList = new List<TrainingVideo>();

                videosList.Add(trainVid);
            });

            if (videosList != null)
            {
                pagedList = new Paged<TrainingVideo>(videosList, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public Paged<TrainingVideo> GetByConferenceId(int seasonId, int pageIndex, int pageSize)
        {
            Paged<TrainingVideo> pagedList = null;
            List<TrainingVideo> videosList = null;
            int totalCount = 0;

            string procName = "[dbo].[TrainingVideos_Select_ByConferenceId_SeasonId]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@SeasonId", seasonId);
                paramCol.AddWithValue("@PageIndex", pageIndex);
                paramCol.AddWithValue("@PageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                TrainingVideo trainVid = MapTrainingVideo(reader, ref startingIndex);

                if (totalCount == 0) totalCount = reader.GetSafeInt32(startingIndex);

                if (videosList == null) videosList = new List<TrainingVideo>();

                videosList.Add(trainVid);
            });

            if (videosList != null)
            {
                pagedList = new Paged<TrainingVideo>(videosList, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public Paged<TrainingVideo> GetByConferenceV2(int conferenceId, int pageIndex, int pageSize)
        {
            Paged<TrainingVideo> pagedList = null;
            List<TrainingVideo> videosList = null;
            int totalCount = 0;

            string procName = "[dbo].[TrainingVideos_SelectByConference]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@ConferenceId", conferenceId);
                paramCol.AddWithValue("@PageIndex", pageIndex);
                paramCol.AddWithValue("@PageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                TrainingVideo trainVid = MapTrainingVideo(reader, ref startingIndex);

                if (totalCount == 0) totalCount = reader.GetSafeInt32(startingIndex);

                if (videosList == null) videosList = new List<TrainingVideo>();

                videosList.Add(trainVid);
            });

            if (videosList != null)
            {
                pagedList = new Paged<TrainingVideo>(videosList, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public Paged<TrainingVideo> GetByConferenceId_SeasonIdV2(int conferenceId, int seasonId, int pageIndex, int pageSize)
        {
            Paged<TrainingVideo> pagedList = null;
            List<TrainingVideo> videosList = null;
            int totalCount = 0;

            string procName = "[dbo].[TrainingVideos_SelectBy_ConferenceId_SeasonIdV2]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@ConferenceId", conferenceId);
                paramCol.AddWithValue("@SeasonId", seasonId);
                paramCol.AddWithValue("@PageIndex", pageIndex);
                paramCol.AddWithValue("@PageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                TrainingVideo trainVid = MapTrainingVideo(reader, ref startingIndex);

                if (totalCount == 0) totalCount = reader.GetSafeInt32(startingIndex);

                if (videosList == null) videosList = new List<TrainingVideo>();

                videosList.Add(trainVid);
            });

            if (videosList != null)
            {
                pagedList = new Paged<TrainingVideo>(videosList, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public Paged<TrainingVideo> GetByCategoryId(int categoryId, int seasonId, int pageIndex, int pageSize)
        {
            Paged<TrainingVideo> pagedList = null;
            List<TrainingVideo> videosList = null;
            int totalCount = 0;

            string procName = "[dbo].[TrainingVideos_SelectBy_CategoryId_SeasonId]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@CategoryId", categoryId);
                paramCol.AddWithValue("@SeasonId", seasonId);
                paramCol.AddWithValue("@PageIndex", pageIndex);
                paramCol.AddWithValue("@PageSize", pageSize);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                TrainingVideo trainVid = MapTrainingVideo(reader, ref startingIndex);

                if (totalCount == 0) totalCount = reader.GetSafeInt32(startingIndex);

                if (videosList == null) videosList = new List<TrainingVideo>();

                videosList.Add(trainVid);
            });

            if (videosList != null)
            {
                pagedList = new Paged<TrainingVideo>(videosList, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public Paged<TrainingVideo> Search(int pageIndex, int pageSize, byte isDeleted, string query)
        {
            Paged<TrainingVideo> pagedList = null;
            List<TrainingVideo> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(
                "[dbo].[TrainingVideos_Search]", (SqlParameterCollection col) =>
                {
                    col.AddWithValue("@PageIndex", pageIndex);
                    col.AddWithValue("@PageSize", pageSize);
                    col.AddWithValue("@IsDeleted", isDeleted);
                    col.AddWithValue("@Query", query);

                },
                (reader, readerSetIndex) =>
                {
                    int startingIndex = 0;
                    TrainingVideo trainVid = MapTrainingVideo(reader, ref startingIndex);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(startingIndex);
                    }
                    if (list == null)
                    {
                        list = new List<TrainingVideo>();
                    }
                    list.Add(trainVid);
                });
            if (list != null)
            {
                pagedList = new Paged<TrainingVideo>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        private static TrainingVideo MapTrainingVideo(IDataReader reader, ref int startingIndex)
        {
            TrainingVideo trainingVideo = new TrainingVideo();

            trainingVideo.Id = reader.GetSafeInt32(startingIndex++);
            trainingVideo.Category = new LookUp();
            trainingVideo.Category.Id = reader.GetSafeInt32(startingIndex++);
            trainingVideo.Category.Name = reader.GetSafeString(startingIndex++);
            trainingVideo.Title = reader.GetSafeString(startingIndex++);
            trainingVideo.Subject = reader.GetSafeString(startingIndex++);
            trainingVideo.Season = new BaseSeason();
            trainingVideo.Season.Id = reader.GetSafeInt32(startingIndex++);
            trainingVideo.Season.Name = reader.GetSafeString(startingIndex++);
            trainingVideo.Season.Year = reader.GetSafeInt32(startingIndex++);
            trainingVideo.Conference = new BaseConference();
            trainingVideo.Conference.Id = reader.GetSafeInt32(startingIndex++);
            trainingVideo.Conference.Logo = reader.GetSafeString(startingIndex++);
            trainingVideo.Conference.Name = reader.GetSafeString(startingIndex++);
            trainingVideo.Conference.Code = reader.GetSafeString(startingIndex++);
            trainingVideo.MediaUrl = reader.GetSafeString(startingIndex++);
            trainingVideo.ImageUrl = reader.GetSafeString(startingIndex++);
            trainingVideo.IsPublished = reader.GetSafeBool(startingIndex++);
            trainingVideo.DateCreated = reader.GetSafeDateTime(startingIndex++);
            trainingVideo.DateModified = reader.GetSafeDateTime(startingIndex++);
            trainingVideo.IsDeleted = reader.GetSafeBool(startingIndex++);
            trainingVideo.CreatedBy = reader.GetSafeInt32(startingIndex++);
            trainingVideo.ModifiedBy = reader.GetSafeInt32(startingIndex++);

            return trainingVideo;
        }

        private static void AddCommonParams(TrainingVideoAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@CategoryId", model.CategoryId);
            col.AddWithValue("@SeasonId", model.SeasonId);
            col.AddWithValue("@ConferenceId", model.ConferenceId);
            col.AddWithValue("@Title", model.Title);
            col.AddWithValue("@Subject", model.Subject);
            col.AddWithValue("@MediaUrl", model.MediaUrl);
            col.AddWithValue("@IsPublished", model.IsPublished);
            col.AddWithValue("@ImageUrl", model.ImageUrl);
        }
    }
}
