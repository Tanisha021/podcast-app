import React from 'react'
import { useSelector } from 'react-redux'
import Header from '../components/common/Header'
import Button from '../components/common/Button'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { toast } from 'react-toastify'
import "./profile.css"
import Loader from '../components/common/Loader'

const Profile = () => {
    const user = useSelector((state)=>state.user.user)
    console.log("my user-redux",user)

    const handleLogout=()=>{
        signOut(auth).then(()=>{
          toast.success("user logged out")
        }).catch((error)=>{
          toast.error(error.message)
        })
    }
    if(!user){
      return (
        <div className="loader-container">
          <Loader />
        </div>
      );
    }
  return (
    <div>
      <Header />
      <div className="profile-container">
      <div className="profile-card">
        <h1>{user.name}</h1>
        <h1>{user.email}</h1>
        <h1>{user.uid}</h1>
      </div>
      <Button className="logout-btn" text={"Logout"} onClick={handleLogout} />
    </div>
    </div>
  )
}

export default Profile
