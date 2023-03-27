import { useContext, useEffect, useState } from 'react';

// context
import { AuthContext } from '../../context/AuthContext';

// components
import { NavLink, Link } from 'react-router-dom';


const Navbar = () => {
  const {authState, setAuthState} = useContext(AuthContext);
  // const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const user = JSON.parse(localStorage.getItem('user'));
  // useEffect(() => {
  //   const verifyUser = () => {
  //     setUser(JSON.parse(localStorage.getItem('user')));
  //   }
  //   verifyUser()
  // }, [user])

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