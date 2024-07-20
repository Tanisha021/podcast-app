import React, { useEffect, useRef, useState } from 'react'
import "./styles.css"
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
const AudioPlayer = ({audioSrc,image}) => {
  const [isPlaying,setisPlaying] = useState(true);
  const [duration,setDuration] = useState(0);
  const [currentTime,setcurrentTime] = useState(0);
  const [volume,setVolume] = useState(1);
  const [isMute,setisMute] = useState(false);

  const audioRef = useRef();

  const handleDuration=(e)=>{
    setcurrentTime(parseFloat(e.target.value))
    audioRef.current.currentTime = parseFloat(e.target.value)
  }

  const togglePlay=()=>{
    if(isPlaying){
      setisPlaying(false)
    }else{
      setisPlaying(true)
    }
  }

  const toggleVolume=()=>{
    if(isMute){
      setisMute(false)
    }else{
      setisMute(true)
    }
  }

  const handleVolume=(e)=>{
    setVolume(e.target.value)
    audioRef.current.volume = e.target.value
  }

  // useEffect(()=>{
  //   setDuration(audioRef.current.duration);
  // },[audioRef])

  useEffect(()=>{
    const audio = audioRef.current;
    audio.addEventListener("timeupdate",handleTimeUpdate);
    audio.addEventListener("loadmetadata",handleLoadedMetadata);
    audio.addEventListener("ended",handleEnded);

    return()=>{
      audio.removeEventListener("timeupdate",handleTimeUpdate);
      audio.removeEventListener("loadmetadata",handleLoadedMetadata);
      audio.removeEventListener("ended",handleEnded);
    }
  },[])

  const handleTimeUpdate=()=>{
    setcurrentTime(parseFloat(audioRef.current.currentTime));
  }

  const handleLoadedMetadata=()=>{
    setDuration(parseFloat(audioRef.current.duration))
  }

  const handleEnded =()=>{
    setcurrentTime(0);
    setisPlaying(false);
  }

  const formatTime = (time)=>{
    const minutes = Math.floor(time/60);
    const seconds = Math.floor(time%60);
    return `${minutes}:${seconds<10 ? "0":""}${seconds}`
  }
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isMute) {
      audioRef.current.volume = 1;
      setVolume(1);
    } else {
      audioRef.current.volume = 0;
      setVolume(0);
    }
  }, [isMute]);

  return (
    <div className='custom-audio-player'>
        <img src={image} className='display-image-player' />
        <audio ref={audioRef} src={audioSrc}/>

        <div className='duration-flex'>
          <p className='audio-btn' onClick={togglePlay}>{isPlaying?<FaPause/>:<FaPlay/>}</p>
          <p>{formatTime(currentTime)}</p>
          <input 
          type='range' 
          onChange={handleDuration} 
          max={duration}
          value={currentTime}
          step={0.01}
          className='duration-range' />
          <p>-{formatTime(duration-currentTime)}</p>
          <p className='audio-btn' onClick={toggleVolume}>{!isMute?<FaVolumeUp/>:<FaVolumeMute/>}</p>
          <input 
          type='range'
          value={volume} 
          max={1}
          min={0}
          step={0.01}
          onChange={handleVolume} 
          className='volume-range' />
        </div>
        
    </div>
  )
}

export default AudioPlayer