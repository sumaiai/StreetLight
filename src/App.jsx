import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import LandingPage from './Components/Landing/Landing';
import SignupPage from './Components/Signup/Signup';
import SigninPage from './Components/Signin/Signin';
import HomePage from './Components/Home/Home';
import PostRequest from './Components/Postrequest/Postrequest';
import ProfilePage from './Components/Profile/Profile';
import SearchPage from './Components/Search/Search';
import FriendsPage from './Components/Friends/Friends';
import MyRequestsPage from './Components/Myrequest/Myrequest';
import MyHelpsPage from './Components/MyHelps/MyHelps';
import RatePage from './Components/Rate/Rate';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/post-request" element={<PostRequest />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/my-requests" element={<MyRequestsPage />} />
        <Route path="/my-helps" element={<MyHelpsPage />} />
        <Route path="/rate/:requestId/:rateUserId" element={<RatePage />} />
      </Routes>
    </>
  );
}

export default App;