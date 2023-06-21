import { useState, useEffect } from "react";
// import {AuthContext} from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";

import Toast from '../../components/Toast/Toast'
import { api } from "../../utils/config";


import { Grid, TextField } from "@mui/material";
import Box from "@mui/material/Box";

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Context
  // const {AuthState, setAuthState} = useContext(AuthContext);



  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    const verifyUser = () => {
      if(user){
        navigate('/menu');
      }
    }
    verifyUser()
  }, [user, navigate])

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
      const res = await fetch(`${api}/users/login`, requestOptions)
      .then((res) => res.json())
      .catch((err) => err);

      if(res.errors){
        setError(res.errors);
        setTimeout(() => {
          setError('')
        }, 6000)
      } else {
        setError('');
        // console.log(res);
        const user = {
          id: res.id,
          username: res.username
        }
        localStorage.setItem('accessToken', res.token);
        localStorage.setItem('user', JSON.stringify(user));
        
        navigate('/menu');
      }

    } catch (error) {
      console.log(error);
    }


  }

  return (
    <Grid container>
      {error && <Toast type='error' message={error}/>}
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <h2>Fazer login</h2>
      </Grid>
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <Box onSubmit={handleSubmit} component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }, }} autoComplete="off">
          <Grid item container direction='column' alignItems='center' justifyContent='center'>
            <TextField id="outlined-required" label="Email" helperText="Insira o novo email" required type="email" onChange={(e) => setEmail(e.target.value)} value={email}/>

            <TextField id="outlined-required" label="Senha" helperText="Insira a nova senha" required type="password" onChange={(e) => setSenha(e.target.value)} value={senha}/>

            <TextField type="submit" value='Entrar' color="success"/>
          </Grid>
        </Box>
      </Grid>


    </Grid>
  )
}
  
  export default Login;