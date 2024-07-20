import React, { useState } from 'react'
import InputComponent from "../../common/Input";
import Button from "../../common/Button";
import { auth, db } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {useDispatch} from "react-redux"
import {setUser} from "../../../slices/userSlice"
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from '../../common/Loader';

const SignupForm = () => {
  const [fullName,setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate= useNavigate();

  const dispatch = useDispatch();

  const handleSignUp = async()=>{
    console.log("hangling signpup")
    //creating user's account
    setLoading(true);
    if(password == confirmPassword && password.length>6){
      try{
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password);
        const user = userCredential.user;
        console.log("user",user)

        //saving users details
        await setDoc(doc(db,"users",user.uid),{
          name:fullName,
          email:user.email,
          uid:user.uid
        })

        //save data in the redux , callredux action
        dispatch(setUser({
          name:fullName,
          email:user.email,
          uid:user.uid
        }))

        toast.success("toastedd")
        setLoading(false);
        navigate("/profile")
      
      }catch(e){
        console.log("error",e);
        toast.error(e.message)
        setLoading(false);
      }
    }else{
      //throw error
      if(password!=confirmPassword){
        toast.error("Please make sure your password and confirm passoword are same");
      }else if(password.length<6){
        toast.error("Plz think of something alteast your bday");
      }
      setLoading(false);
    }
  } 

  // const handleClick = ()=>{
  //   console.log("hangling signpup")
  // }
  return (
    <>
    <InputComponent
          state={fullName}
          setState={setFullName}
          placeholder="full Name"
          type="text"
          required={true}
        />
       <InputComponent
        state={email}
        setState={setEmail}
        placeholder="Email"
        type="text"
        required={true}
      />
      <InputComponent
        state={password}
        setState={setPassword}
        placeholder="Password"
        type="password"
        required={true}
      />
      <InputComponent
        state={confirmPassword}
        setState={setConfirmPassword}
        placeholder="Confirm Password"
        type="password"
        required={true}
      />
      <Button text={loading?<Loader/>:"Signup"} disabled={loading} onClick={ handleSignUp}/>
    </>
  )
}

export default SignupForm
