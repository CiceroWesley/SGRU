import { useState, useContext } from "react";
import {AuthContext} from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  // Context
  const {AuthState, setAuthState} = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userCredentials = {
      email,
      senha
    };

    // post request
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(userCredentials)
    };

    try {
      const res = await fetch('http://localhost:3000/api/users/login', requestOptions)
      .then((res) => res.json())
      .catch((err) => err);

      if(res.errors){
        setError(res.errors);
      } else {
        setError('');
        // console.log(res.token);
        localStorage.setItem('accessToken', res.token);
        setAuthState({
          username: res.username,
          id: res.id,
          status: true
        });
        // redirecionar para a página de menus
      }

    } catch (error) {
      console.log(error);
    }


  }

  return (
    <div>
      {error && <p>{error}</p>}
      <h2>Fazer login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>E-mail:</span>
          <input required type="email" onChange={(e) => setEmail(e.target.value)} value={email}/>
        </label>
        <label>
          <span>Senha:</span>
          <input required type="password" onChange={(e) => setSenha(e.target.value)} value={senha}/>
        </label>
        <input type="submit" value='Login' />
      </form>
    </div>
  )
}
  
  export default Login;