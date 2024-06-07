require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express();

app.use(express.json())

const User = require('./models/User')

app.get('/', (req, res) => {
    res.status(200).json({msg: "Bem vindo a nossa API!"})
})


app.post('/auth/register', async(req, res) => {
    const {name, email, password, confirmpassword} = req.body

    if(!name) return res.status(422).json({msg: "O nome é obrigatório!"})

    if(!email) return res.status(422).json({msg: "O email é obrigatório!"})

    if(!password) return res.status(422).json({msg: "O password é obrigatório!"})

    if(password !== confirmpassword) return res.status(422).json({msg: "As senhas não são iguais!"})

    const userExists = await User.findOne({ email: email})

    if(userExists) return res.status(422).json({msg: "Esse email já está cadastrado!"})
    
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        email,
        password: passwordHash
    })

    try {
        await user.save()

        res.status(201).json({msg: 'Usuário criado com sucesso!'})
    }
    catch(error) {
        console.log(error)
        res.status(500).json({msg: 'Aconteceu algum erro no servidor, tente novamente mais tarde!'})
    }
})



const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.qveblq9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
    app.listen(3000)
    console.log('Conectou ao banco!')
}).catch((err) => console.log(err))