import React from 'react'
import "./styles.css"
import Button from '../../common/Button'
const EpisodeDetails = ({index,title,desc,audioFile,onClick}) => {
  return (
    <div style={{ width: "100%" }}>
      <h1 style={{ textAlign: "left", marginBottom: 0 }}>
        {index}. {title}
      </h1>
      <p style={{ marginLeft: "1.5rem",marginBottom: 0 }} className="podcast-description ">
        {desc}
      </p>
      <Button
        text={"Play"}
        onClick={() => onClick(audioFile)}
        width={"150px"}
      />
    </div>
  )
}

export default EpisodeDetails