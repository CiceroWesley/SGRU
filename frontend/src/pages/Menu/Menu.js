import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



const Menu = () => {
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
    return (
      <div>
        <h1>MENU</h1>
      </div>
    )
  }
  
  export default Menu;