import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Toast from '../../components/Toast/Toast'
import { api } from "../../utils/config";
import { Grid, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText } from "@mui/material";
import Box from "@mui/material/Box";

const Register = () => {
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('M');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [senha, setSenha] = useState('');

  const [errorR, setErrorR] = useState('')

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    const verifyUser = () => {
      if(user){
        navigate('/menu');
      }
    }
    verifyUser()
  }, [user, navigate])

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(nome, sexo, email, cargo, senha);
    const user = {
      nome,
      sexo,
      email,
      cargo,
      senha
    };

    // post request
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(user)
    };

    try {
      const res = await fetch(`${api}/users/register`, requestOptions)
      .then((res) => res.json())
      .catch((err) => err);

      if(res.errors){
        // console.log('erros')
        setErrorR(res.errors);
        setTimeout(() => {
          setErrorR('')
        }, 6000)
      } else {
        // console.log('sem erros')
        setErrorR('');
        navigate('/login');
      }

    } catch (error) {
      console.log(error);
    }

  }

  return (
    <Grid container>
      {errorR && <Toast type='error' message={errorR}/>}
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <h2>Crie uma conta</h2>
      </Grid>
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <Box onSubmit={handleSubmit} component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }, }} autoComplete="off">
          <Grid item container direction='column' alignItems='center' justifyContent='center'>
            <TextField id="outlined-required" label="Nome" helperText="Insira o seu nome" required type="text" onChange={(e) => setNome(e.target.value)} value={nome}/>
            <FormControl sx={{ m: 1, minWidth: 150}}>
              <InputLabel id="sexoSelect">Sexo</InputLabel>
              <Select required defaultValue={sexo} labelId="sexoSelect" id="demo-simple-select-helper" value={sexo} label="Sexo" onChange={(e) => setSexo(e.target.value)} sx={{minWidth: 219 ,maxWidth: 219}}>
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Feminino</MenuItem>
              </Select>
              <FormHelperText>Selecione seu sexo</FormHelperText>
            </FormControl>
            <TextField id="outlined-required" label="Email" helperText="Insira o seu email" required type="email" onChange={(e) => setEmail(e.target.value)} value={email}/>

            <TextField id="outlined-required" label="Cargo" helperText="Insira o seu cargo" required type="text" onChange={(e) => setCargo(e.target.value)} value={cargo}/>

            <TextField id="outlined-required" label="Senha" helperText="Insira o sua senha" required type="password" onChange={(e) => setSenha(e.target.value)} value={senha}/>

            <TextField  type="submit" value='Criar conta' color="success"/>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}
  
  export default Register;