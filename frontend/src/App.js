import './App.css';

// react router
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

// context
import { AuthContext } from './context/AuthContext';
import { useState, useLayoutEffect } from 'react';

// components
import Navbar from './components/Navbar/Navbar';

import Footer from './components/Footer/Footer';

// pages
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import CreateMeeting from './pages/CreateMeeting/CreateMeeting';
import Menu from './pages/Menu/Menu';
import InsertPauta from './pages/InsertPauta/InsertPauta';
import InsertParticipante from './pages/InsertParticipante/InsertParticipante';
import Meeting from './pages/Meeting/Meeting';
import MeetingOrganizador from './pages/MeetingOrganizador/MeetingOrganizador';
import EditProfile from './pages/EditProfile/EditProfile';
import NotFound from './pages/NotFound/NotFound';

function App() {
  const [authState, setAuthState] = useState({
    username : "",
    id: 0,
    status: false,
  });
  return (
    <div className="App">
      <AuthContext.Provider value={{authState, setAuthState}}>
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path='/' exact element={<Home/>} />
            <Route path='/login' exact element={<Login/>}/>
            <Route path='/register' exact element={<Register/>}/>
            <Route path='/createmeeting' exact element={<CreateMeeting/>}/>
            <Route path='/menu' exact element={<Menu/>}/>
            <Route path='/insertpauta' exact element={<InsertPauta/>}/>
            <Route path='/insertparticipante' exact element={<InsertParticipante/>} />
            <Route path='/meeting/:id' exact element={<Meeting />}/>
            <Route path='/meetingorg/:id' exact element={<MeetingOrganizador />}/>
            <Route path='/editprofile' exact element={<EditProfile />}/>
            <Route path='*' element={<NotFound/>}/>
          </Routes>
          <Footer/>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
