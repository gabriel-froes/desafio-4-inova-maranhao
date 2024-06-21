const express = require('express');
const router = express.Router();

const User = require('./../models/User')
const bcrypt = require('bcrypt')


/**
 * @swagger
 * /usuario/cadastro:
 *   post:
 *     description: Cadastre novo usuário
 *     tags: [Login]
 *     consumes:
 *       - application/x-www-form-urlencoded
 *     parameters:
 *       - in: formData
 *         name: username
 *         description: Identificador único do usuário. Deve ter entre 3 e 15 caracteres e pode conter apenas letras minúsculas, números, sublinhados ou hifens.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: email
 *         description: Email válido do usuário.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: password
 *         description: Senha do usuário. Deve ter pelo menos 8 caracteres.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: confirmPassword
 *         description: Confirmação da senha do usuário. Deve ser igual à senha.
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso.
 *       422:
 *         description: Dados incorretos. A senha ou a confirmação da senha podem não estar corretas.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/cadastro', async (req, res) => {
    let { username, email, password, confirmPassword } = req.body;

    if(!username) return res.status(422).json({message: 'username é obrigatório'})
    if(!email) return res.status(422).json({message: 'email é obrigatório'})
    if(!password) return res.status(422).json({message: 'password é obrigatório'})
    if(!confirmPassword) return res.status(422).json({message: 'confirmPassword é obrigatório'})

    if(typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string') return res.status(422).json({message: 'Todos os dados devem ser strings!'})

    username = username.trim()
    email = email.trim().toLowerCase()
    password = password.trim()
    confirmPassword = confirmPassword.trim()

    if(!/^[a-z0-9_-]{3,15}$/.test(username)) return res.status(422).json({message: 'username inválido. Deve ter entre 3 e 15 caracteres e pode conter apenas letras minúsculas, números, sublinhados ou hifens.'})
    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return res.status(422).json({message: 'email inválido!'})
    if(password.length < 8) return res.status(422).json({message: 'password deve ter pelo menos 8 caracteres.'})
    if(password !== confirmPassword) return res.status(422).json({message: 'As senhas não coincidem!'})

    const userExists = await User.findOne({username: username})
    const emailExists = await User.findOne({email: email})

    if(userExists) return res.status(422).json({message: 'username já cadastrado'})
    if(emailExists) return res.status(422).json({message: 'email já cadastrado'})

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    try {
        await newUser.save()
        return res.status(201).json({message: 'Usuário criado com sucesso!'})
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({message: 'Erro ao salvar novo usuário no banco de dados!'})
    }
})


/**
 * @swagger
 * /usuario/login:
 *   post:
 *     description: Login
 *     tags: [Login]
 *     parameters:
 *       - in: formData
 *         name: email
 *         description: Email válido do usuário.
 *         required: true
 *         type: string
 *       - in: formData
 *         name: password
 *         description: Senha do usuário
 *         required: true
 *         type: string
 *     responses:
 *       201:
 *         description: Usuário encontrado e autenticado.
 *       422:
 *         description: Dados incorretos. A senha pode estar incorreta.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/login', async (req, res) => {
    let { email, password } = req.body;

    if(!email) return res.status(422).json({message: 'email é obrigatório'})
    if(!password) return res.status(422).json({message: 'password é obrigatório'})

    if(typeof email !== 'string' || typeof password !== 'string') return res.status(422).json({message: 'Todos os dados devem ser strings!'})

    email = email.trim().toLowerCase()
    password = password.trim()

    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) return res.status(422).json({message: 'email inválido!'})

    try {
        const user = await User.findOne({email: email})

        if(!user) return res.status(422).json({message: 'Dados incorretos. Tente novamente!' })

        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword) return res.status(422).json({message: 'Dados incorretos. Tente novamente!'})

        return res.status(200).json({message: 'Login com sucesso!'})
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({essage: 'Erro interno no servidor!'})
    }
})


module.exports = router