const express = require('express');
const router = express.Router();

// Controller
const { insertMeeting, getMeetingById, getMeetingByFk_Id_Organizador, insertPauta, getPautaByFk_Id_Reuniao, insertParticipante, getParticipanteByFk_Id_Usuario, getParticipanteByFk_id_Reuniao, insertVotacao, getParticipanteByFk_id_ReuniaoAndFk_id_Usuario, markPresence, vote, getVotacaoByFkIdPauta, finalizeMeeting, updateMeeting, updateTitlePauta} = require('../Controllers/MeetingController');

// Middlewares
const { authGuard } = require('../middlewares/authGuard');

// Routes
// meeting
// create meeting
router.post('/', authGuard, insertMeeting);

// get meeting by fk_id_organizador
router.get('/fkIdOrganizador', authGuard, getMeetingByFk_Id_Organizador);

// get pautas by fk_id_reuniao
router.get('/pautas/:id', authGuard, getPautaByFk_Id_Reuniao)

// get participantes by fk_id_usuário
// reuniões que o usuário está participando
router.get('/participantes', authGuard, getParticipanteByFk_Id_Usuario);

// get participantes by fk_id_reuniao
// usuarios que estão em uma reunião
router.get('/participantesR/:id', authGuard, getParticipanteByFk_id_Reuniao);

// get participate by fk_id_reunião e fk_id_usuario para verificação de presença
router.get('/participanteRU/:id', authGuard, getParticipanteByFk_id_ReuniaoAndFk_id_Usuario);

// get meeting by id
router.get('/:id', authGuard, getMeetingById);

// get votacao by fk_id_pauta
router.get('/votes/:id', authGuard, getVotacaoByFkIdPauta);

// insert participante
router.post('/participante', authGuard, insertParticipante);

// create pauta
router.post('/pauta', authGuard, insertPauta);

// insert votacao
router.post('/votacao', authGuard, insertVotacao);

// mark presence
router.patch('/markpresence', authGuard, markPresence);

// vote
router.patch('/vote', authGuard, vote);

// finalizeMeeting
router.patch('/finalize', authGuard, finalizeMeeting);

// updateMeeting
router.patch('/:id', authGuard, updateMeeting);

// update titulo da pauta
router.patch('/pauta/:id', authGuard, updateTitlePauta);






module.exports = router;