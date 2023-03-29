import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    // console.log(nome, sexo, email, cargo, senha);
    const pautaN = {
      fk_id_reuniao : Number(meeting),
      titulo : pauta,
    };

    const token = localStorage.getItem('accessToken');
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

  return (
    <div>
      <h2>Insira suas pautas</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Reuniões cadastradas:</span>

        <select defaultValue={meeting} onChange={(e) => setMeeting(e.target.value)}>
          <option value={meeting} disabled>Selecione uma reunião</option>
          {meetings && meetings.map((reuniao) => (
            <option key={reuniao.id} value={reuniao.id}>{reuniao.titulo}</option>
          ))}
        </select>
        </label>
        <label>
          <span>Inserir pauta:</span>
          <input type="text" value={pauta} onChange={(e) => setPauta(e.target.value)} />
        </label>
        <input type="submit" value='Inserir'/>
      </form>
    </div>
  )
}

export default InsertPauta