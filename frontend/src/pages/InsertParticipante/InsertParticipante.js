import { useEffect, useState } from "react";


const InsertParticipante = () => {
  const [meetings, setMeetings] = useState([]);
  const [meeting, setMeeting] = useState('disabled');
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState('');

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

  }, []);

  useEffect(() => {
    const getUsuarios = async() => {

      // post request
      const token = localStorage.getItem('accessToken');
      const requestOptions = {
        method: 'GET',
        headers: {}
      };
      requestOptions.headers.Authorization = `Bearer ${token}`;
      try {
        const res = await fetch('http://localhost:3000/api/users/usuarios', requestOptions)
        .then((res) => res.json())
        .catch(err => err);

        if(res.errors){
          console.log(res.errors);
        } else{
          // console.log(res);
          setUsuarios(res);
        }
      } catch (error) {
        console.log(error);
      }

    };
    getUsuarios();

  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(meeting)
    console.log(usuario)
    // Inserir participante e verificar se meeting e usuario estão nulos

  }
  return (
    <div>
      <h2>Insira os participantes</h2>
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
          <span>Usuários cadastradao:</span>
          <select defaultValue={usuario} onChange={(e) => setUsuario(e.target.value)}>
            <option value={usuario} disabled>Selecione um usuario</option>
            {usuarios && usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
            ))}
          </select>
        </label>
        {/* <label>
          <span>Inserir pauta:</span>
          <input type="text" value={pauta} onChange={(e) => setPauta(e.target.value)} />
        </label> */}
        <input type="submit" value='Inserir'/>
      </form>
    </div>
  )
}

export default InsertParticipante