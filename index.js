// require('dotenv').config();
const express = require('express');
const app = express();
const auctionServer = require('./socket-server');



const server = app.listen(4000, () => {
	console.log('server is listening on port: ' + 4000)
})

auctionServer(server)