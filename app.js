const express = require('express')
const formidable = require('express-formidable')

const app = express()
const port = 3000

// API keys
const API_BASEURL = 'https://api-playground.eu.upvest.co/1.0/'

const DECRYPTION_KEY = 'HOg8uH+u5X72hM5fv1Dw6wizLBbNs0QZMP2Yy9Kk30E='

const API_KEY = '3xn7XH5kqoiYYjS5Pl9P3A'
const API_SECRET = '29zWI0XhXvGjamqOsmnasTmakM8EGDEIOWZgvYALWx0'
const API_PASSPHRASE = 'vrg4DSpZUgwQwSlc9kJkiPJHmPwCvIeDEh7IcjbXoJE'

const API_OAUTH_ID = 'cyJqUWANySJXmu37FUKTD7M5x7F7Rz4W6LzRIkjF'
const API_OAUTH_SECRET = '6cGjSJYAFORez2UxYSeYuJDzGCyS4o5nPAwq9X0gs2cmJbLTCsuxHPtYZSdCmFYibglYOW7lRwHJ8pKz5neqgn0XinQIp9i2ge5WZf3XeB7mIzBpJNTLFu2cXEQWO2tP'

const { UpvestTenancyAPI } = require('@upvest/tenancy-api');
const { UpvestClienteleAPI } = require('@upvest/clientele-api');

const tenancy = new UpvestTenancyAPI(
  API_BASEURL, API_KEY, API_SECRET, API_PASSPHRASE
);

// Main application
app.set('view engine', 'pug')

app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'))
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'))

app.use(formidable())

app.get('/', (req, res) => {
    res.render('index')
})

// Sign up
app.get('/signup', (req, res) => {
    res.render('signup')
})

app.post('/signup', async(req, res) => {
    const username = req.fields['username']
    const password = req.fields['password']

    try {
        user = await tenancy.users.create(username, password)
    } catch (error) {
        console.log(error)
    }

    res.render('signup', {
        'username': user.username,
        'recoverykit': user.recoverykit
    })
})

// Log in
app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async(req, res) => {
    const username = req.fields['username']
    const password = req.fields['password']

    const clientele = new UpvestClienteleAPI(
        API_BASEURL, API_OAUTH_ID, API_OAUTH_SECRET,
        username, password
    );

    const echo = await clientele.echo('foobar')

    console.log('Echo endpoint said:', echo)

    res.render('login')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))