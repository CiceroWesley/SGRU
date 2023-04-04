import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// context
import { AuthContext } from '../../context/AuthContext';

// components
import { NavLink, Link } from 'react-router-dom';


const Navbar = () => {
  const {authState, setAuthState} = useContext(AuthContext);
  const navigate = useNavigate();
  // const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const user = JSON.parse(localStorage.getItem('user'));
  // useEffect(() => {
  //   const verifyUser = () => {
  //     setUser(JSON.parse(localStorage.getItem('user')));
  //   }
  //   verifyUser()
  // }, [user])
  const handleLogout = () => {
    localStorage.clear();
    navigate('/')
  }

  return (
    <nav>
      <Link to='/'>
        <h2>Título</h2>
      </Link>
      <ul>
        {!user ? (
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
            <Link to='/menu'>Menu</Link>
          </li>
          <li>
            <Link to='/createmeeting'>Criar reunião</Link>
          </li>
          <li>
            <Link to='/insertpauta'>Inserir pauta</Link>
          </li>
          <li>
            <Link to='/insertparticipante'>Inserir participante</Link>
          </li>
          <li>
            <p>{user.username}</p>
            <button onClick={handleLogout}>Sair</button>
          </li>
        </div>
        )}
      </ul>
    </nav>
  )
}

export default Navbar;