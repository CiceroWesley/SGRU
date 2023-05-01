import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"

const MeetingOrganizador = () => {
  const {id} = useParams();


  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');


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
              console.log(meet.errors)
              navigate('/notfound')

            } else {
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
          console.log('Erro ao finalizar reunião/reunião não existente');
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
    // console.log(typeof hora)
    // let novaHora = Number(`${hora[0]}${hora[1]}`)
    // // console.log(novaHora)
    // if(novaHora - 3 < 0){
    //   novaHora = 24 + (novaHora - 3)
    // }
    // console.log(novaHora)
    const dataHorario = `${data} ${hora}:00`;
    // console.log(dataHorario)
    // Verificação se a data e horário inseridos não passaram
    const date = new Date();
    if(date.getTime() > Date.parse(dataHorario)){
        console.log('esse horario e data ja passaram')
        // console.log(date.getTime())
        // console.log(Date.parse(dataHorario))
        // SETAR ERRO e RETONAR
        return;
    }

    const meeting = {
        titulo,
        descricao,
        data : Date.parse(dataHorario),
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
        console.log(res.errors)
      } else {
        console.log(res)
        if(Number(res) === 1){
          console.log('Edição realizada com sucesso');
        } else {
          console.log('Erro ao editar os dados');
        }
      }


    } catch (error) {
      console.log(error)
    }

  }


  const handleDoubleClick = async (pautaId) => {
    // console.log(pautaId)

    const novoTitulo = prompt('Insira o novo título:')
    
    if(novoTitulo === '' || novoTitulo === null){
      console.log('Vázio')
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
        console.log(res.errors)
      } else {
        if(Number(res) === 1){
          console.log('Pauta atualizada com sucesso');
          // console.log(pautas)

          let atualizado = pautas.map((paut) => {
            if(paut.id == pautaId){
              console.log(paut.titulo)
              paut.titulo = novoTitulo
              return paut
            }
            return paut
          })
          // const pautaAtualizadaId = pautas.findIndex((pauta) => pauta.id == pautaId);
          // let pautasUpdate = pautas;
          // pautasUpdate[pautaAtualizadaId].titulo = novoTitulo;
          // console.log(atualizado)
          setPautas(atualizado);
        }
      }


    } catch (error) {
      console.log(error)
    }
    
  }

  // console.log(pautas)
  return (
    <div>
      <h2>Edite os dados da reunião</h2>
      {/* bloquear a edição caso esteja finalizada */}
      
      {/* {meeting && <div>
          <h2>{meeting.titulo}</h2>
          <p>Descrição: {meeting.descricao}</p>
          <p>Local: {meeting.local}</p>
          <p>Data e horário: {meeting.data}</p>
        </div>} */}

        {meeting && !meeting.finalizado ? (
          <div>
            <form onSubmit={handleSubmit}>
              <label>
                <span>Título:</span>
                <input type="text" placeholder="Título" onChange={(e) => setTitulo(e.target.value)} value={titulo || ''} />
              </label>
              <label>
                <span>Descrição:</span>
                <textarea placeholder="Descrição" onChange={(e) => setDescricao(e.target.value)} value={descricao || ''}></textarea>
              </label>
              <label>
                <span>Local:</span>
                <input type="text" placeholder="Local" onChange={(e) => setLocal(e.target.value)} value={local} />
              </label>
              <label>
                <span>Data:</span>
                <input type="date" onChange={(e) => setData(e.target.value)} value={data}/>
              </label>
              <label>
                <span>Horário:</span>
                <input type="time" onChange={(e) => setHora(e.target.value)} value={hora}/>
              </label>
              <input type="submit" value='Editar'/>
            </form>
            {pautas && pautas.map((pauta) => (
            <div>
              <p onDoubleClick={() => handleDoubleClick(pauta.id)} key={pauta.id}>Pauta: {pauta.titulo}</p>
              {/* <input type="text" value={pauta.titulo} onDoubleClick={handleDoubleClick} /> */}
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