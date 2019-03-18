const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'pug')

app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'))
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))