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

function App() {
  const [authState, setAuthState] = useState({
    username : "",
    id: 0,
    status: false,
  });

  useLayoutEffect(() => {
    const getUser = async() => {
      console.log("Carregando usuário")
      // post request
      const token = localStorage.getItem('accessToken');
      if(token === null){
        setAuthState({
          username: '',
          id: 0,
          status: false
        });
        return;
      }
      const requestOptions = {
        method: 'GET',
        headers: {},
      };
      requestOptions.headers.Authorization = `Bearer ${token}`;
      const res = await fetch('http://localhost:3000/api/users/profile', requestOptions)
      .then((res) => res.json())
      .catch((err) => err);

      if(res === null){
        setAuthState({
          username: '',
          id: 0,
          status: false
        });
        return;
      }

      if(res.errors){
        console.log(res.errors);
        return;
      } else {
        // console.log(res)
        setAuthState({
          username: res.nome,
          id: res.id,
          status: true
        });
      }
      console.log("Usuário carregado")
    };
    getUser();
    
  }, []);

  // Continuar com o AuthContext. A diferença é que no outro usa o usuário como resposta da requisição, acessando por exemplo por user.token user. id e etc nos estatos do redux.
  // Aqui no momento do login o token vai para o localstorage e o restante para o Stado acima
  // AuthState


  // Veja a função de registro ou login
  // https://github.com/CiceroWesley/curso-react-zero-maestria/blob/main/Curso%20react/12_reactgram/backend/controllers/UserController.js
  // pegando o item do localstorage
  // https://github.com/CiceroWesley/curso-react-zero-maestria/blob/main/Curso%20react/12_reactgram/frontend/src/slices/authSlice.js
  // user._id pego do user selector state.auth
  // https://github.com/CiceroWesley/curso-react-zero-maestria/blob/main/Curso%20react/12_reactgram/frontend/src/components/Navbar.js

  // SEGUIR a de baixo

  // Ja aqui é dividido
  // https://github.com/machadop1407/FullStack-Course/blob/Episode16/client/src/App.js
  // Seta os estados e o token
  // https://github.com/machadop1407/FullStack-Course/blob/Episode16/client/src/pages/Login.js

  console.log(authState.status)
  return (
    <div className="App">
      <AuthContext.Provider value={{authState, setAuthState}}>
        <BrowserRouter>
          <Navbar/>
          {/* FAZER também a verificação da autenticação nas rotas, como no projeto do react gram */}
          <Routes>
            <Route  path='/' exact element={<Home/>} />
            <Route path='/login' exact element={!authState.status ? <Login/> : <Navigate to='/menu'/>}/>
            <Route path='/register' exact element={<Register/>}/>
            <Route path='/createmeeting' exact element={authState.status ? <CreateMeeting/> : <Navigate to='/login'/>}/>
            <Route path='/menu' exact element={authState.status ? <Menu/> : <Navigate to='/login'/>}/>
            
          </Routes>
          <Footer/>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
