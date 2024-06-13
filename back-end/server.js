require('./config/db')


const app = require('express')()
const port = 3000

const UserRouter = require('./api/User')

const bodyParser = require('express').json
app.use(bodyParser())

app.use('/user', UserRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).json({ message: 'Erro interno do servidor!' });
})