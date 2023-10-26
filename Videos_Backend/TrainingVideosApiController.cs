[Route("api/training/videos")]
[ApiController]
public class TrainingVideosApiController : BaseApiController
    {
        private ITrainingVideoService _service = null;
        private IAuthenticationService<int> _authService = null;

        public TrainingVideosApiController(ITrainingVideoService service, ILogger<VideoCategoriesApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _authService = authService;
            _service = service;
        }

        [HttpGet("conference/{id:int}")]
        public ActionResult<ItemsResponse<TrainingVideo>> GetPublishedByConferenceId(int id)
        {
            int statCode = 200;
            BaseResponse res = null;

            try
            {
                List<TrainingVideo> videosList = _service.GetIsPublishedByConferenceId(id);

                if (videosList == null)
                {
                    statCode = 404;
                    res = new ErrorResponse("Application Resource is not found!");
                } else
                {
                    res = new ItemsResponse<TrainingVideo> { Items = videosList };
                }

            } catch(Exception ex)
            {
                statCode = 500;
                res = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(statCode, res);
        }

        [HttpGet("conferenceId/{id:int}")]
        public ActionResult<ItemsResponse<VideoMain>> GetCategories_SelectAllVideos(int id)
        {
            int statCode = 200;
            BaseResponse res = null;

            try
            {
                List<VideoMain> videosList = _service.GetCategories_SelectAllVideos(id);

                if (videosList == null)
                {
                    statCode = 404;
                    res = new ErrorResponse("Application Resource is not found!");
                }
                else
                {
                    res = new ItemsResponse<VideoMain> { Items = videosList };
                }
            }

            catch (Exception ex)
            {
                statCode = 500;
                res = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(statCode, res);
        }

        [HttpGet]
        public ActionResult<ItemsResponse<TrainingVideo>> GetAll()
        {
            int statCode = 200;
            BaseResponse res = null;

            try
            {
                List<TrainingVideo> videosList = _service.GetAll();

                if (videosList == null)
                {
                    statCode = 404;
                    res = new ErrorResponse("Application Resource is not found!");
                }
                else
                {
                    res = new ItemsResponse<TrainingVideo> { Items = videosList };
                }

            }
            catch (Exception ex)
            {
                statCode = 500;
                res = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(statCode, res);
        }

        [HttpGet("paginate/createdBy")]
        public ActionResult<ItemResponse<Paged<TrainingVideo>>> GetByCreatedBy(int pageIndex, int pageSize)
        {
            int statCode = 200;
            BaseResponse res = null;

            try
            {
                Paged<TrainingVideo> videoPages = _service.GetByCreatedBy(pageIndex, pageSize);

                if (videoPages == null)
                {
                    statCode = 404;
                    res = new ErrorResponse("Application Resources Not Found!");
                }
                else
                {
                    res = new ItemResponse<Paged<TrainingVideo>> { Item = videoPages };
                }

            }
            catch (Exception ex)
            {
                statCode = 500;
                res = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(statCode, res);
        }

        [HttpGet("paginate/season/{id:int}")]
        public ActionResult<ItemResponse<Paged<TrainingVideo>>> GetVideoBySeason(int id, int pageIndex, int pageSize)
        {
            int statCode = 200;
            BaseResponse res = null;

            try
            {
                Paged<TrainingVideo> videoPages = _service.GetByConferenceId(id, pageIndex, pageSize);

                if (videoPages == null)
                {
                    statCode = 404;
                    res = new ErrorResponse("Application Resource Not Found!");
                } else
                {
                    res = new ItemResponse<Paged<TrainingVideo>> { Item = videoPages };
                }

            } catch (Exception ex)
            {
                statCode = 500;
                res = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(statCode, res);
        }

        [HttpGet("paginate/conference/{conferenceId:int}")]
        public ActionResult<ItemResponse<Paged<TrainingVideo>>> GetByConferenceV2(int conferenceId, int pageIndex, int pageSize)
        {
            int statCode = 200;
            BaseResponse res = null;

            try
            {
                Paged<TrainingVideo> videoPages = _service.GetByConferenceV2(conferenceId, pageIndex, pageSize);

                if (videoPages == null)
                {
                    statCode = 404;
                    res = new ErrorResponse("Application Resource Not Found!");
                }
                else
                {
                    res = new ItemResponse<Paged<TrainingVideo>> { Item = videoPages };
                }

            }
            catch (Exception ex)
            {
                statCode = 500;
                res = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(statCode, res);
        }


        [HttpGet("paginate/conference/{conferenceId:int}/season/{seasonId:int}")]
        public ActionResult<ItemResponse<Paged<TrainingVideo>>> GetByConferenceId_SeasonIdV2(int conferenceId, int seasonId, int pageIndex, int pageSize)
        {
            int statCode = 200;
            BaseResponse res = null;

            try
            {
                Paged<TrainingVideo> videoPages = _service.GetByConferenceId_SeasonIdV2(conferenceId, seasonId, pageIndex, pageSize);

                if (videoPages == null)
                {
                    statCode = 404;
                    res = new ErrorResponse("Application Resource Not Found!");
                }
                else
                {
                    res = new ItemResponse<Paged<TrainingVideo>> { Item = videoPages };
                }

            }
            catch (Exception ex)
            {
                statCode = 500;
                res = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(statCode, res);
        }

        [HttpGet("paginate/category/{categoryId:int}/season/{seasonId:int}")]
        public ActionResult<ItemResponse<Paged<TrainingVideo>>> GetByCategoryId(int categoryId, int seasonId, int pageIndex, int pageSize)
        {
            int statCode = 200;
            BaseResponse res = null;

            try
            {
                Paged<TrainingVideo> videoPages = _service.GetByCategoryId(categoryId, seasonId, pageIndex, pageSize);

                if (videoPages == null)
                {
                    statCode = 404;
                    res = new ErrorResponse("Application Resource Not Found!");
                }
                else
                {
                    res = new ItemResponse<Paged<TrainingVideo>> { Item = videoPages };
                }

            }
            catch (Exception ex)
            {
                statCode = 500;
                res = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(statCode, res);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<TrainingVideo>>> Search(int pageIndex, int pageSize, byte isDeleted, string query)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Paged<TrainingVideo> page = _service.Search(pageIndex, pageSize, isDeleted, query);
                if (page == null)
                {
                    code = 404;
                    response = new ItemResponse<Paged<TrainingVideo>> { Item = page };
                }
                else
                {
                    response = new ItemResponse<Paged<TrainingVideo>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                Logger.LogError(ex.ToString());

            }
            return StatusCode(code, response);

        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(TrainingVideoAddRequest model)
        {
            int statCode = 201;
            BaseResponse res = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int newId = _service.Add(model, userId);

                res = new ItemResponse<int> { Item = newId };

            } catch(Exception ex)
            {
                statCode = 500;
                res = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(statCode, res);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(TrainingVideoUpdateRequest model)
        {
            int statCode = 200;
            BaseResponse res = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                _service.Update(model, userId);

                res = new SuccessResponse();

            } catch(Exception ex)
            {
                statCode = 500;
                res = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(statCode, res);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int statCode = 200;
            BaseResponse res = null;

            try
            {
                _service.Delete(id);

                res = new SuccessResponse();
            } catch(Exception ex)
            {
                statCode = 500;
                res = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(statCode, res);
        }
    }
}
