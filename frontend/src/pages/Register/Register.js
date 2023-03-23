import { useState } from "react";


const Register = () => {
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('M');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [senha, setSenha] = useState('');

  const [errorR, setErrorR] = useState('')

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(nome, sexo, email, cargo, senha);
    const user = {
      nome,
      sexo,
      email,
      cargo,
      senha
    };

    // post request
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify(user)
    };

    try {
      const res = await fetch('http://localhost:3000/api/users/register', requestOptions)
      .then((res) => res.json())
      .catch((err) => err);

      if(res.errors){
        setErrorR(res.errors);
        // console.log("TESTE")
      } else {
        // console.log('sem erros')
        setErrorR('');
      }

    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div>
      {errorR && <p>{errorR}</p>}
      <h2>Crie um conta</h2>
      <form onSubmit={handleSubmit} >
        <label>
          <span>Nome</span>
          <input type="text" placeholder="Nome" onChange={(e) => setNome(e.target.value)} value={nome} required />
        </label>
        <label>
          <span>Sexo:</span>
          <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </label>
        <label>
          <span>E-mail:</span>
          <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} required/>
        </label>
        <label>
          <span>Cargo:</span>
          <input type="text" onChange={(e) => setCargo(e.target.value)} value={cargo} required/>
        </label>
        <label>
          <span>Senha:</span>
          <input type="password" onChange={(e) => setSenha(e.target.value)} value={senha} required/>
        </label>
        <input type="submit" value='Cadastrar' />
        
      </form>
    </div>
  )
}
  
  export default Register;