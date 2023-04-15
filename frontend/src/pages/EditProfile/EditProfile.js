import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {

  

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

  // fazer função para editar os dados por formulário como na edição do meeting

  return (
    <div>
      <h2>Edite seus dados:</h2>

    </div>
  )
}

export default EditProfile