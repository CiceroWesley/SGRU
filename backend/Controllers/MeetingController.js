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

// get meetings by fk_id_organizador
const getPautaByFk_Id_Reuniao = async (req, res) => {
  // passar pelo body ou pela url(params)?
  const {fk_id_reuniao} = req.body;
  const pautas = await Pauta.findAll({ where : {fk_id_reuniao}});
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
  res.status(200).json(participantes);
}

const getParticipanteByFk_id_Reuniao = async (req, res) => {
  const {fk_id_reuniao} = req.body;

  // participantes pelo id da reunião
  const participantes = await Participante.findAll({where : {fk_id_reuniao}});

  res.status(200).json(participantes);
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

// CONTINUAR
const getVotacaoByFkIdPauta = async (req, res) => {

  const {fk_id_pauta} = req.body;
}

// VER os gets que faltam das chaves estrangeiras das outras tabelas.

module.exports = { insertMeeting, getMeetingById, getMeetingByFk_Id_Organizador, insertPauta, getPautaByFk_Id_Reuniao, insertParticipante, getParticipanteByFk_Id_Usuario, getParticipanteByFk_id_Reuniao, insertVotacao};