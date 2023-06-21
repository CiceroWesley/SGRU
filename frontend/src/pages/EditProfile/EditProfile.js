import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

import { Grid, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Toast from '../../components/Toast/Toast';
import { api } from '../../utils/config';

const EditProfile = () => {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [senha, setSenha] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);


  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  useEffect(() => {
    const verifyUser = () => {
      if(!user){
        navigate('/login');
      }
    }
    verifyUser()
  }, [user, navigate]);

  // pegar dados usando a rota de usuário atual
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('accessToken');

      const requestOptions = {
        method : 'GET',
        headers : {}
      };
      requestOptions.headers.Authorization = `Bearer ${token}`;

      try {
        const res = await fetch(`${api}/users/profile`, requestOptions)
        .then((res) => res.json())
        .catch(err => err);

        if(res.errors){
          console.log(res.errors)
        } else {
          // console.log(res)
          setNome(res.nome);
          setEmail(res.email);
          setCargo(res.cargo);
          // setSenha(res.senha);
        }


      } catch (error) {
        console.log(error)
      }

    };
    getUser();
  }, [])
  // fazer função para editar os dados por formulário como na edição do meeting
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = {
      nome,
      email,
      cargo,
      senha
    };

    const token = localStorage.getItem('accessToken');

    const requestOptions = {
      method : 'PATCH',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify(user)
    };
    requestOptions.headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch(`${api}/users/edit`, requestOptions)
      .then((res) => res.json())
      .catch(err => err);

      if(res.errors){
        setError(res.errors)
          setTimeout(() => {
            setError('')
        }, 6000);
        setLoading(false);
      } else {
        // console.log(res[0])
        // console.log(typeof res)
        if(Number(res) === 1){
          const user = {
            id : JSON.parse(localStorage.getItem('user')).id,
            username : nome
          }
          localStorage.setItem('user', JSON.stringify(user));
          setSuccess('Dados editados com sucesso.')
          setTimeout(() => {
            setSuccess('')
          }, 6000)
        } else {
          setError('Erro ao editar usuário');
          setTimeout(() => {
            setError('')
          }, 6000)
        }
      }
      setLoading(false);

    } catch (error) {
      setError(error)
        setTimeout(() => {
          setError('')
      }, 6000)
    }
  };


  return (
    <Grid container>
      {error && <Toast type='error' message={error}/>}
      {success && <Toast type='success' message={success} />}
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <h2>Edite seus dados</h2>
      </Grid>
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <Box onSubmit={handleSubmit} component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }, }} autoComplete="off">
          <Grid item container direction='column' alignItems='center' justifyContent='center'>
            <TextField id="outlined-required" label="Nome" helperText="Insira o novo nome" required type="text" onChange={(e) => setNome(e.target.value)} value={nome || ''}/>

            <TextField id="outlined-required" label="Email" helperText="Insira o novo email" required type="email" onChange={(e) => setEmail(e.target.value)} value={email || ''}/>

            <TextField id="outlined-required" label="Cargo" helperText="Insira o novo cargo" required type="text" onChange={(e) => setCargo(e.target.value)} value={cargo || ''}/>

            <TextField id="outlined-required" label="Senha" helperText="Insira a nova senha" required type="password" onChange={(e) => setSenha(e.target.value)} value={senha  || ''}/>

            {!loading && <TextField type="submit" value='Editar' color="success"/>}
            {loading && <TextField type="submit" value='Aguarde' disabled color="success"/>}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}

export default EditProfile