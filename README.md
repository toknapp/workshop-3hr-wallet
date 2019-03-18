# workshop-3hr-wallet

Workshop materials for "how to create a wallet in 3 hours"

## Step 1 -- Scaffolding

```
$ npm init
$ npm install express --save
$ npm install @upvest/clientele-api --save
$ npm install @upvest/tenancy-api --save
```

## Step 2 -- Templating, jquery & bootstrap, navbar

```
npm install pug --save

npm install jquery --save
npm install bootstrap --save

mkdir views
touch views/index.pug
```

## Step 3 -- API keys, tenancy

[Upvest Account Management](https://login.upvest.co/)

Jot down API key, secret & passphrase in your application.

## Step 4 -- Sign up

```
npm install express-formidable --save

touch views/signup.pug
```

## Step 5 -- Clientele API, echo
