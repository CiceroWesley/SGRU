import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Grid } from "@mui/material";

// context
import {AuthContext} from '../../context/AuthContext';


const CreateMeeting = () => {
    const {authState, setAuthState} = useContext(AuthContext);

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [hora, setHora] = useState('');
    const [data, setData] = useState('');
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
        <form onSubmit={handleSubmit}>
          {/* remover componente abaixo colocar form com box e textfield */}
          <Grid item container direction='column' alignItems='center' justifyContent='center'>
            <label>
                <span>Título:</span>
                <input required type="text" onChange={(e) => setTitulo(e.target.value)} value={titulo}/>
            </label>
            <label>
                <span>Descrição:</span>
                <textarea required cols="30" rows="10" onChange={(e) => setDescricao(e.target.value)} value={descricao}></textarea>
            </label>
            <label>
                <span>Local:</span>
                <input required type="text" onChange={(e) => setLocal(e.target.value)} value={local}/>
            </label>
            <label>
              <span>Data:</span>
              <input required type="date" onChange={(e) => setData(e.target.value)} value={data}/>
            </label>
            <label>
              <span>Horário:</span>
              <input required type="time" onChange={(e) => setHora(e.target.value)} value={hora}/>
            </label>
            <input type="submit" value='Criar reunião'/>
          </Grid>
        </form>
      </Grid>
    </Grid>
  )
}

export default CreateMeeting;