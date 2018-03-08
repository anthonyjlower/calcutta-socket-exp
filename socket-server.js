const io = require('socket.io')

const pools = {}


module.exports = function(server){
	const socketServer = io(server);

	socketServer.on('connection', socket => {
		console.log('Socket is on')

		socket.on('addUser', (poolName) => {
			socket.join(poolName);
			socket.room = poolName;

			// Look through pools{} for a key that matches poolName, if emit that, if one isn't found create it and emit that
			if (pools[poolName]) {
				socketServer.to(poolName).emit('joined', pools[poolName].currentBid, pools[poolName].currentTeam);					
			} else {
				pools[poolName] = {
					currentTeam: {
						name: 'Team Name',
						id: ''
					},
					currentBid: {
						topBidder: 'Top Bidder',
						bidAmount: 0
					}
				}
				socketServer.to(poolName).emit('joined', pools[poolName].currentBid, pools[poolName].currentTeam);		
			}
		})
	
		socket.on('top bid', (topBid) => {
			pools[socket.room].currentBid = topBid
			socketServer.to(socket.room).emit('user bid', pools[socket.room].currentBid)
		})

		socket.on('team up', (teamUp) => {
			pools[socket.room].currentTeam = teamUp
			socketServer.to(socket.room).emit('team up', pools[socket.room].currentTeam)
		})

		socket.on('selectedPool', (selectedPool) => {
			pools[socket.room].currentPool = selectedPool
			pools[socket.room].currentBid = {
				topBidder: "Top Bidder",
				bidAmount: 0
			}
			pools[socket.room].currentTeam = {
				name: "Team Name",
				id: ''
			}
			socketServer.emit('user bid', pools[socket.room].currentBid)
			socketServer.emit('team up', pools[socket.room].currentTeam)
			socketServer.emit('updatedPool', pools[socket.room].currentPool)
		})

	})
}