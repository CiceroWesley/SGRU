const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require("../models/Usuario");
const Reuniao = require('../models/Reuniao');
const Pauta = require('../models/Pauta');
const Participante = require('../models/Participante');
const Votacao = require('../models/Votacao');

const jwtSecret = process.env.JWT_SECRET;

// Register an meeting
const insertMeeting = async (req, res) => {
    const {titulo, descricao, data, local} = req.body;

    // current user
    const reqUser = req.user
    // É realmente necessário fazer outra consulta o usuário num já está no req.user não?
    // ele é colocado no middleware
    const user = await Usuario.findByPk(reqUser.id);

    // console.log(data)
    // DATA e HORARIO verificar formato
    // create a meeting
    const newMeeting = await Reuniao.create({
      fk_id_organizador : user.id,
      titulo,
      descricao,
      data,
      local
    });

    // error in creating
    if(!newMeeting){
      res.status(422).json({
        errors: ['Houve um problema, por favor tente novamente mais tarde']
      });
      return;
    }

    res.status(201).json(newMeeting);
}

// get meeting by id
const getMeetingById = async (req ,res ) => {
  const {id} = req.params;

  const meeting = await Reuniao.findByPk(id);

  // meeting does not exist
  if(!meeting){
    res.status(404).json({errors : ['Reunião não encontrada']});
    return;
  }
  // console.log('UM')
  res.status(200).json(meeting);
}

// get meetings by fk_id_organizador
const getMeetingByFk_Id_Organizador = async (req, res) => {
  // current user
  const reqUser = req.user
  // É realmente necessário fazer outra consulta o usuário num já está no req.user não?
  // ele é colocado no middleware
  const user = await Usuario.findByPk(reqUser.id);

  const meetings = await Reuniao.findAll({ where : {fk_id_organizador : user.id}});
  // e se o meetings for vazio?
  res.status(200).json(meetings);
}

const insertPauta = async (req, res) => {
  // passar pelo corpo ou como paramêtro da url?
  const {fk_id_reuniao, titulo} = req.body;

  const newPauta = await Pauta.create({
    fk_id_reuniao,
    titulo
  });

  // error in creating
  if(!newPauta){
    res.status(422).json({
      errors: ['Houve um problema, por favor tente novamente mais tarde']
    });
    return;
  }

  res.status(201).json(newPauta);

}

// get meetings by fk_id_reuniao
const getPautaByFk_Id_Reuniao = async (req, res) => {
  // passar pelo body ou pela url(params)?
  // const {fk_id_reuniao} = req.body;
  const {id} = req.params;
  const pautas = await Pauta.findAll({ where : {fk_id_reuniao : id}});
  // e se o pautas for vazio?
  res.status(200).json(pautas);
}

// insert participante in meeting
const insertParticipante = async (req, res) => {
  const {fk_id_reuniao, fk_id_usuario} = req.body;
  
  // É realmente necessário fazer outra consulta o usuário num já está no req.user não?
  // ele é colocado no middleware
  // const user = await Usuario.findByPk(fk_id_usuario);

  // verificar se na reunião atual/tabela PARTICIPANTE (passada pelo corpo) existe um usuário como
  // fk_id_reuniao, se sim retornar error, se não inserir o participante.
  // Está acontecendo o erro de poder inserir duas vezes o mesmo usuário na reunião.

  const participante = await Participante.findAll({where: {fk_id_usuario, fk_id_reuniao}});

  if(participante.length > 0){
      console.log(participante)
      res.status(422).json({errors : 'Esse usuário já se encontra nessa reunião.'});
      return;
  }

  const newInsertParticipante = await Participante.create({
    fk_id_usuario,
    fk_id_reuniao
  });

  // error in creating
  if(!newInsertParticipante){
    res.status(422).json({
      errors: ['Houve um problema, por favor tente novamente mais tarde']
    });
    return;
  }

  res.status(201).json(newInsertParticipante);
}

// get participantes by fk_id_usuario
// reuniões que o usuário está participando
const getParticipanteByFk_Id_Usuario = async (req, res) => {
  // current user
  const reqUser = req.user
  // É realmente necessário fazer outra consulta o usuário num já está no req.user não?
  // ele é colocado no middleware
  const user = await Usuario.findByPk(reqUser.id);


  // reuniões que o usuário está participando
  const participantes = await Participante.findAll({ where : {fk_id_usuario : user.id}});
  // e se o participantes for vazio?
  // if(participantes){
    res.status(200).json(participantes);
  // } else {
  //   res.status(404).json({errors: ['Participantes não encontrados.']})
  // }
  
}

// participantes de um reunião
const getParticipanteByFk_id_Reuniao = async (req, res) => {
  const {id} = req.params;

  // participantes pelo id da reunião
  const participantes = await Participante.findAll({where : {fk_id_reuniao : id}});

  res.status(200).json(participantes);
}

