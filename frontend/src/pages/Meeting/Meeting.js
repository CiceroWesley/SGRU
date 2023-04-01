import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Meeting = () => {
    const {id} = useParams();

    const [meeting, setMeeting] = useState([]);


    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    useEffect(() => {
      const verifyUser = () => {
        if(!user){
          navigate('/login');
        } else {
            // verificar se o usuario está na reunião
            // se não redirecionar para o menu
        }
      }
      verifyUser()
    }, [user, navigate])

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
                    console.log(res.errros);
                } else{
                    setMeeting(res);
                }
            } catch (error) {
                console.log(error)
            }
        };
        getMeeting();
    }, [id]);
    console.log(meeting)
    return (
      <div>
        <h2>{meeting.titulo}</h2>
        <p>Descrição: {meeting.descricao}</p>
        <p>Local: {meeting.local}</p>
        <p>Data e horário: {meeting.data}</p>
        <p></p>
      </div>
    )
  }
  
  export default Meeting;