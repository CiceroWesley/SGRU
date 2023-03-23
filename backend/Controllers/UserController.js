const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require("../models/Usuario");

const jwtSecret = process.env.JWT_SECRET;

// Register an user
const register = async (req, res) => {
    const {nome, sexo, email, cargo, senha} = req.body;

    // check if users exists
    const user = await Usuario.findOne({ where : {email}});

    if(user){
        res.status(422).json({errors : 'Por favor, utilize outro e-mail'});
        return;
    }

    // User does not exists, create a new
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(senha, salt);

    // Create user
    const newUser = await Usuario.create({
        nome : nome,
        sexo : sexo,
        email : email,
        cargo : cargo,
        senha : passwordHash,
    });

     // Error to create user
    if(!newUser){
        res.status(422).json({errors: ['Houve um erro, por favor tente mais tarde']});
        return;
    }

    // Return user's id with success mensage
    res.status(201).json({
        id: newUser.id,
        msg: "Usuário criado com sucesso"
    });
}

// login 
const login = async (req, res) => {
    const {email, senha} = req.body;

    const user = await Usuario.findOne({ where: {email : email}});

    // user exists
    if(!user){
        res.status(404).json({errors: ['Usuário não encontrado.']});
        return;
    }

    // wrong password
    if(!(await bcrypt.compare(senha, user.senha))){
        res.status(422).json({errors : ['Senha inválida']});
        return;
    }

    // generate token
    const accessToken = jwt.sign({username : user.nome, id: user.id}, jwtSecret, { expiresIn: '7d' });

    // return user with token
    res.status(201).json({
        id: user.id,
        username: user.nome,
        token: accessToken
    });

}

// Get current logged user
const getCurrentUser = async (req, res) => {
    const user = req.user;

    res.status(200).json(user);
}

module.exports = { register, login, getCurrentUser };