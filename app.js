const express = require('express')
const formidable = require('express-formidable')
const session = require('express-session')

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

const { UpvestTenancyAPI } = require('@upvest/tenancy-api')
const { UpvestClienteleAPI, UpvestClienteleAPIFromOAuth2Token } = require('@upvest/clientele-api')

const tenancy = new UpvestTenancyAPI(
  API_BASEURL, API_KEY, API_SECRET, API_PASSPHRASE
)

// Main application
app.set('view engine', 'pug')

app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'))
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'))

app.use(formidable())

app.use(session({
  secret: 'sup3rs3cr3t',
  resave: false,
  saveUninitialized: false
}))

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
        username, password,
    )

    const echo = await clientele.echo('foobar')

    req.session.oauth_token = await clientele.getCachedToken()

    res.redirect('/wallets')
})

app.get('/users', async(req, res) => {
    const tenancy = new UpvestTenancyAPI(
        API_BASEURL, API_KEY, API_SECRET, API_PASSPHRASE
    )

    var users = []
    for await (const user of tenancy.users.list()) {
        users.push(user)
    }

    res.render('users', {'users': users})
})

app.get('/wallets', async(req, res) => {
    const token = req.session.oauth_token || false

    if (!token) {
        return res.redirect('/login')
    }

    const clientele = new UpvestClienteleAPIFromOAuth2Token(
        API_BASEURL, token,
    )

    var wallets = []
    for await (const wallet of clientele.wallets.list()) {
        wallets.push(wallet)
    }

    res.render('wallets', {'wallets': wallets})
})

app.post('/wallets', async(req, res) => {
    const token = req.session.oauth_token || false

    if (!token) {
        return res.redirect('/login')
    }

    const clientele = new UpvestClienteleAPIFromOAuth2Token(
        API_BASEURL, token,
    )

    const password = req.fields['password']
    const asset_id = req.fields['asset_id']

    const wallet = await clientele.wallets.create(asset_id, password, null)

    res.redirect('/wallets')
})

app.get('/wallet/:wallet_id', async(req, res) => {
    const token = req.session.oauth_token || false

    if (!token) {
        return res.redirect('/login')
    }

    const clientele = new UpvestClienteleAPIFromOAuth2Token(
        API_BASEURL, token,
    )

    const wallet = await clientele.wallets.retrieve(req.params.wallet_id)

    res.render('wallet', {
        'wallet': wallet,
    })
})

// https://etherconverter.online/

app.post('/wallet/:wallet_id', async(req, res) => {
    const token = req.session.oauth_token || false

    if (!token) {
        return res.redirect('/login')
    }

    const clientele = new UpvestClienteleAPIFromOAuth2Token(
        API_BASEURL, token,
    )

    const recipient = req.fields['recipient']
    const amount = req.fields['amount']
    const password = req.fields['password']
    const asset_id = req.fields['asset_id']

    const fee = 41180000000000

    const tx = await clientele.transactions.create(
        req.params.wallet_id,
        password,
        recipient,
        asset_id,
        amount,
        fee
    )

    res.render('transaction', {
        'transaction': tx
    })
})

app.listen(port, () => console.log(`Example Upvest app listening on port ${port}!`))