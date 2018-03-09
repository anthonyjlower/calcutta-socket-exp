// require('dotenv').config();
const express = require('express');
const app = express();
const auctionServer = require('./socket-server');



const server = app.listen(process.env.PORT, () => {
	console.log('server is listening on port: ' + process.env.PORT)
})

auctionServer(server)