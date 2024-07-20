import React from 'react'
import Header from '../components/common/Header'
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {useDispatch} from "react-redux"
import InputComponent from '../components/common/Input';
import { toast } from 'react-toastify';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, uploadBytes,ref } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import Button from '../components/common/Button';
import FileInput from "../components/common/Input/FileInput"
import Loader from '../components/common/Loader';
const CreateAnEpisodePage = () => {
  const {id} = useParams();
  const [title,setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [audioFile, setAudioFile] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate= useNavigate();
  const dispatch = useDispatch();

  const audioFileHandle = (file)=>{
    setAudioFile(file);
  }

  const handleSubmit=async()=>{
    setLoading(true);
    if((title&&desc&&audioFile&&id)){
        try{
            const audioRef = ref(storage,`podcast-episodes/${auth.currentUser.uid}/${Date.now()}`
        )
        await uploadBytes(audioRef,audioFile);
        //convert audio to url
        const audioUrl = await getDownloadURL(audioRef);
        const episodeData={
            title:title,
            description : desc,
            audioFile:audioUrl
        }

        await addDoc(collection(db,"podcasts",id,"episodes"),episodeData)

        toast.success("Episode created")
        setTitle("")
        setDesc("")
        setAudioFile(null)
        setLoading(false)
        navigate(`/podcast/${id}`)

        }catch(e){
            toast.error(e.message);
            setLoading(false)
        }
    }else{
        toast.error("All details are not added");
        setLoading(false);
    }
  }
  return (
    <div>
        <Header/>
        <div className="input-wrapper">
        <h1>Create An Episode</h1>
        <InputComponent
          state={title}
          setState={setTitle}
          placeholder="title"
          type="text"
          required={true}
        />
       <InputComponent
        state={desc}
        setState={setDesc}
        placeholder="desc"
        type="text"
        required={true}
      />
       <FileInput
      accept={"audio/*"}
      id="audio-file-input"
      fileHandleFnc={audioFileHandle}
      text={"Upload Audio File"}
    />
      <Button
          text={loading ? <Loader/> : "Create Episode"}
          disabled={loading}
          onClick={handleSubmit}
        />
        </div>
    </div>
  )
}

export default CreateAnEpisodePage