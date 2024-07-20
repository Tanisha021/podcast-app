import React from 'react'
import { useSelector } from 'react-redux'
import Header from '../components/common/Header'
import Button from '../components/common/Button'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { toast } from 'react-toastify'
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
      return <Loader/>
    }
  return (
    <div>
        <Header />
      <h1>{user.name}</h1>
      <h1>{user.email}</h1>
      <h1>{user.uid}</h1>
      <Button text={"Logout"} onClick={handleLogout} />
    </div>
  )
}

export default Profile
