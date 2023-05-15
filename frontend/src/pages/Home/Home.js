import { Grid, Typography } from "@mui/material";

const Home = () => {
  return (
    <Grid container direction='column' alignItems='center' justifyContent='center'>
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <Typography variant="h5" gutterBottom>
          Bem-vindo ao Sistema Gerenciador de Reuniões Universitárias
        </Typography>
        <Typography variant="body1" gutterBottom>
          Este sistema permite que você crie reuniões informando o nome, descrição, local, data e horário, além de permitir a inclusão de quantas pautas desejar.
        </Typography>
      </Grid>
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <Typography variant="h6" gutterBottom>
            Funcionalidades
          </Typography>
        <Typography variant="body1" gutterBottom>
          Criar conta, fazer login, criar reunião, inserir pauta, adicionar participantes na reunião, editar dados da reunião, editar nomes de pautas, finalizar reunião, excluir reunião, marcar presença, votar em pautas, verificar os participantes que marcaram presença ou não, verificar o resultado da votação nas pautas e editar dados do perfil.
        </Typography>
      </Grid>
      <Grid item container direction='column' alignItems='center' justifyContent='center'>
        <Typography variant="h6" gutterBottom>
          Regras de negócio
        </Typography>
        <Typography variant="body1" gutterBottom>
          A ordem correta para criação de uma reunião é:
          criar a reunião, inserir pautas e por fim incluir os participantes. Depois que pelo menos um participante for inserido, não é mais possível adicionar pautas à reunião. Neste caso, recomenda-se excluir e recriar o encontro. Ao criar uma reunião, só é possível informar datas e horários futuros. Somente o organizador da reunião pode editar seus dados, inserir pautas, participantes e finalizar a reunião. Depois que a reunião for finalizada, não é mais possível excluí-la, editá-la ou marcar presença. O voto do participante que não marcou presença é considerado abstenção, assim como não escolher entre as opções a favor ou contra no momento da votação. Apenas os participantes que marcarem presença podem ver e votar nas pautas.
        </Typography>
      </Grid>
    </Grid>
  )
}

export default Home;