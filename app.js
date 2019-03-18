const express = require('express')
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

const tenancy = new UpvestTenancyAPI(
  API_BASEURL, API_KEY, API_SECRET, API_PASSPHRASE
);

console.log(tenancy);

// Main application
app.set('view engine', 'pug')

app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'))
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))