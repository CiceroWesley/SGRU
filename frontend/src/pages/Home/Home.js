import { Grid, Typography } from "@mui/material";

const Home = () => {
  return (
    <Grid container direction='column' alignItems='center' justifyContent='center'>
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <Typography variant="h5" gutterBottom>
          Bem-vindo ao Sistema Gerenciador de Reuniões Universitárias
        </Typography>
        <Typography variant="body1" gutterBottom>
          Esse sistema permite que você crie reuniões informando o nome, descrição, local, data e horário. Além de que, você pode inserir quantas pautas desejar.
        </Typography>
      </Grid>
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <Typography variant="h6" gutterBottom>
            Funcionalidades
          </Typography>
        <Typography variant="body1" gutterBottom>
          Criar contar, fazer login, criar reunião, inserir pauta, inserir participante na reunião, editar dados da reunião, editar nomes de pautas, finalizar reunião, excluir reunião, marcar presença, votar em pautas, verificar participantes de uma reunião que marcaram presença ou não, verificar resultado da votação nas pautas e editar dados do perfil.
        </Typography>
      </Grid>
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <Typography variant="h6" gutterBottom>
          Regras de negócios
        </Typography>
        <Typography variant="body1" gutterBottom>
          A ordem correta para criação da reunião é:
          criar reunião, inserir pautas e por fim inserir os participantes.
          Depois que pelo menos um participante for inserido não é mais possível adicionar pautas a reunião, recomenda-se excluir e recriar o encontro.
          No momento de criar uma reunião, só é possível informar data e horários futuros.
          Apenas o organizador da reunião pode editar seus dados, inserir pautas,participantes e finalizar a reunião. Depois que a reunião for finalizada não é mais possível exclui-lá, edita-lá ou marcar presença. O voto do participante que não marcou presença é considerado abstenção assim como não escolher entre as opções a favor ou contro no momento da votação.
          Apenas participantes que marcarem presença podem ver e votar nas pautas.
        </Typography>
      </Grid>
    </Grid>
  )
}

export default Home;