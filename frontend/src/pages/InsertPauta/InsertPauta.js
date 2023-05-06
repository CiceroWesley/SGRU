import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Grid, TextField, Select, MenuItem, InputLabel, FormControl, FormHelperText } from "@mui/material";
import Box from "@mui/material/Box";

const InsertPauta = () => {
  const [meetings, setMeetings] = useState([]);
  const [meeting, setMeeting] = useState('disabled');
  const [pauta, setPauta] = useState('');


  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
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
          setMeetings(res);
        }
      } catch (error) {
        console.log(error);
      }

    };
    getMeetings();

  }, [])

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(meeting)
    console.log(pauta)
    if(meeting === 'disabled'){
      console.log('selecione uma reunião');
      return;
    }
    // verificar se usuários já estão nessa reunião que se deseja cadastrar uma pauta
    const token = localStorage.getItem('accessToken');

    const requestOptions2 = {
      method : 'GET',
      headers: {}
    };
    requestOptions2.headers.Authorization = `Bearer ${token}`;

    try {
      const res2 = await fetch(`http://localhost:3000/api/meeting/participantesR/${Number(meeting)}`, requestOptions2)
      .then((res2) => res2.json())
      .catch(err => err);

      if(res2.errors){
        console.log(res2.errors);
        return;
      } else {
        if(res2.length > 0){
          console.log('Se a reunião já possuir pelo menos um participante não se pode mais inserir pautas. Por favor, excluir a reunião e criar outra.');
          return;
        }
      }
    } catch (error) {
      console.log(error)
    }

    // console.log('passou?')
    // console.log(nome, sexo, email, cargo, senha);
    const pautaN = {
      fk_id_reuniao : Number(meeting),
      titulo : pauta,
    };

    
    // post request
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(pautaN),
    };
    requestOptions.headers.Authorization = `Bearer ${token}`;
    try {
      const res = await fetch('http://localhost:3000/api/meeting/pauta', requestOptions)
      .then((res) => res.json())
      .catch((err) => err);

      if(res.errors){
        // setErrorR(res.errors);
        console.log(res.errors)
      } else {
        console.log(res)
        // setErrorR('');
        // navigate('/login');
      }

    } catch (error) {
      console.log(error);
    }

  }
  // Não é possivel adicionar mais pautas depois de pelo menos um usuário ser adicionado como participante
  // Ao inserir pauta verificar se ja existe um participante (id da reuniao) na reuniao se sim, não deixar inserir outra pauta e pedir para excluir a reunião e criar outra
  // caso nao tenha nenhum participante permitir a inclusão da outra pauta
  // não é possível excluir pauta
  // Inserir um campo resolução para o organizador do encontro e permitir ele adicionar separado da edição da reunião.
  return (
    <Grid container>      
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <h2>Inserir pautas</h2>
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
            <TextField id="outlined-required" label="Pauta" helperText="Insira o nome da pauta" required type="text" onChange={(e) => setPauta(e.target.value)} value={pauta}/>
            <TextField  type="submit" value='Inserir pauta' color="success"/>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}

export default InsertPauta