import React from "react";
import { Card, Button, Col } from "react-bootstrap";
import PropTypes from 'prop-types';
import debug from "sabio-debug";
const _logger = debug.extend("TrainingVideoCard");

function TrainingVideoCard({ card, deleteVideo }) {

  _logger("CARDPROPS", card)

  const onVideoDelete = () => {
    _logger("delete clicked", card)
    deleteVideo(card.id)
  }

  return (
    <>
      <Col className="p-5">
        <Card
          className="training-video-card"
        >
          <Card.Img
            className="training-video-image"
            variant="top"
            src={card.imageUrl}
            alt="First image" />
          <Card.Body
            className="p-4">
            <Button
              id={card.id}
              size="sm"
              variant="outline-danger"
              onClick={onVideoDelete}
            >
              Delete
            </Button>
            <Card.Title>
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
      </Col>
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
  }),
  roles: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired,
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
    isPublished: PropTypes.bit,
    imageUrl: PropTypes.string.isRequired,
    isDeleted: PropTypes.bit
  }),
  deleteVideo: PropTypes.func,
}



export default TrainingVideoCard