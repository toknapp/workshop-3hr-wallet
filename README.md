# workshop-3hr-wallet

Workshop materials for "How to create a wallet in 3 hours"

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

The sign up renders a Pug template for signing up. When the user makes a request from this form providing his username and password, we can create the user his account via the `tenancy` API. Later on, we can decide which type of wallet to create.

## Step 5 -- Clientele API, echo

If you take a look at the `app.post('/login', ...)` function, you will see that we use the connection object `UpvestClienteleAPI` for the `clientele` API. We verify the authentication for the API key works by requesting the API to echo back our payload `foobar` which we send as data. The echoing request happens via the `echo` method.

If we get a successful echo response from the API, we can be sure that the authentication is correct.

## Step 6 -- Login, sessions

The login template allows the user to login via the Upvest API. Again, `username` and `password` are required. The `app.post('/login', ...)` function is responsible for handling the login request. 

In order to store the login session, we use `express-session` which you can install via NPM.

```
npm install express-session --save
```

Now we have the `express-session` functionality, we can request the cached session token from the `clientele` API. This token is stored in the `req.session.oauth_token` for later use.

Everytime the user initiates a new request, we will first check if the `oauth_token` is present. If not, we redirect the user back to the `/login` page in order to identify himself.

## Step 7 -- Read/create wallets

Reading wallets happens via `clientele.wallets.list()` - provides overview of all wallets for a user.
Creating wallets happens via `clientele.wallets.create(asset_id, password)`.

## Step 8 -- Wallet view

The wallet view can be requested by using the `clientele` SDK by passing the ID of the wallet to retrieve. The wallet view provides an overview of all assets it holds and its corresponding addresses.

```
clientele.wallets.retrieve(wallet_id)
```

More information regarding the data in the response object can be found in the [KMS documentation](https://doc.upvest.co/reference/kms#kms_wallet_read) for the Upvest API.

## Step 9 -- Send transactions

Sending a transaction is handled by the `app.post('/wallet/:wallet_id'` function which accepts a wallet ID as parameter in its request URI.

The following data is required for sending a transaction from the user's wallet:
- `wallet_id`: Wallet ID of wallet to be used for transaction (from request URI).
- `password`: Password of user its wallet.
- `recipient`: Address to send the asset to.
- `assetId`: Which type of asset will be transfered (Ether, ...).
- `quantity`: Amount of particular asset to transfer.
- `fee`: Transaction fee to be added to transaction (for including the transaction in blockchain). Currently, fixed at `41180000000000`.