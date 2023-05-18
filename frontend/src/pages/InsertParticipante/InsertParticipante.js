import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Grid, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText } from "@mui/material";
import Box from "@mui/material/Box";
import Toast from "../../components/Toast/Toast";

const InsertParticipante = () => {
  const [meetings, setMeetings] = useState([]);
  const [meeting, setMeeting] = useState('disabled');
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState('');
  // const [participantes, setParticipantes] = useState([]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  // inserir o organizador da reunião automaticamente como participante
  // se deixar inserindo no createmeeting, o participante com suas pautas não são inseridos no votação
  // verificar se o organizador/usuário atual tem um id na tabela participante, se sim não insere denovo e se não inserir o usuário como participante da reunião que foi selecionada
  useEffect(() => {
    const verifyUser = () => {
      if(!user){
        navigate('/login');
      }
    }
    verifyUser()
  }, [user, navigate])

  useEffect(() => {
    const getMeetings = async() => {

      // post request
      const token = localStorage.getItem('accessToken');
      const requestOptions = {
        method: 'GET',
        headers: {}
      };
      requestOptions.headers.Authorization = `Bearer ${token}`;
      try {
        const res = await fetch('http://localhost:3000/api/meeting/fkIdOrganizador', requestOptions)
        .then((res) => res.json())
        .catch(err => err);

        if(res.errors){
          console.log(res.errors);
        } else{
          // console.log(res);
          // setMeetings(res);
          setMeetings(
            res.filter((reuniao) => {
              return reuniao.finalizado !== true;
            })
          );
        }
      } catch (error) {
        console.log(error);
      }

    };
    getMeetings();

  }, []);

  useEffect(() => {
    const getUsuarios = async() => {

      // post request
      const token = localStorage.getItem('accessToken');
      const requestOptions = {
        method: 'GET',
        headers: {}
      };
      requestOptions.headers.Authorization = `Bearer ${token}`;
      // console.log(meeting)
      try {
        // o procedimento que está rota da api faz dava para ter sido feito aqui, bastava procurar os participantes pelo id da reunião e em seguida filtrar de todos os usuários (da rota que requisita os usuários gerais)
        const res = await fetch(`http://localhost:3000/api/meeting/getusersfilter/${meeting}`, requestOptions)
        .then((res) => res.json())
        .catch(err => err);

        if(res.errors){
          console.log(res.errors);
        } else{
          // console.log(res);
          setUsuarios(res);
        }
      } catch (error) {
        console.log(error);
      }

    };
    getUsuarios();

  }, [meeting]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Inserir participante e verificar se meeting e usuario estão nulos
    setLoading(true)

    if(meeting === 'disabled'){
      setWarning('Selecione uma reunião.')
      setTimeout(() => {
        setWarning('')
      }, 6000);
      setLoading(false);
      return;
    }


    const participante = {
      fk_id_reuniao : meeting,
      fk_id_usuario : usuario
    };

    const token = localStorage.getItem('accessToken');
    // post request
    let requestOptions = {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(participante),
    };
    requestOptions.headers.Authorization = `Bearer ${token}`;
    try {
      const res = await fetch('http://localhost:3000/api/meeting/participante', requestOptions)
      .then((res) => res.json())
      .catch((err) => err);

      if(res.errors){
        setError(res.errors)
        setTimeout(() => {
          setError('')
        }, 6000);
        setLoading(false)
        return;
      } else {
        // console.log(res);
        // fazer um map para a quantidade de pautas da reunião e para cada pauta inserir o participante que foi retornado acima
        // pelo id da reunião pegar todas as pautas
        // para cada pauta inserir o id participante
        requestOptions = {
          method: 'GET',
          headers: {},
        };
        requestOptions.headers.Authorization = `Bearer ${token}`;
        // pautas
        const res2 = await fetch(`http://localhost:3000/api/meeting/pautas/${meeting}`, requestOptions)
        .then((res2) => res2.json())
        .catch(err => err);

        if(res2.errors){
          console.log(res2.errors)
          // setError(res2.errors)
          // setTimeout(() => {
          //   setError('')
          // }, 6000)
        } else {
          // para cada pauta insere o participante nela.
          let sucesso = true;
          res2.forEach(async (pauta) => {
            // console.log(pauta)
            const votacao = {
              fk_id_participante : res.id,
              fk_id_pauta : pauta.id
            };

            requestOptions = {
              method: 'POST',
              headers: {'Content-Type' : 'application/json'},
              body: JSON.stringify(votacao),
            };
            requestOptions.headers.Authorization = `Bearer ${token}`;

            const res3 = await fetch('http://localhost:3000/api/meeting/votacao', requestOptions)
            .then((res3) => res3.json())
            .catch(err => err);

            if(res3.errors){
              setError(res3.errors)
              setTimeout(() => {
                setError('')
              }, 6000);
              sucesso = false;
            } else {
              console.log(res3);
            }
          });
          if(sucesso){
            setSuccess('Participante inserido sucesso.')
            setTimeout(() => {
              setSuccess('')
            }, 6000);
          }
        }
      }
      
    } catch (error) {
      setError(error)
      setTimeout(() => {
        setError('')
      }, 6000)
    }
    setLoading(false);
  }
  
  return (
    <Grid container>
      {/* Antes de inserir os participantes se certificar que todas as pautas foram cadastradas , getUsersByMeeting()*/}
      {error && <Toast type='error' message={error}/>}
      {success && <Toast type='success' message={success}/>}
      {warning && <Toast type='warning' message={warning}/>}
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <h2>Inserir participantes</h2>
      </Grid>
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <Box onSubmit={handleSubmit} component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }, }} autoComplete="off">
          <Grid item container direction='column' alignItems='center' justifyContent='center'>
            <FormControl sx={{ m: 1, minWidth: 150}}>
              <InputLabel id="reuniaoSelect">Reuniões cadastradas</InputLabel>
              <Select required defaultValue={meeting} labelId="reuniaoSelect" id="demo-simple-select-helper" value={meeting} label="Reuniões cadastradas" onChange={(e) => setMeeting(e.target.value)} sx={{minWidth: 219 ,maxWidth: 219}}>
              <MenuItem value={meeting} disabled><em>Selecione uma reunião</em></MenuItem>
              {meetings && meetings.map((reuniao) => (
                <MenuItem key={reuniao.id} value={reuniao.id}>{reuniao.titulo}</MenuItem>
              ))}
              </Select>
              <FormHelperText>Selecione uma reunião</FormHelperText>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 150}}>
              <InputLabel id="usuarioSelect">Usuários cadastrados</InputLabel>
              <Select required defaultValue={usuario} labelId="usuarioSelect" id="demo-simple-select-helper" value={usuario} label="Usuários cadastrados" onChange={(e) => setUsuario(e.target.value)} sx={{minWidth: 219 ,maxWidth: 219}}>
              <MenuItem value={usuario} disabled><em>Selecione um usuário</em></MenuItem>
              {usuarios && usuarios.map((usuario) => (
                <MenuItem key={usuario.id} value={usuario.id}>{usuario.nome}</MenuItem>
              ))}
              </Select>
              <FormHelperText>Selecione um usuário</FormHelperText>
            </FormControl>
            {!loading && <TextField type="submit" value='Inserir participante' color="success"/>}
            {loading && <TextField type="submit" value='Aguarde' disabled color="success"/>}
          </Grid>
        </Box>
      </Grid>


    </Grid>
  )
}

export default InsertParticipante