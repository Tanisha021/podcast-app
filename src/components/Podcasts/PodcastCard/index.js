import React from 'react'
import "./styles.css"
import { Link } from 'react-router-dom'
const PodcastCard = ({id,title,displayImage}) => {
  return (
    <Link to={`/podcast/${id}`}>
      <div className="podcast-card">
        <img className="display-image-podcast" alt='podcast-single' src={displayImage} />
        <p className="title-podcast">{title}</p>
      </div>
    </Link>
  );
}

export default PodcastCard
