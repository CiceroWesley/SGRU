import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jsPDF } from 'jspdf'

import { Grid, Box, Button, ButtonGroup, Alert, Typography, Divider} from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import ReportIcon from '@mui/icons-material/Report';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toast from "../../components/Toast/Toast";

const Meeting = () => {
    const {id} = useParams();

    const [meeting, setMeeting] = useState();
    const [pautas, setPautas] = useState([]);
    const [participante, setParticipante] = useState([]);
    const [participantes, setParticipantes] = useState([]);
    const [votacao, setVotacao] = useState([]);

    // const [pauta, setPauta] = useState();

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // const [loading, setLoading] = useState(false);






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
                const res = await fetch('http://localhost:3000/api/meeting/participantes', requestOptions)
                .then((res) => res.json())
                .catch(err => err);

                if(res.errors){
                  setError(res.errors);
                  setTimeout(() => {
                    setError('')
                  }, 6000);
                } else {
                  // verificar reuniões que o usuário está participando
                  // console.log(typeof res)
                  let is = false;
                  // Mudar para forEach
                  res.map((participandoReuniao) => {
                    if(participandoReuniao.fk_id_reuniao === Number(id)){
                      is = true;
                    }
                  });
                  // console.log(res)
                  if(!is){
                    setError('Você não pertence a essa reunião.')
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
                    console.log(res.errors);
                    // navigate('/notfound')
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
          // usuário atual
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

    // get participantes da reunião
    useEffect(() => {
      const getParticipantes = async () => {
        const token = localStorage.getItem('accessToken');
        const requestOptions = {
          method : 'GET',
          headers : {},
        };
        requestOptions.headers.Authorization = `Bearer ${token}`;
        try {
          const res = await fetch(`http://localhost:3000/api/meeting/participantesR/${id}`, requestOptions)
          .then((res) => res.json())
          .catch(err => err);

          if(res.errors){
            console.log(res.errors); 
          } else {
            // console.log(res);
            res.forEach(async (participante) => {
              // console.log(participante)
              const res2 = await fetch(`http://localhost:3000/api/users/usuario/${participante.fk_id_usuario}`, requestOptions)
              .then((res2) => res2.json())
              .catch(err => err);

              if(res2.errors){
                console.log(res2.errors);
              } else {
                // console.log(res2)
                const usuario = {
                  id : res2.id,
                  nome : res2.nome,
                  presente : participante.presente
                }
                setParticipantes((prevParticipantes) => [...prevParticipantes, usuario]);
              }
              
            });
          }

        } catch (error) {
          console.log(error)
        }

      };
      getParticipantes();
    }, [id])


    // marcar presenca
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
          setError(res.errors)
          setTimeout(() => {
            setError('')
          }, 6000);
        } else {
          if(Number(res) === 1){
            setParticipante({...participante, presente: true})
            // estou pegando o id do usuário do localStorage
            // para previnir alteração por parte do usuário é melhor buscar da api
            const user = JSON.parse(localStorage.getItem('user'));
            setParticipantes(
              participantes.map((participante) => {
                if(participante.id === user.id){
                  participante.presente = true;
                  return participante
                }
                return participante
              })
            )
          } else {
            setError('Erro ao marcar presença/reunião não existente.')
            setTimeout(() => {
              setError('')
            }, 6000);
          } 
        }
      } catch (error) {
        setError(error)
          setTimeout(() => {
            setError('')
          }, 6000);
      }
    }

    // votação
    const handleButtonVote = async (pautaId, vote) => {
      // console.log(pautaId);
      // console.log(vote)

      const votePauta = {
        fk_id_participante : participante.id,
        fk_id_pauta : pautaId,
        voto : vote
      };

      const token = localStorage.getItem('accessToken');
      const requestOptions = {
        method : 'PATCH',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(votePauta)
      };
      requestOptions.headers.Authorization = `Bearer ${token}`;

      try {
        const res = await fetch('http://localhost:3000/api/meeting/vote', requestOptions)
        .then((res) => res.json())
        .catch(err => err);

        if(res.errors){
          setError(res.errors)
          setTimeout(() => {
            setError('')
          }, 6000);
        } else {
          if(Number(res) === 1){
            if(vote === 1){
              setSuccess('Você votou a favor na pauta');
              setTimeout(() => {
                setSuccess('')
              }, 6000);
            } else {
              setSuccess('Você votou contra na pauta');
              setTimeout(() => {
                setSuccess('')
              }, 6000);
            }
          } else {
            setError('Erro ao votar');
            setTimeout(() => {
              setError('')
            }, 6000);
          }
          
        }
      } catch (error) {
        setError(error)
        setTimeout(() => {
          setError('')
        }, 6000);
      }
    }  

    useEffect(() => {
      const getVotes = async () => {
        const token = localStorage.getItem('accessToken');

        const requestOptions = {
          method : 'GET',
          headers : {}
        };
        requestOptions.headers.Authorization = `Bearer ${token}`;
        try {
          pautas.forEach(async (pauta) => {
            const res = await fetch(`http://localhost:3000/api/meeting/votes/${pauta.id}`, requestOptions)
            .then((res) => res.json())
            .catch(err => err);

            if(res.errors){
              console.log(res.errors);
            } else {
              // aparentemente está funcionando, verificar direito e mostrar o estado com o map
              const pautaVoto = {
                id : pauta.id,
                titulo : pauta.titulo,
                abs : res.votacaoAbs,
                afa : res.votacaoAfa,
                con : res.votacaoCon
              }
                // console.log(pautaVoto)
                setVotacao((prevVotacao) => [...prevVotacao, pautaVoto]);
              
              // console.log(res)
              
            }
          })
        } catch (error) {
          console.log(error)
        }


      };
      if(meeting && meeting.finalizado){
        getVotes();
      }
    }, [pautas, meeting]);

    // Como saber o momento de adicionar uma nova página? Já que não há uma função/método que fassa isso
    // const generatePdf = async () => {
    //   // 180 e 280
    //   // console.log('aqui')
    //   const doc = jsPDF();
    //   let nameFile;
    //   let valor = 10;
    //   let data = [];
    //   if(meeting && votacao && participantes){
    //     // doc.text([meeting.titulo, meeting.data, meeting.local, meeting.descricao, votacao], 10, valor, {maxWidth : 180, align : 'justify'} );
    //     nameFile = `${meeting.titulo}-${meeting.data}`;
    //     data = [meeting.titulo, meeting.data, meeting.local, meeting.descricao, 'Votação nas pautas:'];
    //     valor += 30 + (meeting.descricao.length/180 * 3.5)
    //     votacao.forEach((pauta) => {
    //       data = [...data,`${pauta.titulo} - a favor: ${pauta.afa}, contra: ${pauta.con}, abstinência: ${pauta.abs}`]
    //       valor +=10
    //     })
    //     data = [...data, 'Participantes:']
    //     participantes.forEach((participante) => {
    //       if(participante.presente){
    //         data = [...data,`${participante.nome}- (presente)` ];
    //       } else {
    //         data = [...data,`${participante.nome}- (faltou)` ];
    //       }
    //       valor +=10
          
    //     })
    //   }
    //   doc.text(data, 10, 10, {maxWidth : 180})
    //   // console.log(doc.internal.pageSize.getWidth())
    //   // console.log(doc.internal.pageSize.getHeight())
      
    //   doc.save(nameFile + ".pdf")
    // };


    // Como saber o valor atual da altura para verificar se a página é quebrada ou não?
    // const generatePdf2 = async () => {
    //   // 180 e 280
    //   console.log('aqui')
    //   const doc = jsPDF();
    //   console.log(doc.internal.pageSize.height)
    //   console.log(doc.internal.pageSize.width)
    //   let nameFile;
    //   let valor = 10;
    //   if(meeting){
    //     doc.text([meeting.titulo, meeting.data, meeting.local, meeting.descricao], 10, valor, {maxWidth : 180, align : 'justify'} );
    //     nameFile = `${meeting.titulo}-${meeting.data}`;
    //     // console.log(doc.internal.pageSize.getHeight)
    //   }
    // };

    // atentar-se a ordem, criar reunião, inserir pautas e por fim inserir participantes

    // verificar se a reunião foi finalizada se sim, mostrar o resumo da reunião
    // com descrição, titulo, local e horario
    // as pautas com o resultado da voltação
    // os participantes e a presença
    // partes dos dados que já estão podem se reaproveitados
    // console.log(votacao)


    // Não é possivel adicionar mais pautas depois de pelo menos um usuário ser adicionado como participante
    // Ao inserir pauta verificar se ja existe um participante (id da reuniao) na reuniao se sim, não deixar inserir outra pauta e pedir para excluir a reunião e criar outra
    // console.log(meeting.descricao.length)
    return (
      <div>
        {error && <Toast type='error' message={error}/>}
        {success && <Toast type='info' message={success}/>}
        <Grid container direction="column" alignItems='center' justifyContent='center'>
          <Grid item container>
            {meeting && 
            <Grid item container direction="column" alignItems='center' justifyContent='center' margin="5px">
              <Box component="span" sx={{ p: 2, border: '1px solid grey', width: '100%', maxWidth: 500}}>
                <Grid item container spacing={1}>
                  <Grid item container direction="column" alignItems='center' justifyContent='center'>
                    <h2>{meeting.titulo}</h2>
                  </Grid>
                  <Grid item container direction='column' alignItems='center' justifyContent='center'>
                    <DescriptionIcon/>
                    {meeting.descricao}
                  </Grid>
                  <Grid item container direction='column' alignItems='center' justifyContent='center'>
                    <LocationOnIcon/>
                    {meeting.local}
                  </Grid>
                  <Grid item container direction='column' alignItems='center' justifyContent='center'>
                    <AccessTimeIcon/>
                    {meeting.data}
                  </Grid>
                </Grid>
              </Box>
            </Grid>}
            
            {meeting && !meeting.finalizado ? (
              <Grid item container direction='column' alignItems='center' justifyContent='center'>
                {pautas && pautas.length != 0 && <Grid item contaier>
                  <h3>Pautas</h3>
                </Grid>}
                
                <Grid item container direction='column' alignItems='center' justifyContent='center'>
                  {participante && participante.presente ? (
                    pautas && pautas.map((pauta) => (
                      <Box key={pauta.id} component="span" margin="2px" sx={{ p: 2, border: '1px solid grey', width: '100%', maxWidth: 300}}>
                        <Grid item container direction='column' alignItems='center' justifyContent='center' sx={{maxWidth: 500}}>
                          <Grid item container direction='column' alignItems='center' justifyContent='center' key={pauta.id}><strong>{pauta.titulo}</strong></Grid>
                          <Grid item container directon='row' alignItems='center' justifyContent='center'>
                            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                              <Button size="small" color="success" onClick={() => handleButtonVote(pauta.id, 1)}>A favor</Button>
                              <Button size="small" color="error" onClick={() => handleButtonVote(pauta.id, 0)}>Contra</Button>
                            </ButtonGroup>
                          </Grid>
                        </Grid>
                      </Box>
                    ))
                  )
                  :
                  (
                    <>
                    {pautas && pautas.length > 0 ? (
                      <Grid item container direction='column' alignItems='center' justifyContent='center'>
                        <Alert severity="info">Marque a presença para visualizar as pautas.</Alert>
                      </Grid>
                    ) : (
                      <Grid item container direction='column' alignItems='center' justifyContent='center'>
                        <Alert severity="info">Marque a sua presença</Alert>
                      </Grid>
                    )}
                    </>
                  )}
                </Grid>
              </Grid>
            ) : (
              // caso a reunião já esteja finalizada, exibir a quantidade de votos em cada pauta
              <Grid item container direction='column' alignItems='center' justifyContent='center'>
                {votacao && votacao.length > 0 ? (
                  <Alert severity="info">Essa reunião foi finalizada, veja a votação das pautas</Alert>
                ) : (
                  <Alert severity="info">Essa reunião foi finalizada</Alert>
                )}
                {votacao && votacao.length > 0 && <TableContainer component={Paper} sx={{ minWidth: 150, maxWidth: 370, marginTop: 2 }}>
                  <Table sx={{ minWidth: 170}} size='small' aria-label="simple table">
                    <TableHead >
                      <TableRow >
                        <TableCell><strong>Pautas</strong></TableCell>
                        <TableCell align="right"><strong>A favor</strong></TableCell>
                        <TableCell align="right"><strong>Contra</strong></TableCell>
                        <TableCell align="right"><strong>Abstenção</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {votacao && votacao.map((pauta) => (
                      <TableRow
                        key={pauta.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          <strong>{pauta.titulo}</strong>
                        </TableCell>
                        <TableCell align="center">{pauta.afa}</TableCell>
                        <TableCell align="center">{pauta.con}</TableCell>
                        <TableCell align="center">{pauta.abs}</TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                </TableContainer>}
                {/* <button onClick={generatePdf}>Exporta em pdf o resumo da reunião</button> */}
              </Grid>
            
            )}
            
            <Grid item container direction='column' alignItems='center' justifyContent='center'>
              {participante &&
                participante.presente ? (
                  <Grid item container direction='column' alignItems='center' justifyContent='center' marginTop={2}>
                    <Alert margin severity='info'>Você já marcou sua presença</Alert>
                  </Grid>
                )
                :
                (
                  <Grid item container direction='column' alignItems='center' justifyContent='center' marginTop={2}>
                    <Alert severity="info">Você não marcou sua presença</Alert>
                    {meeting && !meeting.finalizado && 
                    <Button sx={{marginTop:2}} variant="contained" size="small" color="info" onClick={handleButton}>Marcar presença</Button>}
                  </Grid>
                )
              }
            </Grid>
          </Grid>
          <Grid item container direction='column' alignItems='center' justifyContent='center' marginTop={2}>
            <Box component="span" margin="2px" sx={{ p: 2, border: '1px solid grey', width: '100%', maxWidth: 200}}>
              <Grid item container direction='column' alignItems='center' justifyContent='center'>
                <Typography variant="subtitle2" gutterBottom>
                  Participantes da reunião:
                </Typography>
              </Grid>
              {participantes && participantes.map((participante) => (
                <Grid item container direction='column' alignItems='center' justifyContent='center' border='1px solid gray'>
                  {participante.presente ? (
                      <Typography variant="body2" gutterBottom key={participante.id}>
                        {participante.nome}
                        <CheckIcon fontSize="small" color="success"/>
                      </Typography>
                  ) : (
                    <Typography variant="body2" gutterBottom key={participante.id}>
                      {participante.nome}
                      <ReportIcon fontSize="small" color='warning' />
                    </Typography>
                  )}
                </Grid>
              ))}
            </Box>
          </Grid>
        </Grid>
      </div>
    )
  }
  
  export default Meeting;