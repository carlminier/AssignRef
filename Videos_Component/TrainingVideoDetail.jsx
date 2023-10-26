import React, { useState, useEffect } from "react";
import { Col, Row, Accordion, ListGroup, Form } from "react-bootstrap";
import PropTypes from 'prop-types';
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
      pageSize: 50,
      array: []
    },
    videoArray: [],
    filteredVideos: [],
    videoComponents: [],
    paginatedVideos: [],
    videoList: [],
    currentVideo: null,
    searchQuery: ""
  });

  const [seasons, setSeasons] = useState({
    data: [],
    comps: [],
  })

  useEffect(() => {
    videoService
      .getVideoCategorySelectAllVideos(currentUser.conferenceId)
      .then(onGetVideoCategorySuccess)
      .catch(onGetVideoCategoryError)
  }, [currentUser.conferenceId, videoData.categories])

  const onGetVideoCategorySuccess = (response) => {
    console.log("Video Category Success", response)
    const categories = response.items;

    setVideoData((prevState) => {
      const vd = { ...prevState }
      vd.categories.array = categories
      return vd
    })
  }
  const onGetVideoCategoryError = (error) => {
    console.log("Video Category Error", error)
  }

  useEffect(() => {
    if (!videoData.searchQuery) {
      videoService
        .getVideoByConference(videoData.pageIndex - 1, videoData.pageSize, currentUser.conferenceId)
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
    console.log("Get Videos Success", response)
    let vidArray = response.item.pagedItems;

    vidArray.forEach((video) => {
      video.isPlaying = false;
    });

    setVideoData((prevState) => {
      const vd = { ...prevState };
      vd.videoArray = vidArray;

      vd.videoComponents = vidArray.map(mapVideos);
      if (vidArray.length > 0) {
        vd.currentVideo = vidArray[0].mediaUrl;
        vd.videoArray[0].isPlaying = true;
      }

      vd.paginatedVideos = vidArray
      vd.videoList = vidArray.map(mapVideoList);
      vd.totalCount = response.item.totalCount;
      vd.totalPages = response.item.totalPages;
      console.log("GETvids", vd)
      return vd;
    });
  };

  const onGetVideosError = (error) => {
    console.log("error is firing", error);
    toastr.error(error.message)
  };

  const handleItemClick = (vid, id) => {

    setVideoData((prev) => {
      const dt = { ...prev };
      dt.currentVideo = vid;
      const vdArr = [...dt.videoArray];

      vdArr.indexOf(vid, id)

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

  const mapCategory = (aCategory) => {
    return (
      <Accordion.Item
        eventKey={aCategory?.category?.id}
        key={aCategory?.category?.id}>
        <Accordion.Header >
          {aCategory?.category?.name}
        </Accordion.Header>
        <Accordion.Body>
          <ListGroup>
            {aCategory?.videos?.map(mapVideos)}
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item >
    )
  }

  const renderCategories = () => {
    return videoData.categories?.array?.map(mapCategory)
  }

  useEffect(() => {
    console.log("I'm firing first")
    seasonService
      .getByConferenceId(currentUser.conferenceId)
      .then(onGetConfSuccess)
      .catch(onGetConfError)
  }, [])

  const onGetConfSuccess = (response) => {
    console.log("Get Conference Success", response)
    setSeasons((prevState) => {
      const nd = { ...prevState };
      nd.data = response.items;
      return nd
    })
  }
  const onGetConfError = (error) => {
    console.log("Get Conference Error", error)
    toastr.error(error.message)
  }

  const onSeasonClick = (e) => {
    const seasId = e.target.value
    const confId = currentUser.conferenceId
    console.log("SeasonId", (e, seasId))
    console.log("CURRENT Conference", (currentUser, currentUser.conferenceId))

    videoService
      .getVideoByConferenceSeason(videoData.pageIndex - 1, videoData.pageSize, confId, seasId)
      .then(onGetVidByIdSuccess)
      .catch(onGetVidByIdError)
  }
  const onGetVidByIdSuccess = (response) => {
    console.log("VidById Success", response)
    const seasonVids = response.item.pagedItems

    setVideoData((prevState) => {
      const vd = { ...prevState }
      vd.videoArray = seasonVids
      vd.categories.array = seasonVids.map(mapSeasons)
      return vd
    })
  }
  const onGetVidByIdError = (error) => {
    console.log("VidById Error", error)
    toastr.error(error.message)
  }

  const renderSeasons = () => {
    return seasons.data.map(mapSeasons)
  }

  const mapSeasons = (aSeason) => {
    return (
      <option
        value={aSeason.id}
        key={aSeason.id}>
        {aSeason.name}
      </option>
    )
  }

  const onPageChange = (page) => {
    console.log("PAGE", page)

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
    console.log("DELETETARGET", videoToBeDeleted)
    const sucessHandler = onDeleteVideoSuccess(videoToBeDeleted)
    videoService
      .deleteVideo(videoToBeDeleted)
      .then(sucessHandler)
      .catch(onDeleteVideoError);
  };

  const onDeleteVideoSuccess = (response) => {
    console.log("Success", response)

    setVideoData((prevState) => {
      const vd = { ...prevState }

      const indexOfId = vd.paginatedVideos.findIndex(aVideo => {
        let result = false;
        if (aVideo.id === response) {
          result = true;
        }
        return result;
      })
      console.log("Index found:", vd.paginatedVideos, indexOfId)
      if (indexOfId >= 0) {
        vd.paginatedVideos.splice(indexOfId, 1);
        vd.videoList = vd.paginatedVideos.map(mapVideoList);
      }
      return vd;
    })
  }
  const onDeleteVideoError = (error) => {
    console.log("Error", error)
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
        currentUser={currentUser}
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
            <Form.Select
              className="align-self-end"
              size="sm"
              aria-label="Default select example"
              onChange={onSeasonClick}>
              {renderSeasons()}
            </Form.Select>
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
              <FormikForm className="training-video-search ">
                <Row>
                  <div className="input-group mb-3">
                    <Field
                      type="text"
                      name="searchQuery"
                      placeholder="Search"
                      className="form-control"
                    />
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
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),

}

export default TrainingVideoHomePage;
