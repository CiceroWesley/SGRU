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
          {/* FAZER também a verificação da autenticação nas rotas, como no projeto do react gram */}
          <Routes>
            <Route  path='/' exact element={<Home/>} />
            <Route path='/login' exact element={<Login/>}/>
            <Route path='/register' exact element={<Register/>}/>
            <Route path='/createmeeting' exact element={<CreateMeeting/>}/>
            <Route path='/menu' exact element={<Menu/>}/>
            <Route path='/insertpauta' exact element={<InsertPauta/>}/>
            <Route path='/insertparticipante' exact element={<InsertParticipante/>} />
            
          </Routes>
          <Footer/>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
