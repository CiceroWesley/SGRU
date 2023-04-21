import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div>
      <h2>Nada foi encontrado :(</h2>
      <Link to={`/`}>Vá para a página inicial.</Link>
    </div>
  )
}

export default NotFound