const getParticipanteByFk_id_ReuniaoAndFk_id_Usuario = async (req, res) => {
  // current user
  const reqUser = req.user;
  // fk_id_reunião
  const {id} = req.params;

  // participante pelo id da reunião e do usuário para verificação de presença e votação
  const participante = await Participante.findOne({where : {fk_id_reuniao : id, fk_id_usuario : reqUser.id}});

  // if(participante){
    res.status(200).json(participante);
  // }
  // else {
  //   res.status(404).json({errors: ['Participante não encontrado.']})
  // }

}

const insertVotacao = async (req, res) => {
  const {fk_id_participante, fk_id_pauta} = req.body;

  const newVotacao = await Votacao.create({
    fk_id_participante,
    fk_id_pauta
  });

  // error in creating
  if(!newVotacao){
    res.status(422).json({
      errors: ['Houve um problema, por favor tente novamente mais tarde']
    });
    return;
  }

  res.status(201).json(newVotacao);
}

const markPresence = async (req, res) => {
  // current user
  const reqUser = req.user;
  // fk_id_reunião
  const {fk_id_reuniao} = req.body;

  // participante pelo id da reunião e do usuário para marcar presença
  const participante = await Participante.update(
    {
      presente: true
    },
    {
      where: {fk_id_reuniao, fk_id_usuario : reqUser.id}
    }
  );

  res.status(200).json(participante);
}

const vote = async (req, res) => {

  const {fk_id_participante, fk_id_pauta, voto} = req.body;

  // console.log(fk_id_participante, fk_id_pauta, voto)
  // votação pelo fk_id_participante e fk_id_pauta
  const votacao = await Votacao.update(
    {
      voto : voto
    },
    {
      where: {fk_id_participante, fk_id_pauta}
    }
  );

  res.status(200).json(votacao);
}

const finalizeMeeting  = async (req, res) => {
  // current user
  const reqUser = req.user;

  const {id} = req.body;

  const meeting = await Reuniao.update(
    {
      finalizado : true
    },
    {
      where: {fk_id_organizador : reqUser.id, id}
    }
  );

  res.status(200).json(meeting)
}

const getVotacaoByFkIdPauta = async (req, res) => {

  const {id} = req.params;

  // abstinencia
  const votacaoAbs = await Votacao.count({where : {fk_id_pauta : id, voto : 3}});

  // a favor
  const votacaoAfa = await Votacao.count({where : {fk_id_pauta : id, voto : 1}});

  // contra
  const votacaoCon = await Votacao.count({where : {fk_id_pauta : id, voto : 0}});


  res.status(200).json({
    votacaoAbs,
    votacaoAfa,
    votacaoCon
  }
  );

}

const updateMeeting = async (req, res) => {
  const {id} = req.params;
  const {titulo, descricao, data, local} = req.body;
  console.log(data)
  // console.log(data)
  const meeting = await Reuniao.update(
    {
      titulo,
      descricao,
      data,
      local
    },
    {
      where : {id}
    }
  );

  res.status(200).json(meeting);
};

const updateTitlePauta = async (req, res) => {
  const {titulo} = req.body;
  const {id} = req.params;

  const pauta = await Pauta.update(
    {
      titulo
    },
    {
      where : {id}
    }
  );

  res.status(200).json(pauta);
};

// excluir reuniao
const deleteMeeting = async (req, res) => {
  const {id} = req.params;

  const meeting = await Reuniao.destroy(
    {
      where : {id}
    }
  );

  res.status(200).json(meeting);

}

const getUsersByFkIdMeetingWithFilter = async (req,res) => {
  const {id} = req.params;

  // getParticipanteByFk_Id_Usuario()
  // participantes pelo id da reunião
  const participantes = await Participante.findAll({where : {fk_id_reuniao : id}});

  let usuarios = await Usuario.findAll();

  let usuarioId = [];

  // console.log(participantes)
  // console.log(usuarios)
  if(participantes){
    // procura o index do usuario que é participante da reunião
    participantes.forEach((participante) => {
      usuarioId.push(usuarios.findIndex((usuario) => usuario.id == participante.fk_id_usuario))
    })

    // marca o usuário como disabilitado
    usuarioId.forEach((id) => {
      usuarios[id].nome = 'disabled'
    })

    // filtar os usuários que estão disabled
    usuarios = usuarios.filter((usuario) => {
      return usuario.nome !== 'disabled'
    })

    // console.log(usuarios)
  } 
  // dava para ter feito no frontend
  res.status(200).json(usuarios);
}

// VER os gets que faltam das chaves estrangeiras das outras tabelas.

module.exports = { insertMeeting, getMeetingById, getMeetingByFk_Id_Organizador, insertPauta, getPautaByFk_Id_Reuniao, insertParticipante, getParticipanteByFk_Id_Usuario, getParticipanteByFk_id_Reuniao, insertVotacao, getParticipanteByFk_id_ReuniaoAndFk_id_Usuario, markPresence, vote, getVotacaoByFkIdPauta, finalizeMeeting, updateMeeting, updateTitlePauta, deleteMeeting, getUsersByFkIdMeetingWithFilter};