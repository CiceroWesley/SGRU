const express = require('express');
const router = express.Router();

// Controller
const { insertMeeting, getMeetingById, getMeetingByFk_Id_Organizador, insertPauta, getPautaByFk_Id_Reuniao, insertParticipante, getParticipanteByFk_Id_Usuario, getParticipanteByFk_id_Reuniao, insertVotacao} = require('../Controllers/MeetingController');

// Middlewares
const { authGuard } = require('../middlewares/authGuard');

// Routes
// meeting
// create meeting
router.post('/', authGuard, insertMeeting);

// get meeting by fk_id_organizador
router.get('/fkIdOrganizador', authGuard, getMeetingByFk_Id_Organizador);

// get pautas by fk_id_reuniao
router.get('/pautas', authGuard, getPautaByFk_Id_Reuniao)

// get participantes by fk_id_usuário
// reuniões que o usuário está participando
router.get('/participantes', authGuard, getParticipanteByFk_Id_Usuario);

// get participantes by fk_id_reuniao
// usuarios que estão em uma reunião
router.get('/participantesR', authGuard, getParticipanteByFk_id_Reuniao);

// get meeting by id
router.get('/:id', authGuard, getMeetingById);

// insert participante
router.post('/participante', authGuard, insertParticipante);

// create pauta
router.post('/pauta', authGuard, insertPauta);

// insert votacao
router.post('/votacao', authGuard, insertVotacao);







module.exports = router;