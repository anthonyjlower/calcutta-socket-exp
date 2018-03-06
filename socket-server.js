const io = require('socket.io')


let currentBid = {};


module.exports = function(server){
	const socketServer = io(server);

	socketServer.on('connection', socket => {
		console.log('Socket is on')

		// socket.on('addUser', (poolName) => {
		// 	console.log('poolName => ', poolName)
		// 	socket.join(poolName);
		// 	socket.room = poolName;
			

		// 	socketServer.emit('user bid', currentBid)
		// })
	
		socket.on('top bid', (topBid) => {
			currentBid = topBid
			socketServer.emit('user bid', currentBid)
		})

		socket.on('team up', (teamUp) => {
			socketServer.emit('team up', teamUp)
		})



	})
}