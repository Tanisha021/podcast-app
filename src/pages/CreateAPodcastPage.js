import React from 'react'
import Header from '../components/common/Header'
import CreatePodcast from '../components/StartAPodcast/CreatePodcast'

const CreateAPodcastPage = () => {
  return (
    <div>
      <Header/>
      <div className='input-wrapper'>
          <h1>Create a Podcast</h1>
          <CreatePodcast/>
      </div>
    </div>
  )
}

export default CreateAPodcastPage
