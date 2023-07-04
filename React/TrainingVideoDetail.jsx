import React, { useState, useEffect, useCallback } from "react";
import {
  Col, Row, Accordion, ListGroup, Form,
  // OverlayTrigger, Popover
} from "react-bootstrap";
import PropTypes from 'prop-types';
import debug from "sabio-debug";
import toastr from "toastr";
import Pagination from 'rc-pagination';
import locale from "rc-pagination/lib/locale/en_US";
import 'rc-pagination/assets/index.css';
//Components 
import TableOfContents from "./TableOfContents";
import TitleHeader from "components/general/TitleHeader";
import VideoPreview from "./VideoPreview";
import TrainingVideoCard from "./TrainingVideoCard";
//Services
import videoService from "../../services/videoService";
import seasonService from "services/seasonService";
//Styles
import "./trainingvideodetail.css";
import { Formik, Form as FormikForm, Field } from "formik";

const _logger = debug.extend("TrainingVideoDetail");

const TrainingVideoHomePage = ({ currentUser }) => {
  const [videoData, setVideoData] = useState({
    pageIndex: 1,
    pageSize: 3,
    totalCount: 0,
    totalPages: 0,
    page: {
      current: 1,
      currentIndex: 0,
    },
    categories: {
      pageIndex: 1,
      pageSize: 50
    },
    videoArray: [],
    filteredVideos: [],
    videoComponents: [],
    paginatedVideos: [],
    videoList: [],
    currentVideo: null,
    searchQuery: ""
  });

  //create a separate state for categories with pagesize of 100

  const [seasons, setSeasons] = useState({
    data: [],
    comps: [],
  })

  useEffect(() => {
    if (!videoData.searchQuery) {
      videoService
        .getVideoByConference(videoData.categories.pageIndex - 1, videoData.categories.pageSize, currentUser.conferenceId)
        .then(onGetVideosSuccess)
        .catch(onGetVideosError)
    } else {
      videoService
        .getVideoBySearch(videoData.pageIndex - 1, videoData.pageSize, videoData.searchQuery)
        .then(onGetVideosSuccess)
        .catch(onGetVideosError)
    }
  }, [videoData.pageIndex, videoData.searchQuery, currentUser.conferenceId])

  const onGetVideosSuccess = (response) => {
    _logger("Get Videos Success", response)
    let vidArray = response.item.pagedItems;

    vidArray.forEach((video) => {
      video.isPlaying = false;
    });

    setVideoData((prevState) => {
      const vd = { ...prevState };
      vd.videoArray = vidArray;

      // Step 1 
      const categories = [];
      const filteredArr = [];

      vd.videoArray.forEach((video, index) => {

        if (!categories.includes(video.category.id)) {
          categories.push(video.category.id)
          filteredArr[index] = [];
          filteredArr[index].push(video);
        }
        else {
          if (filteredArr.length >= 0) {
            let idx = filteredArr?.findIndex(vid => {
              // debugger;
              if (vid !== undefined) {
                // debugger;
                vid[0]?.category.id === video.category.id
              }
            })
            filteredArr[idx]?.push(video)
          }
        }
      })

      vd.filteredVideos = filteredArr;
      vd.videoComponents = vidArray.map(mapVideos);

      if (vidArray.length > 0) {
        vd.currentVideo = vidArray[0].mediaUrl;
        vd.videoArray[0].isPlaying = true;
      }

      vd.paginatedVideos = vidArray
      vd.videoList = vidArray.map(mapVideoList);
      vd.totalCount = response.item.totalCount;
      vd.totalPages = response.item.totalPages;

      _logger("GETvids", vd)
      return vd;
    });
  };

  const onGetVideosError = (response) => {
    _logger("error is firing", response);
    toastr.error(error.message)
  };

  const handleItemClick = (vid, id) => {
    setVideoData((prev) => {
      const dt = { ...prev };
      dt.currentVideo = vid;
      const vdArr = [...dt.videoArray];

      vdArr.forEach((vd) => {
        if (vd.id === id) {
          vd.isPlaying = true;
        } else {
          vd.isPlaying = false;
        }
      });
      dt.videoArray = vdArr;
      dt.videoComponents = vdArr.map(mapVideos);
      return dt;
    });
  };

  const mapCategory = useCallback((aCategory) => {
    return (
      <Accordion.Item
        eventKey={aCategory[0]?.category?.id}
        key={aCategory[0]?.category?.id}>
        <Accordion.Header >
          {aCategory[0]?.category?.name}
        </Accordion.Header>
        <Accordion.Body>
          <ListGroup>
            {aCategory?.map(mapVideos)}
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item >
    )
  }, [])

  const renderCategories = useCallback(() => {
    return videoData.filteredVideos?.map(mapCategory)
  }, [videoData.videoComponents, currentUser.conferenceId])

  useEffect(() => {
    _logger("I'm firing first")
    seasonService
      .getByConferenceId(currentUser.conferenceId)
      .then(onGetConfSuccess)
      .catch(onGetConfError)
  }, [])

  const onGetConfSuccess = (response) => {
    _logger("Get Conference Success", response)
    setSeasons((prevState) => {
      const nd = { ...prevState };
      nd.data = response.items;
      return nd
    })
  }
  const onGetConfError = (error) => {
    _logger("Get Conference Error", error)
    toastr.error(error.message)
  }

  //When a video is selected, render video onto paged

  const onSeasonClick = (e) => {
    const seasId = e.target.value
    const confId = currentUser.conferenceId
    _logger("SeasonId", (e, seasId))
    _logger("CURRENT Conference", (currentUser, currentUser.conferenceId))

    videoService
      .getVideoByConferenceSeason(videoData.pageIndex - 1, videoData.pageSize, confId, seasId)
      .then(onGetVidByIdSuccess)
      .catch(onGetVidByIdError)
  }
  const onGetVidByIdSuccess = (response) => {
    _logger("VidById Success", response)
    const seasonVids = response.item.pagedItems

    setVideoData((prevState) => {
      const vd = { ...prevState }
      vd.videoArray = seasonVids
      vd.videoComponents = seasonVids.map(mapVideos)
      _logger("SEASONVIDEOS", vd)
      return vd
    })
  }
  const onGetVidByIdError = (error) => {
    _logger("VidById Error", error)
    toastr.error(error.message)
  }

  const renderSeasons = useCallback(() => {
    return seasons.data.map(mapSeasons)
  }, [seasons.data, videoData.videoComponents, currentUser.conferenceId])

  const mapSeasons = useCallback((aSeason) => {
    return (
      <option
        value={aSeason.id}
        key={aSeason.id}>
        {aSeason.name}
      </option>
    )
  }, [])

  const onPageChange = (page) => {
    _logger("PAGE", page)

    setVideoData((prevState) => {
      let newPage = { ...prevState }
      newPage.pageIndex = page;
      return newPage
    });
  }

  const onVidSearch = (values) => {
    setVideoData((prevState) => {
      const vd = { ...prevState };
      vd.pageIndex = 1,
        vd.searchQuery = values.searchQuery
      return vd
    })
  }

  const handleDeleteVideo = (videoToBeDeleted) => {
    _logger("DELETETARGET", videoToBeDeleted)
    const sucessHandler = onDeleteVideoSuccess(videoToBeDeleted)
    videoService
      .deleteVideo(videoToBeDeleted)
      .then(sucessHandler)
      .catch(onDeleteVideoError);
  };

  const onDeleteVideoSuccess = (response) => {
    _logger("Success", response)

    setVideoData((prevState) => {
      const vd = { ...prevState }

      const indexOfId = vd.paginatedVideos.findIndex(aVideo => {
        let result = false;
        if (aVideo.id === response) {
          result = true;
        }
        return result;
      })
      _logger("Index found:", vd.paginatedVideos, indexOfId)
      if (indexOfId >= 0) {
        vd.paginatedVideos.splice(indexOfId, 1);
        vd.videoList = vd.paginatedVideos.map(mapVideoList);
      }
      return vd;
    })
  }
  const onDeleteVideoError = (error) => {
    _logger("Error", error)
    toastr.error(error.message)
  }

  const clearSearch = (resetForm) => {
    setVideoData((prevState) => {
      const vd = { ...prevState }
      vd.pageIndex = 1;
      vd.searchQuery = "";
      return vd;
    })
    resetForm();
  }

  const mapVideoList = (aCard) => {
    return (
      <TrainingVideoCard
        key={aCard.id}
        card={aCard}
        deleteVideo={handleDeleteVideo}
      />
    )
  }

  const mapVideos = (aVideo) => {
    return (
      <TableOfContents
        item={aVideo}
        key={"list" + aVideo.id}
        onVideoClick={handleItemClick}
      />
    );
  };

  return (
    <React.Fragment>
      <TitleHeader
        title="Training Videos"
        buttonText="Add Video"
        buttonLink="/videos/add" />
      < Row className="col-md-12">
        <Col md={4} lg={3}>
          <Form className="mb-3">
            <label className="m-1 h5">Seasons</label>
            {/* <OverlayTrigger
              trigger="focus"
              key={1}
              placement="right"
              overlay={
                <Popover id={`popover-positioned`}>
                  <Popover.Header as="h3">{`Uh-Oh`}</Popover.Header>
                  <Popover.Body>
                    <strong>Holy guacamole!</strong> No videos to show
                  </Popover.Body>
                </Popover>
              }
            > */}
            <Form.Select
              className="align-self-end"
              size="sm"
              aria-label="Default select example"
              onChange={onSeasonClick}>
              {renderSeasons()}
            </Form.Select>
            {/* </OverlayTrigger> */}
            <hr />
            <label className="m-1 h5">Categories</label>
            <Accordion defaultActiveKey={1}>
              {renderCategories()}
            </Accordion>
          </Form>
        </Col>
        <Col md={7} lg={9} className="card">
          <div className="training-video-player">
            {videoData.currentVideo &&
              (<VideoPreview
                video={videoData.currentVideo} />)}
          </div>
          <Formik
            enableReinitialize={true}
            initialValues={videoData}
            onSubmit={onVidSearch}
          >
            {({ resetForm }) => (
              <FormikForm className="training-video-search">
                <Row>
                  <div className="input-group mb-3">
                    <Field
                      type="text"
                      name="searchQuery"
                      placeholder="Search"
                      className="form-control" />
                    <button
                      className="btn btn-outline-secondary ms-1"
                      type="submit">
                      Search
                    </button>
                    <button
                      className="btn btn-outline-warning ms-1"
                      type="button"
                      onClick={() => clearSearch(resetForm)}
                    >
                      Clear
                    </button>
                  </div>

                </Row>
              </FormikForm>
            )}
          </Formik>
          <div className="align-self-center">
            <Row className="align-self-center">
              {videoData.videoList}
            </Row>
          </div>
          <div className="align-self-center">
            <Pagination
              className="align-self-center p-4"
              onChange={onPageChange}
              current={videoData.pageIndex}
              total={videoData.totalCount}
              pageSize={videoData.pageSize}
              locale={locale}
            />
          </div>
        </Col>
      </Row>
    </React.Fragment >
  );
};

TrainingVideoHomePage.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    conferenceId: PropTypes.number.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
  }),

}

export default TrainingVideoHomePage;