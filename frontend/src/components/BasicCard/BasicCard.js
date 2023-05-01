import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { Link } from 'react-router-dom';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BasicCard({titulo, finalizado, acessar, deleteFunction, reuniaoId}) {
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{maxWidth : 150}}>
          {titulo}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {finalizado && "finalizada"}
          {!finalizado}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small"><Link to={acessar}>Acessar reunião</Link></Button>
        {deleteFunction && <Button size="small" onClick={() => deleteFunction(reuniaoId)}>Excluir reunião</Button>}
      </CardActions>
    </Card>
  );
}