import { Link } from "react-router-dom"
import { Grid, Alert, AlertTitle, Button } from "@mui/material"

const NotFound = () => {
  return (
    <Grid container>
      <Grid item container direction='column' alignItems='center' justifyContent='center' spacing={2} marginTop={5}>
        <Grid item>
          <Alert sx={{fontSize: 20}} severity="warning" variant="filled">
            <AlertTitle>
              Erro 404
            </AlertTitle>
            <strong>Nada foi encontrado &#x2639;</strong>
          </Alert>
        </Grid>
        <Grid item>
          <Link to={`/`}>
            <Button type='small' variant="contained">Vá para a página inicial.
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default NotFound