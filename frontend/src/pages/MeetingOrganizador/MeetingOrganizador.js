import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"

const MeetingOrganizador = () => {
  const {id} = useParams();

  const [meeting, setMeeting] = useState();
  const [pautas, setPautas] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      if(!user){
        navigate('/login');
      } else {
          // verificar se o usuario está na reunião
          // se não redirecionar para o menu
          const token = localStorage.getItem('accessToken');
          const requestOptions = {
            method : 'GET',
            headers: {},
          };
          requestOptions.headers.Authorization = `Bearer ${token}`;
          // meetings by current user
          try {
            const res = await fetch('http://localhost:3000/api/meeting/fkIdOrganizador', requestOptions)
            .then((res) => res.json())
            .catch(err => err);

            if(res.errors){
              console.log(res.errors)
            } else {
              // verificar reuniões que o usuário está organizando
              // console.log(typeof res)
              let is = false;
              
              res.forEach((participandoReuniao) => {
                if(participandoReuniao.id === Number(id)){
                  is = true;
                }
              });
              // console.log(res)
              if(!is){
                alert('Você não está organizando essa reunião');
                navigate('/menu');
              }

            }
          } catch (error) {
            console.log(error)
          }
      }
    }
    verifyUser();
  },[id, navigate, user]);

  // load meeting
  useEffect(() => {
    const getMeeting = async () => {
        const token = localStorage.getItem('accessToken');
        let requestOptions = {
            method : 'GET',
            headers : {},
        };
        requestOptions.headers.Authorization = `Bearer ${token}`;

        // getting meeting
        try {
            const res = await fetch(`http://localhost:3000/api/meeting/${id}`, requestOptions)
            .then((res) => res.json())
            .catch((err) => err);

            if(res.errors){
                console.log(res.erros);
            } else{
                setMeeting(res);

                // getting pautas
                const res2 = await fetch(`http://localhost:3000/api/meeting/pautas/${res.id}`, requestOptions)
                .then((res2) => res2.json())
                .catch((err) => err);

                if(res2.errors){
                  console.log(res2.errors);
                } else {
                  // console.log(res2)
                  setPautas(res2);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    getMeeting();
}, [id]);


  const handleClick = async () => {
    const meetingF = {
      id
    };
    const token = localStorage.getItem('accessToken');

    const requestOptions = {
      method : 'PATCH',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify(meetingF)
    };
    requestOptions.headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch('http://localhost:3000/api/meeting/finalize', requestOptions)
      .then((res) => res.json())
      .catch(err => err);

      if(res.errors){
        console.log(res.errors)
      } else {
        // console.log(res)
        if(Number(res) === 1){
          setMeeting({...meeting, finalizado : true})
        } else {
          console.log('Erro ao finalizar reunião/reunião não existente');
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      {meeting && <div>
          <h2>{meeting.titulo}</h2>
          <p>Descrição: {meeting.descricao}</p>
          <p>Local: {meeting.local}</p>
          <p>Data e horário: {meeting.data}</p>
        </div>}

        {meeting && !meeting.finalizado ? (
          <div>
            {pautas && pautas.map((pauta) => (
            <div>
              <p key={pauta.id}>Pauta: {pauta.titulo}</p>
            </div>
            ))}
            <div>
              <span>Essa reunião não foi finalizada</span>
              <button onClick={handleClick}>Finalizar reunião</button>
            </div>
          </div>
        ) : (
          <div>
            <span>Reuniões finalizadas não podem ser editadas.</span>
          </div>
        )
        }
    </div>
  )
}

export default MeetingOrganizador