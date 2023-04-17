import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [senha, setSenha] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  useEffect(() => {
    const verifyUser = () => {
      if(!user){
        navigate('/login');
      }
    }
    verifyUser()
  }, [user, navigate]);

  // pegar dados usando a rota de usuário atual
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('accessToken');

      const requestOptions = {
        method : 'GET',
        headers : {}
      };
      requestOptions.headers.Authorization = `Bearer ${token}`;

      try {
        const res = await fetch('http://localhost:3000/api/users/profile', requestOptions)
        .then((res) => res.json())
        .catch(err => err);

        if(res.errors){
          console.log(res.errors)
        } else {
          // console.log(res)
          setNome(res.nome);
          setEmail(res.email);
          setCargo(res.cargo);
          // setSenha(res.senha);
        }


      } catch (error) {
        console.log(error)
      }

    };
    getUser();
  }, [])
  // fazer função para editar os dados por formulário como na edição do meeting
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      nome,
      email,
      cargo,
      senha
    };

    const token = localStorage.getItem('accessToken');

    const requestOptions = {
      method : 'PATCH',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify(user)
    };
    requestOptions.headers.Authorization = `Bearer ${token}`;

    try {
      const res = await fetch('http://localhost:3000/api/users/edit', requestOptions)
      .then((res) => res.json())
      .catch(err => err);

      if(res.errors){
        console.log(res.errors);
      } else {
        console.log(res[0])
        console.log(typeof res)
        if(Number(res) === 1){
          const user = {
            id : JSON.parse(localStorage.getItem('user')).id,
            username : nome
          }
          localStorage.setItem('user', JSON.stringify(user));
          console.log('Dados editados com sucesso');
        } else {
          console.log('Erro ao editar usuário')
        }
      }


    } catch (error) {
      console.log(error)
    }



  };


  return (
    <div>
      <h2>Edite seus dados:</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Nome:</span>
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}/>
        </label>
        <label>
          <span>E-mail:</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
        </label>
        <label>
          <span>Cargo:</span>
          <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)}/>
        </label>
        <label>
          <span>Senha:</span>
          <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}/>
        </label>
        <input type="submit" value='Editar'/>
      </form>

    </div>
  )
}

export default EditProfile