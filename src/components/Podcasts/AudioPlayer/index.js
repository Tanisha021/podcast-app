import React, { useEffect, useRef, useState } from 'react'
import "./styles.css"
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaSpinner } from "react-icons/fa";
import { toast } from 'react-toastify';

const AudioPlayer = ({audioSrc,image}) => {
  const [isPlaying,setIsPlaying] = useState(false);
  const [duration,setDuration] = useState(0);
  const [currentTime,setCurrentTime] = useState(0);
  const [volume,setVolume] = useState(1);
  const [isMute,setIsMute] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [prevVolume, setPrevVolume] = useState(1);
  const [error,setError]= useState(null)

  const audioRef = useRef();
  const isPlayingRef = useRef(isPlaying);

  const handleDuration=(e)=>{
    setCurrentTime(parseFloat(e.target.value))
    audioRef.current.currentTime = parseFloat(e.target.value)
  }

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  const togglePlay = () => {
    if (!isLoaded) return;
  
    setIsLoading(true);
  
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
            toast.success("Playing your fav song");
          })
          .catch(error => {
            console.error("Playback failed:", error);
            toast.error("Failed to play audio. Please try again.");
            setError("Failed to play audio. Please try again.");
            setIsLoading(false);
          });
      }
    }
  };
  

  useEffect(() => {
    const audio = audioRef.current;
  
    const onLoadedMetadata = () => {
      setIsLoaded(true);
      setIsLoading(false);
      setDuration(audio.duration);
      setError(null);
      toast.success("Audio loaded successfully");
      if (isPlayingRef.current) {
        audio.play();
      }
    };
    
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
  
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
  
    const onPlay = () => {
      setIsPlaying(true);
    };
  
    const onPause = () => {
      setIsPlaying(false);
    };
  
    const onVolumeChange = () => {
      setVolume(audio.volume);
      setIsMute(audio.muted);
    };
  
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("volumechange", onVolumeChange);
  
    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("volumechange", onVolumeChange);
    };
  }, []);

  const toggleVolume = () => {
    if (isMute) {
      // If currently muted, restore the previous volume
      audioRef.current.volume = prevVolume;
      setVolume(prevVolume);
      audioRef.current.muted = false;
    } else {
      // If currently unmuted, mute and store the current volume
      setPrevVolume(volume);
      audioRef.current.volume = 0;
      audioRef.current.muted = true;
       setIsMute(!isMute);
    }
  };
  
  const handleVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  
    // Automatically unmute if volume is adjusted
    if (newVolume > 0) {
      setIsMute(false);
      audioRef.current.muted = false;
    } else {
      setIsMute(true);
      audioRef.current.muted = true;
    }
  };

  // useEffect(()=>{
  //   setDuration(audioRef.current.duration);
  // },[audioRef])

  // useEffect(()=>{
  //   const audio = audioRef.current;
  //   audio.addEventListener("timeupdate",handleTimeUpdate);
  //   audio.addEventListener("loadmetadata",handleLoadedMetadata);
  //   audio.addEventListener("ended",handleEnded);

  //   return()=>{
  //     audio.removeEventListener("timeupdate",handleTimeUpdate);
  //     audio.removeEventListener("loadmetadata",handleLoadedMetadata);
  //     audio.removeEventListener("ended",handleEnded);
  //   }
  // },[])

  // const handleTimeUpdate=()=>{
  //   setCurrentTime(parseFloat(audioRef.current.currentTime));
  // }

  // const handleLoadedMetadata=()=>{
  //   setDuration(parseFloat(audioRef.current.duration))
  // }

  // const handleEnded =()=>{
  //   setCurrentTime(0);
  //   setIsPlaying(false);
  // }

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

  return (
    <div className='custom-audio-player'>
        <img src={image} className='display-image-player' alt="Album cover" />
        {/* <audio ref={audioRef} src={audioSrc}/> */}
        <audio ref={audioRef}>
          <source src={audioSrc} type="audio/mpeg" />
          <source src={audioSrc.replace('.mp3','.m4a', '.ogg')} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>

        

        {error && <p className="error-message">{error}</p>}

        <div className='duration-flex'>
        <p className='audio-btn' onClick={togglePlay}>
          {isLoading ? <FaSpinner className="spinner" /> : (isPlaying ? <FaPause /> : <FaPlay />)}
        </p>

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
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMute ? 0 : volume} 
            onChange={handleVolume} 
            className='volume-range'
          />
          {/* <input 
          type='range'
          value={volume} 
          max={1}
          min={0}
          step={0.01}
          onChange={handleVolume} 
          className='volume-range' /> */}
        </div>
        
    </div>
  )
}

export default AudioPlayer