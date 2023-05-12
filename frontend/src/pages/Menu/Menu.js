import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { Grid, Divider, CircularProgress } from "@mui/material";
import BasicCard from "../../components/BasicCard/BasicCard";



const Menu = () => {
  const [meetings, setMeetings] = useState([]);
  const [meetingsOrg, setMeetingsOrg] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

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
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const requestOptions = {
        method : 'GET',
        headers : {}
      };
      requestOptions.headers.Authorization = `Bearer ${token}`;

      // var reunioes = [];
      // requisitar reuniões que o usuário está participando
      try {
        const res = await fetch('http://localhost:3000/api/meeting/participantes', requestOptions)
        .then((res) => res.json())
        .catch((err) => err);
        
        if(res.errors){
          console.log(res.errors);
        } else{
          // console.log(res)
          // para cada reunião que o usuário estiver como participante, requisitar informações dela.
          res.map(async (reuniao) => {
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
      setLoading(false);
    };
    getMeetings();
  },[]);

  // get meeting by fk_id_organizador
  useEffect(() => {
    const getMeetingByFkIdOrganizador = async () => {
      setLoading2(true);
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
      setLoading2(false);
    };
    getMeetingByFkIdOrganizador();
  },[]);

  const handleClickDelete = async (reuniaoId) => {

    const token = localStorage.getItem('accessToken');

    const requestOptions = {
      method : 'DELETE',
      headers : {}
    };
    requestOptions.headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch(`http://localhost:3000/api/meeting/${reuniaoId}`, requestOptions)
      .then((res) => res.json())
      .catch(err => err);

      if(res.errors){
        console.log(res.errors);
      } else {
        if(Number(res) === 1){
          setMeetingsOrg(
            meetingsOrg.filter((meet) => {
              return meet.id !== reuniaoId
            })
          );

          setMeetings(
            meetings.filter((meet) => {
              return meet.id !== reuniaoId
            })
          );
          console.log('Reunião excluida com sucesso');
        }
      }

    } catch (error) {
      console.log(error)
    }


  };


  // console.log(meetings)
  return (
    <div>
      <Grid container direction='column' alignItems='center'>
        <Grid item>
          <h2>Menu</h2>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item container direction='column' alignItems='center' justifyContent='flex-start' xs={5}>
          <span>Reuniões que você está participando:</span>
          <div>
            {/* O useEffect está rodando duas vezes, se desativar o Strict Mode resolve. Contudo, não existe outra solução?  */}
            {loading && <CircularProgress/>}
            {!loading && meetings && meetings.map((reuniao) => (
              <div style={{marginBottom : '10px'}}>
                {/* colocar props e exportar funcao de exclusao */}
                {reuniao.finalizado ? (
                  <BasicCard titulo={reuniao.titulo} finalizado={true} acessar={`/meeting/${reuniao.id}`}/>
                  // <p key={reuniao.id}>{reuniao.titulo} (finalizada)</p>
                ) : (
                  <BasicCard titulo={reuniao.titulo} finalizado={false} acessar={`/meeting/${reuniao.id}`}/>
                  // <p key={reuniao.id}>{reuniao.titulo}</p>
                )}
                {/* <Link to={`/meeting/${reuniao.id}`}>Acessar reunião</Link> */}
              </div>
            ))}
          </div>
        </Grid>
        <Grid item xs={1}>
          <Divider orientation='vertical'/>
        </Grid>
        <Grid item container direction='column' alignItems='center' justifyContent='flex-start' xs={5}>
          <span>Reuniões que você está organizando:</span>
          <div>
            {loading2 && <CircularProgress/>}
            {!loading2 && meetingsOrg && meetingsOrg.map((reuniaoOrg) => (
              <div style={{marginBottom : '10px'}}>
                {reuniaoOrg.finalizado ? (
                  <div>
                    <BasicCard titulo={reuniaoOrg.titulo} finalizado={true} acessar={`/meetingorg/${reuniaoOrg.id}`}/>
                  </div>
                ) : (
                  <div>
                    <BasicCard titulo={reuniaoOrg.titulo} finalizado={false} acessar={`/meetingorg/${reuniaoOrg.id}`} deleteFunction={handleClickDelete} reuniaoId={reuniaoOrg.id}/>
                  </div>
                )}
        
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

  export default Menu;