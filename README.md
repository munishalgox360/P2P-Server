# P2P New Server

# Auther : <img src="https://algox360.com/img/logo.webp" height="40px">
<img src="https://appdukaan.com/wp-content/uploads/2021/07/Taxi_Booking__Banner.jpg" height="300px"/>
<h3>Cab Booking Application</h3>

## Local Development Server
``` git clone https://github.com/munishalgox360/P2P-Server.git ```

``` npm install ```

``` npm start ```


> [! WARNING] - Urgent info that NEEDS immediate USER attention to avoid problems.

- const { createServer } = require('node:http');
- const server = createServer(app);

## Live Development Server
``` sudo git clone https://github.com/munishalgox360/P2P-Server.git ```

``` sudo npm install ```

``` sudo npm start ```

> [! WARNING] - Urgent info that NEEDS immediate USER attention to avoid problems.

- const { createServer } = require('node:https');
- const privateKey = fs.readFileSync('/etc/letsencrypt/live/kambojproperty.com/privkey.pem', 'utf8');
- const certificate = fs.readFileSync('/etc/letsencrypt/live/kambojproperty.com/fullchain.pem', 'utf8');
- const credentials = { key: privateKey, cert: certificate };
- const server = createServer(credentials, app);


