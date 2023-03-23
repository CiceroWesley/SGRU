import { useContext, useEffect, useState } from 'react';

// context
import { AuthContext } from '../../context/AuthContext';

// components
import { NavLink, Link } from 'react-router-dom';


const Navbar = () => {
  const {authState, setAuthState} = useContext(AuthContext);
  // const [res, setRes] = useState('');

  // useEffect(() => {
  //   const getUser = async() => {
  //     // post request
  //     const token = localStorage.getItem('accessToken');
  //     if(token === null){
  //       setAuthState({
  //         username: '',
  //         id: 0,
  //         status: false
  //       });
  //       return;
  //     }
  //     const requestOptions = {
  //       method: 'GET',
  //       headers: {},
  //     };
  //     requestOptions.headers.Authorization = `Bearer ${token}`;
  //     const res = await fetch('http://localhost:3000/api/users/profile', requestOptions)
  //     .then((res) => res.json())
  //     .catch((err) => err);

  //     if(res === null){
  //       setAuthState({
  //         username: '',
  //         id: 0,
  //         status: false
  //       });
  //       return;
  //     }

  //     if(res.errors){
  //       console.log(res.errors)
  //     } else {
  //       // console.log(res)
  //       setAuthState({
  //         username: res.nome,
  //         id: res.id,
  //         status: true
  //       });
  //     }
  //   };
  //   getUser();
    
  // }, []);
  
  // useEffect(() => {
  //   const userToken = localStorage.getItem('accessToken');
  //   if(!userToken || userToken === null){
  //     setAuthState({...authState, status: false});
  //   }
  //   setAuthState({...authState, status: true});
  // },[authState.status])

  // O usuário ao colocar na barra de navegação a url de uma rota protegida é redirecionando para login
  // pq de inicio o status é false, só depois que a requisição da NAVBAR é realizada é trocado para true
  // a uma demora nesse processo e dessa forma o usuário fica como se nao tivesse logado
  return (
    <nav>
      <Link to='/'>
        <h2>Título</h2>
      </Link>
      <ul>
        {!authState.status ? (
          <div>
            <li>
              <Link to='/login'>Login</Link>
            </li>
            <li>
              <Link to='/register'>Registrar</Link>
            </li>
          </div>
        ) : (
          <div>
            <li>
              <Link to='/createmeeting'>Reuniões</Link>
            </li>
            <li>
              <Link>Participando</Link>
            </li>
          </div>
        )}
      </ul>
    </nav>
  )
}

export default Navbar;