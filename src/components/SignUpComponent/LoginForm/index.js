import React, { useState } from 'react'
import InputComponent from "../../common/Input";
import Button from "../../common/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import {useDispatch} from "react-redux"
import {setUser} from "../../../slices/userSlice"
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from '../../common/Loader';
const LoginForm = () => {
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate= useNavigate();

  const dispatch = useDispatch();

  const handleLoginUp = async()=>{
    console.log("hangling login")
    setLoading(true);
    //creating user's account
    if(email && password){
      try{
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password);
        const user = userCredential.user;
        console.log("user-Login",user)

        //saving users details
        const userDoc = await getDoc(doc(db,"users",user.uid))
        const userData = userDoc.data();
        console.log("userDta-firestore",userData)


        //save data in the redux , callredux action
        dispatch(setUser({
          name:userData.name,
          email:user.email,
          uid:user.uid
        }))
        setLoading(false);
        toast.success("toastedd")
        navigate("/profile")
      }catch(e){
        console.log("error",e);
        toast.error(e.message)
      }
    }else{
      toast.error("make sure email and password are not empty");
      setLoading(false)
    }
     
    }

  // const handleLogin = ()=>{
  //   console.log("hangling Login")
  // }
  return (
    <>
    <h1>Signup</h1>
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
      
      <Button text={loading?<Loader/>:"Login"} disabled={loading} onClick={handleLoginUp}/>
    </>
  )
}

export default LoginForm

//fetch our userState and save it in redux using onAuthStateChange from firebase/auth  and create privateroutes
