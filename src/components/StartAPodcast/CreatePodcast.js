import React from 'react'
import Button from "../common/Button";
import FileInput from '../common/Input/FileInput';
import InputComponent from '../common/Input';
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db, storage } from "../../firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from 'react';
import Loader from '../common/Loader';

const CreatePodcast = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
   const [displayImage, setDisplayImage] = useState();
   const [bannerImage, setBannerImage] = useState();

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit=async()=>{
    toast.success("Handling Form")
    if(title && desc && displayImage && bannerImage){
      setLoading(true)
      // 1.Upload files -> get downloadable links
      //bannerImage
      try{
        const bannerImageRef = ref(
          storage,
          `podcast/${auth.currentUser.uid}/${Date.now()}`
        )
        await uploadBytes(bannerImageRef,bannerImage);
        //convert image to url(getDownloadURL)
        const bannerImageUrl = await getDownloadURL(bannerImageRef)
        
        //diplayImage
        const displayImageRef = ref(
          storage,
          `podcast/${auth.currentUser.uid}/${Date.now()}`
        )
        await uploadBytes(displayImageRef,bannerImage);
        //convert image to url(getDownloadURL)
        const displayImageUrl = await getDownloadURL(displayImageRef)
  
        // 2.create a new doc in a new collection called podcast
        const podcastData={
          title:title,
          description: desc,
          bannerImage :bannerImageUrl,
          displayImage :displayImageUrl,
          createdBy:auth.currentUser.uid
        }
        const docRef = await addDoc(collection(db,"podcasts"),podcastData);

        // 3.save this new podcast episodes states in our podcast
        toast.success("Podcast created")
        setTitle("")
        setDesc("")
        setBannerImage(null)
        setDisplayImage(null)
        setLoading(false)
      }catch(e){
        toast.error(e.message)
        console.log(e)
        setLoading(false)
      }

    }else{
      toast.error("Please Enter All Values")
    }
  }
  const bannerImageHandle=(file)=>{
    setBannerImage(file);
  }
  const displayImageHandle=(file)=>{
    setDisplayImage(file);
  }
  return (
    <>
    <InputComponent
      state={title}
      setState={setTitle}
      placeholder="Title"
      type="text"
      required={true}
    />
    <InputComponent
      state={desc}
      setState={setDesc}
      placeholder="Description"
      type="text"
      required={true}
    />
    <FileInput
      accept={"image/*"}
      id="display-image-input"
      fileHandleFnc={displayImageHandle}
      text={"Display Image Upload"}
    />

    <FileInput
      accept={"image/*"}
      id="banner-image-input"
      fileHandleFnc={bannerImageHandle}
      text={"Banner Image Upload"}
    />

    <Button
      text={loading ? <Loader/>: "Create Podcast"}
      disabled={loading}
      onClick={handleSubmit}
    />
  </>
  )
}

export default CreatePodcast
