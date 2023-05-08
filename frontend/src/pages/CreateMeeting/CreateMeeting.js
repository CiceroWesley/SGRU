import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Grid, TextField } from "@mui/material";
import Box from "@mui/material/Box";

// context
import {AuthContext} from '../../context/AuthContext';


const CreateMeeting = () => {
    const {authState, setAuthState} = useContext(AuthContext);

    const date1 = new Date().toISOString().slice(0, 10);
    const horario1 = new Date().toLocaleTimeString().slice(0,5);
    // let dia = date1.getDate();
    // let mes = date1.getMonth()
    // let ano = date1.getFullYear();

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [hora, setHora] = useState(horario1);
    const [data, setData] = useState(date1);
    const [local, setLocal] = useState('');


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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataHorario = `${data} ${hora}:00`;


        // Verificação se a data e horário inseridos não passaram
        const date = new Date();
        if(date.getTime() > Date.parse(dataHorario)){
            console.log('esse horario e data ja passaram')
            // console.log(date.getTime())
            // console.log(Date.parse(dataHorario))
            // SETAR ERRO e RETONAR
            return;
        }
 
        const meeting = {
            titulo,
            descricao,
            data : dataHorario,
            local
        };

        // post request
        const token = localStorage.getItem('accessToken');
        let requestOptions = {
          method: 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify(meeting)
        };
        requestOptions.headers.Authorization = `Bearer ${token}`;
        
        try {
          const res = await fetch('http://localhost:3000/api/meeting/', requestOptions)
          .then((res) => res.json())
          .catch(err => err);

          if(res.errors){
            console.log(res.errors);
          } else{
            console.log(res);
            // Inserir o usuário organizador da reunião como participante da reunião.
            // Pensar outra solução ^
            try {
              requestOptions = {
                method: 'GET',
                headers: {},
              };
              requestOptions.headers.Authorization = `Bearer ${token}`;
              // getting user
              const res2 = await fetch('http://localhost:3000/api/users/profile', requestOptions)
              .then((res2 => res2.json()))
              .catch((err) => err);

              if(res2.errors){
                console.log(res2.errors)
              } else {
                const participante = {
                  fk_id_reuniao : res.id,
                  fk_id_usuario : res2.id
                };
                requestOptions = {
                  method: 'POST',
                  headers: {'Content-Type' : 'application/json'},
                  body: JSON.stringify(participante),
                };
                requestOptions.headers.Authorization = `Bearer ${token}`;
                // preciso utilizar o trycatch?
                // inserindo criador da reunião como participante
                // const res3 = await fetch('http://localhost:3000/api/meeting/participante', requestOptions)
                // .then((res3) => res3.json())
                // .catch((err) => err);

                // if(res3.erros){
                //   console.log(res3.erros);
                // } else {
                //   console.log(res3);
                // }
              }
            } catch (error) {
              console.log(error)
            }
          }
        } catch (error) {
          console.log(error);
        }
      
    }
  return (
    <Grid container>
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <h2>Crie uma reunião</h2>
      </Grid>
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <Box onSubmit={handleSubmit} component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }, }} autoComplete="off">
          <Grid item container direction='column' alignItems='center' justifyContent='center'>
            <TextField id="outlined-required" label="Título" helperText="Insira o título da reunião" required type="text" onChange={(e) => setTitulo(e.target.value)} value={titulo}/>
            
            <TextField id="outlined-multiline-static" label="Descrição" helperText="Insira a descrição da reunião" multiline rows={4} required onChange={(e) => setDescricao(e.target.value)} value={descricao}/>

            <TextField id="outlined-required" label="Local" helperText="Insira o local da reunião" required type="text" onChange={(e) => setLocal(e.target.value)} value={local}/>

            <TextField id="outlined-required" label="Data" helperText="Insira a data da reunião" required type="date" onChange={(e) => setData(e.target.value)} value={data}/>

            <TextField id="outlined-required" label='Horário' required helperText="Insira o horario da reunião" type="time" onChange={(e) => setHora(e.target.value)} value={hora}/>
            <TextField  type="submit" value='Criar reunião' color="success"/>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}

export default CreateMeeting;