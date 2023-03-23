import { useState, useContext } from "react";

// context
import {AuthContext} from '../../context/AuthContext';


const CreateMeeting = () => {
    const {authState, setAuthState} = useContext(AuthContext);

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [hora, setHora] = useState('');
    const [data, setData] = useState('');
    const [local, setLocal] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataHorario = `${data} ${hora}:00`;


        // Verificação se a data e horário inseridos não passaram
        const date = new Date();
        if(date.getTime() > Date.parse(dataHorario)){
            console.log('ess horario e data ja passaram')
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
        const requestOptions = {
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
          }
        } catch (error) {
          console.log(error);
        }
      
    }
  return (
    <div>
      <h2>Crie uma reunião</h2>
      <form onSubmit={handleSubmit}>
        <label >
            <span>Título:</span>
            <input required type="text" onChange={(e) => setTitulo(e.target.value)} value={titulo}/>
        </label>
        <label >
            <span>Descrição:</span>
            <textarea required cols="30" rows="10" onChange={(e) => setDescricao(e.target.value)} value={descricao}></textarea>
        </label>
        <label >
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
      </form>
    </div>
  )
}

export default CreateMeeting;