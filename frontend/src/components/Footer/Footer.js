import {Divider, Grid, Typography, Link } from "@mui/material"
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';

import { Link as LinkD } from "react-router-dom";
// import SGRUIcon from '../../assets/SGRU.svg';
import SGRU from '../../assets/SGRU2.png';

const Footer = () => {
  return (
    // colocar borda arredondada
    <footer style={{backgroundColor: '#1976d2', border:"1px solid black", borderRadius: "5px"}}>
      {/* <p>Sistema &copy; 2023</p> */}
      
      <Grid container rowSpacing={2}>
        <Grid item container>
          <Grid item xs={6}>
            <LinkD to='/'>
              <img src={SGRU} width={80} alt="Logo do SGRU." />
            </LinkD>
          </Grid> 
          <Grid item container xs={6}>
          <Typography variant="body2" gutterBottom color='white'>
            O SGRU (Sistema Gerenciador de Reuniões Universitárias) é um sistema web desenvolvido para o Trabalho de Conclusão de Curso (TCC) do discente Cicero Wesley Suares Feitosa. O TCC é requisito parcial para a obtenção do grau de Bacharel em Ciência da Computação pela Universidade Federal do Cariri (UFCA).  
          </Typography>
          </Grid> 
        </Grid>
        <Grid item container direction='row' alignItems='center' justifyContent='center'>
          <Divider sx={{width:'90%', borderBottomWidth: 2}}/>
        </Grid>
        
        <Grid item container>
          <Grid item container xs={8}>
            <Typography variant="body2" gutterBottom color='white'>
              &copy; 2023 Cicero Wesley Suares Feitosa. Todos os direitos reservados.
            </Typography>
          </Grid>
          <Grid item container direction='row' justifyContent='space-around' xs={4}>
            <Link href="mailto:wesleycariutaba@gmail.com">
              <EmailIcon sx={{color : 'white'}}/>
            </Link>
            <Link target="_about" href="https://www.linkedin.com/in/cicero-wesley/">
              <LinkedInIcon sx={{color : 'white'}}/>
            </Link>
            <Link target="_about" href="https://github.com/CiceroWesley">
              <GitHubIcon sx={{color : 'white'}}/>
            </Link>
            <Link target="_about" href="https://www.instagram.com/cicero_wesleysf/">
              <InstagramIcon sx={{color : 'white'}}/>
            </Link>
          </Grid>
        </Grid>
        {/* <Grid item container>
          <Grid container xs={6}>
            <Grid item container alignItems='center' direction='column' xs={12}>
              <strong>CONTATO</strong>
              
            </Grid>
          </Grid>
          <Grid container xs={6}>
            
          </Grid>
        </Grid> */}
      </Grid>
      
    </footer>
  )
}

export default Footer