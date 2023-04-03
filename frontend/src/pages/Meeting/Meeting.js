import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Meeting = () => {
    const {id} = useParams();

    const [meeting, setMeeting] = useState();
    const [pautas, setPautas] = useState([]);
    const [participante, setParticipante] = useState([]);


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
              const res = await fetch('http://localhost:3000/api/meeting/participantes', requestOptions)
              .then((res) => res.json())
              .catch(err => err);

              if(res.errors){
                console.log(res.errors)
              } else {
                // verificar reuniões que o usuário está participando
                // console.log(typeof res)
                let is = false;
                // Mudar para forEach
                res.map((participandoReuniao) => {
                  if(participandoReuniao.id === Number(id)){
                    is = true;
                  }
                });
                if(!is){
                  alert('Você não pertence a essa reunião');
                  navigate('/menu');
                }

              }
            } catch (error) {
              console.log(error)
            }
        }
      }
      verifyUser()
    }, [user, navigate, id])

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
  
    // verificar se usuário marcou presença ou não, se sim liberar a votação nas pautas
    // pegar usuario atual e id reunião (já tem) e verificar na tabela participantes

    useEffect(() => {
      // verificação da presença
      const verifyPresence = async () => {
        const token = localStorage.getItem('accessToken');
        let requestOptions = {
            method : 'GET',
            headers : {},
        };
        requestOptions.headers.Authorization = `Bearer ${token}`;
        try {
          const res = await fetch(`http://localhost:3000/api/meeting/participanteRU/${id}`, requestOptions)
          .then((res) => res.json())
          .catch(err => err);

          if(res.errors){
            console.log(res.errors);
          } else {
            setParticipante(res);

          }

        } catch (error) {
          console.log(error)
        }
        


      };
      verifyPresence();
    },[id]);

    const handleButton = async () => {
      const presence = {
        fk_id_reuniao : id,
      };
  
      const token = localStorage.getItem('accessToken');
      // post request
      const requestOptions = {
        method: 'PATCH',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(presence),
      };
      requestOptions.headers.Authorization = `Bearer ${token}`;
      try {
        const res = await fetch('http://localhost:3000/api/meeting/markpresence', requestOptions)
        .then((res) => res.json())
        .catch(err => err);

        if(res.errors){
          console.log(res.errors)
        } else {
          if(Number(res) === 1){
            setParticipante({...participante, presente: true})
          } else {
            console.log('Erro ao marcar presença/reunião não existente');
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
        {pautas && pautas.map((pauta) => (
          <p key={pauta.id}>Pauta: {pauta.titulo}</p>
        ))}
        {participante &&
          participante.presente ? (
            <p>Você já marcou sua presença</p> 
          )
          :
          (
            <div>
              <p>Você não marcou sua presença</p>
              <button onClick={handleButton}>Marcar presença</button>
            </div>
          )
        }
        
      </div>
    )
  }
  
  export default Meeting;