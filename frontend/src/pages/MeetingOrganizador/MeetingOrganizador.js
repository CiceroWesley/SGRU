import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Grid, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Alert from '@mui/material/Alert';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SubjectIcon from '@mui/icons-material/Subject';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Toast from "../../components/Toast/Toast";

const MeetingOrganizador = () => {
  const {id} = useParams();


  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);

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
            const meet = await fetch(`http://localhost:3000/api/meeting/${id}`, requestOptions)
            .then((meet) => meet.json())
            .catch((err2) => err2);

            if(meet.errors){
              setError(meet.errors);
              setTimeout(() => {
                setError('')
              }, 6000);
              navigate('/notfound');
              
            } else {
              const res = await fetch('http://localhost:3000/api/meeting/fkIdOrganizador', requestOptions)
              .then((res) => res.json())
              .catch(err => err);

              if(res.errors){
                setError(res.errors);
                setTimeout(() => {
                  setError('')
                }, 6000)
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
                  setError('Você não está organizando essa reunião.')
                  setTimeout(() => {
                    setError('')
                  }, 6000);
                  navigate('/menu');
                }
              }
            }
          } catch (error) {
            setError(error);
            setTimeout(() => {
              setError('')
            }, 6000);
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
              console.log(res.errors);
            } else{
              setMeeting(res);
              // console.log(res.data.slice(11, 16))
              setTitulo(res.titulo);
              setDescricao(res.descricao);
              setLocal(res.local);
              setData(res.data.slice(0,10));
              setHora(res.data.slice(11, 16))
                
                

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
          setError('Erro ao finalizar reunião/reunião não existente')
          setTimeout(() => {
            setError('')
          }, 6000)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // update meeting
  // A edição está funcionando, porém, a hora não fica a que o usuário está definindo
  // A hora está sendo definida como a hora que o usuário setou + 3, não sei porque.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    // console.log(typeof hora)
    // let novaHora = Number(`${hora[0]}${hora[1]}`)
    // // console.log(novaHora)
    // if(novaHora - 3 < 0){
    //   novaHora = 24 + (novaHora - 3)
    // }
    // console.log(novaHora)
    const dataHorario = `${data} ${hora}:00`;
    // console.log(dataHorario)
    // Isso tem sentido? já que não é possivel editar por causa do horario
    // Verificação se a data e horário inseridos não passaram
    const date = new Date();
    if(date.getTime() > Date.parse(dataHorario)){
        setError('Esse horário e/ou data já passaram.')
        setTimeout(() => {
          setError('')
        }, 6000)
        return;
    }

    const meeting = {
        titulo,
        descricao,
        data : dataHorario,
        local
    };

    const token = localStorage.getItem('accessToken');

    const requestOptions = {
      method : 'PATCH',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify(meeting)
    };
    requestOptions.headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch(`http://localhost:3000/api/meeting/${id}`, requestOptions)
      .then((res) => res.json())
      .catch(err => err);

      if(res.errors){
        setError(res.errors)
        setTimeout(() => {
          setError('')
        }, 6000)
      } else {
        if(Number(res) === 1){
          setSuccess('Edição realizada com sucesso')
          setTimeout(() => {
            setSuccess('')
          }, 6000);
        } else {
          // console.log('Erro ao editar os dados');
          setError('Erro ao editar os dados.')
          setTimeout(() => {
            setError('')
          }, 6000);
        }
      }


    } catch (error) {
      setError(error)
      setTimeout(() => {
        setError('')
      }, 6000)
    }
    setLoading(false);

  }


  const handleDoubleClick = async (pautaId) => {
    // console.log(pautaId)

    const novoTitulo = prompt('Insira o novo título:')
    if(novoTitulo === '' || novoTitulo === null){
      setWarning('Você não inseriu um novo nome.')
      setTimeout(() => {
        setWarning('')
      }, 6000);
      return;
    }
    // console.log('teste')
    const title = {
      titulo : novoTitulo
    };

    const token = localStorage.getItem('accessToken');

    const requestOptions = {
      method : 'PATCH',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify(title)
    };
    requestOptions.headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch(`http://localhost:3000/api/meeting/pauta/${pautaId}`, requestOptions)
      .then((res) => res.json())
      .catch(err => err);

      if(res.errors){
        setError(res.errors)
        setTimeout(() => {
          setError('')
        }, 6000)
      } else {
        if(Number(res) === 1){
          setSuccess('Pauta atualizado com sucesso')
          setTimeout(() => {
            setSuccess('')
          }, 6000);
          // console.log(pautas)

          let atualizado = pautas.map((paut) => {
            if(paut.id === pautaId){
              // console.log(paut.titulo)
              paut.titulo = novoTitulo
              // console.log(paut.titulo)
              return paut
            }
            return paut
          })
          // const pautaAtualizadaId = pautas.findIndex((pauta) => pauta.id == pautaId);
          // let pautasUpdate = pautas;
          // pautasUpdate[pautaAtualizadaId].titulo = novoTitulo;
          // console.log(atualizado)
          setPautas(atualizado);
        } else {
          setError('Erro ao editar pauta.')
          setTimeout(() => {
            setError('')
          }, 6000)
        }
      }


    } catch (error) {
      console.log(error)
      setError(error)
      setTimeout(() => {
        setError('')
      }, 6000)
    }
    
  }

  // console.log(pautas)
  return (
    <Grid container>
      {error && <Toast type='error' message={error}/>}
      {success && <Toast type='success' message={success}/>}
      {warning && <Toast type='warning' message={warning}/>}
        {meeting && !meeting.finalizado ? (
          <Grid item container>
            <Grid item container direction='column' alignItems='center' justifyContent='center'>
              <h2>Edite os dados da reunião</h2>
            </Grid>
            <Grid item container direction='column' alignItems='center' justifyContent='center'>
              <Box onSubmit={handleSubmit} component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' }, }} autoComplete="off">
                <Grid item container direction='column' alignItems='center' justifyContent='center'>
                  <TextField id="outlined-required" label="Título" helperText="Insira o título da reunião" required type="text" onChange={(e) => setTitulo(e.target.value)} value={titulo || ''}/>
                  
                  <TextField id="outlined-multiline-static" label="Descrição" helperText="Insira a descrição da reunião" multiline rows={4} required onChange={(e) => setDescricao(e.target.value)} value={descricao || ''}/>

                  <TextField id="outlined-required" label="Local" helperText="Insira o local da reunião" required type="text" onChange={(e) => setLocal(e.target.value)} value={local  || ''}/>

                  <TextField id="outlined-required" label="Data" helperText="Insira a data da reunião" required type="date" onChange={(e) => setData(e.target.value)} value={data  || ''}/>

                  <TextField id="outlined-required" label='Horário' helperText="Insira o horario da reunião" required type="time" onChange={(e) => setHora(e.target.value)} value={hora  || ''}/>
                  {!loading && <TextField type="submit" value='Editar reunião' color="success"/>}
                  {loading && <TextField type="submit" value='Aguarde' disabled color="success"/>}
                </Grid>
              </Box>
            </Grid>
            <Grid item container direction='column' alignItems='center' justifyContent='center'>
              {/* <Box component="div" sx={{ p: 2, border: '1px dashed grey' }}> */}
                {pautas && pautas.length!==0 && <List
                  sx={{ width: '100%', maxWidth: 360, bgcolor: 'primary', border: '1px solid gray' }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                      Pautas
                    </ListSubheader>
                  }
                >
                  {pautas && pautas.map((pauta) => (
                    <ListItemButton key={pauta.id} onDoubleClick={() => handleDoubleClick(pauta.id)}>
                      <ListItemIcon>
                        <SubjectIcon />
                      </ListItemIcon>
                      <ListItemText primary={pauta.titulo}/>
                    </ListItemButton>
                  ))}
                </List>}
              {/* </Box> */}
            </Grid>
            <Grid item container marginTop="10px" direction='column' alignItems='center' justifyContent='space-between'>
              <Stack direction='column' spacing={2} marginBottom={2}>
                <Alert severity="info">Essa reunião não foi finalizada</Alert>
                <Button variant="contained" color="error" onClick={handleClick}>Finalizar reunião</Button>
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <Grid item container direction='column' alignItems='center' justifyContent='center' marginTop="20px">
            <Alert severity="info">Reuniões finalizadas não podem ser editadas.</Alert>
          </Grid>
        )
        }
    </Grid>
  )
}

export default MeetingOrganizador