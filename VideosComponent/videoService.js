import axios from "axios";

import {
  onGlobalError,
  onGlobalSuccess,
  API_HOST_PREFIX,
} from "services/serviceHelpers";

const videoService = {
  endpoint: `${API_HOST_PREFIX}/api/training/videos`,
};

videoService.getVideos = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${videoService.endpoint}/paginate/createdBy?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

videoService.getVideoByConference = (pageIndex, pageSize,id) => {
  const config = {
    method: "GET",
    url: `${videoService.endpoint}/paginate/conference/${id}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

videoService.getVideoCategorySelectAllVideos = (id) => {
  const config = {
    method: "GET",
    url: `${videoService.endpoint}/conferenceId/${id}`,
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

videoService.getVideoBySeason = (pageIndex, pageSize,id) => {
  const config = {
    method: "GET",
    url: `${videoService.endpoint}/paginate/season/${id}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

videoService.getVideoByConferenceSeason = (pageIndex, pageSize,cId, sId) => {
  const config = {
    method: "GET",
    url: `${videoService.endpoint}/paginate/conference/${cId}/season/${sId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
 
videoService.getVideoBySearch = (pageIndex, pageSize, query) => {
  const config = {
    method: "GET",
    url: `${videoService.endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
    withCredentials: true,
    crossDomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

videoService.deleteVideo = (id) => {
  const config = {
    method: "DELETE",
    url: `${videoService.endpoint}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};


export default videoService;
