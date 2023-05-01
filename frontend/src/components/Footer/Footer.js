import { Container, Divider, Grid } from "@mui/material"
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <footer>
      {/* <p>Sistema &copy; 2023</p> */}
      <Divider/>
      <Grid container rowSpacing={2}>
        <Grid item container>
          <Grid item xs={8}>
            Logo
          </Grid>  
        </Grid>
        <Grid item container>
          <Grid container xs={6}>
            <Grid item container alignItems='center' direction='column' xs={6}>
              <strong>SOBRE</strong>
              <span>O que é?</span>
              <span>Funcionalidades</span>
              <span>Desenvolvedor</span>
            </Grid>
            <Grid item container alignItems='center' direction='column' xs={6}>
              <strong>CONTATO</strong>
              <EmailIcon/>
              <LinkedInIcon/>
              <GitHubIcon/>
            </Grid>
          </Grid>
          <Grid container xs={6}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illo sit voluptates iste voluptatem eos, delectus consequatur quisquam reiciendis explicabo optio perferendis natus alias nulla minus quis laborum consequuntur consectetur enim!
          </Grid>
        </Grid>
        <Grid item container justifyContent='center' alignItems='center'>
          copyright
        </Grid>
      </Grid>
      
    </footer>
  )
}

export default Footer