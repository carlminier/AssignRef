import React from "react";
import { Card, Button } from "react-bootstrap";
import PropTypes from 'prop-types';

function TrainingVideoCard({ card, deleteVideo, currentUser }) {

  const onVideoDelete = () => {
    _logger("delete clicked", card)
    deleteVideo(card.id)
  }

  let sliceTitle = () => {
    let splitString = card.title.split("")
    if (splitString.length > 23) {
      card.title = card.title.slice(0, 23) + "..."
    }
  }

  return (
    <>
      <div className="col m-1">
        <div className="row">
          <Card
            className="training-video-card"
          >
            <Card.Img
              className="training-video-image"
              variant="top"
              src={card.imageUrl}
              alt="First image" />
            <Card.Body
              className="p-2">
              {currentUser.roles[0] === ("Admin" || "Assigner") ? <Button
                id={card.id}
                size="sm"
                variant="outline-danger"
                onClick={onVideoDelete}
              >
                Delete
              </Button> : null}
              <Card.Title
                onLoad={sliceTitle()}>
                {card.title}
              </Card.Title>
              <Card.Text>
                {card.conference?.code}
              </Card.Text>
              <Card.Text>
                {card.season.name}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>

    </>
  )
}

TrainingVideoCard.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    conferenceId: PropTypes.number.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  roles: PropTypes.shape({
    id: PropTypes.number.isRequired
  }),
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    category: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    season: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired
    }).isRequired,
    conference: PropTypes.shape({
      id: PropTypes.number.isRequired,
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired
    }).isRequired,
    title: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    mediaUrl: PropTypes.string.isRequired,
    isPublished: PropTypes.bool,
    imageUrl: PropTypes.string.isRequired,
    isDeleted: PropTypes.bool
  }),
  deleteVideo: PropTypes.func,
}



export default TrainingVideoCard
