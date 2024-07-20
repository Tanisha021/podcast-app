import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './output.css'
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot,doc } from 'firebase/firestore';
import { db } from './firebase';
import { setUser } from './slices/userSlice';
import PrivateRoutes from './components/common/PrivateRoutes';
import { auth } from './firebase';
import CreateAPodcast from './pages/CreateAPodcastPage';
import PodcastsPage from './pages/Podcasts';
import PodcastDetailsPage from './pages/PodcastDetails';
import CreateAnEpisodePage from './pages/CreateAnEpisodePage';

function App() {
  const dispatch = useDispatch();

  useEffect(()=>{
    const unsubscribeAuth= onAuthStateChanged(auth,(user)=>{
      if(user){
        const unsubscribeAuth = onSnapshot(
          doc(db,"users",user.uid),
          (userDoc) =>{
            if(userDoc.exists()){
              const userData = userDoc.data();
              dispatch(
                setUser({
                  name:userData.name,
                  email:userData.email,
                  uid:user.uid
                })
              )
            }
          },
          (error)=>{
            console.error("errorfetchign user data",error)
          }
        );
        return()=>{
          unsubscribeAuth();
        }
      }
    });
    return()=>{
      unsubscribeAuth();
    }
  },[]);
  return (
    <div className=" bg-theme">
      <Router>
      <ToastContainer/>
        <Routes>
          <Route path="/" element={<SignUp />} /> 
          <Route element={<PrivateRoutes />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-a-podcast" element={<CreateAPodcast />} />
            <Route path="/podcasts" element={<PodcastsPage />} />
            <Route path="/podcast/:id" element={<PodcastDetailsPage />} />
            <Route
              path="/podcast/:id/create-episode"
              element={<CreateAnEpisodePage />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
