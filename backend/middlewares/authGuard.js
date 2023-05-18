const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

   // check if header has a token
   if(!token) return res.status(401).json({errors: ['Acesso negado']});

   try {
    const verified = jwt.verify(token, jwtSecret);

    // verife user by id
    // save the user in req.user
    // Estou passando a senha também, depois fazer a filtragem e verificar os campos
    const user = await Usuario.findByPk(verified.id);
    if(user){
      req.user = user;
    } else {
      throw new Error('Usuário inválido')
      res.status(401).json({errors : ['Usuário inválido']});
    }
    

    // continue the request
    next();

   } catch (error) {
    // console.log(error)
    res.status(401).json({errors : ['Token inválido']});
   }

};




module.exports = { authGuard };
