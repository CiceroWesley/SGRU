import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";



const Menu = () => {
  const [meetings, setMeetings] = useState([]);
  const [meetingsOrg, setMeetingsOrg] = useState([]);
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

// get meeting by fk_id_reuniao
  useEffect(() => {
    const getMeetings = async() => {
      const token = localStorage.getItem('accessToken');
      const requestOptions = {
        method : 'GET',
        headers : {}
      };
      requestOptions.headers.Authorization = `Bearer ${token}`;

      // var reunioes = [];
      try {
        const res = await fetch('http://localhost:3000/api/meeting/participantes', requestOptions)
        .then((res) => res.json())
        .catch((err) => err);
        
        if(res.errors){
          console.log(res.errors);
        } else{
          // console.log(res)
          res.map(async (reuniao) => {
            // console.log(reunioes.includes(reuniao.fk_id_reuniao))

            // if(reunioes.includes(reuniao.fk_id_reuniao)){
            //   console.log('teste')
            // }
            // reunioes.push(reuniao.fk_id_reuniao)
            // console.log(reunioes)
            const res2 = await fetch(`http://localhost:3000/api/meeting/${reuniao.fk_id_reuniao}`, requestOptions)
            .then((res) => res.json())
            .catch((err) => err);

            if(res.errors){
              console.log(res.errors)
            } else {
              // console.log(res2)
              const reuniao = {
                id: res2.id,
                titulo: res2.titulo,
                data: res2.data,
                finalizado: res2.finalizado
              };
              setMeetings((prevMeetings) => [...prevMeetings, reuniao])
            }
          })
        }
      } catch (error) {
        console.log(error);
      }

    };
    getMeetings();
  },[]);

  // get meeting by fk_id_organizador
  useEffect(() => {
    const getMeetingByFkIdOrganizador = async () => {
      const token = localStorage.getItem('accessToken');
      const requestOptions = {
        method : 'GET',
        headers : {}
      };
      requestOptions.headers.Authorization = `Bearer ${token}`;

      try {
        const res = await fetch('http://localhost:3000/api/meeting/fkIdOrganizador', requestOptions)
        .then((res) => res.json())
        .catch(err => err);

        if(res.errors){
          console.log(res.errors)
        } else {
          setMeetingsOrg(res);
        }

      } catch (error) {
        console.log(error)
      }
    };
    getMeetingByFkIdOrganizador();
  },[])

  // console.log(meetings)
  return (
    <div>
      <h2>Menu</h2>
      <div>
        <span>Reuniões que você está participando:</span>
        <div>
          {/* O useEffect está rodando duas vezes, se desativar o Strict Mode resolve. Contudo, não existe outra solução?  */}
          {meetings && meetings.map((reuniao) => (
            <div>
              {reuniao.finalizado ? (
                <p key={reuniao.id}>{reuniao.titulo} (finalizada)</p>  
              ) : (
                <p key={reuniao.id}>{reuniao.titulo}</p>  
              )}
              <Link to={`/meeting/${reuniao.id}`}>Acessar reunião</Link>
            </div>
          ))}
        </div>
      </div>
      <div>
        <span>Reuniões que você está organizando:</span>
        <div>
          {meetingsOrg && meetingsOrg.map((reuniaoOrg) => (
            <div>
              {reuniaoOrg.finalizado ? (
                <div>
                  <p key={reuniaoOrg.id}>{reuniaoOrg.titulo} (finalizada)</p>
                  <Link to={`/meetingorg/${reuniaoOrg.id}`}>Acessar reunião</Link>
                </div>
              ) : (
                <div>
                  <p key={reuniaoOrg.id}>{reuniaoOrg.titulo}</p>
                  <Link to={`/meetingorg/${reuniaoOrg.id}`}>Acessar reunião</Link>
                </div>
              )}
              
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

  export default Menu;