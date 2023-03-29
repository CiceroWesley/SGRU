import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



const Menu = () => {
  const [meetings, setMeetings] = useState([]);
  // DEPOIS ver se da pra fazer assim
  // https://github.com/CiceroWesley/curso-react-zero-maestria/blob/main/Curso%20react/12_reactgram/frontend/src/hooks/useAuth.js
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

      const token = localStorage.getItem('accessToken');
      const requestOptions = {
        method : 'GET',
        headers : {}
      };
      requestOptions.headers.Authorization = `Bearer ${token}`;

      try {
        const res = await fetch('http://localhost:3000/api/meeting/participantes', requestOptions)
        .then((res) => res.json())
        .catch((err) => err);

        if(res.errors){
          console.log(res.errors);
        } else{
          setMeetings(res);
          // AQUI É APENAS O ID DA REUNIÃO, TENHO QUE PROCURAR ESSAS REUNIÕES NA TABELA REUNÔES PARA
          // PODER MOSTRAR O NOME
        }
      } catch (error) {
        console.log(error);
      }

    };
    getMeetings();
  },[])


  return (
    <div>
      <h2>Menu</h2>
      <div>
        <span>Reuniões que você está participando:</span>
        <div>
          {meetings && meetings.map((reuniao) => (
            <p key={reuniao.id}>{reuniao.fk_id_reuniao}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

  export default Menu;