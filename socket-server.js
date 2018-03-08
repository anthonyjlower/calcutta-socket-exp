const io = require('socket.io')

const pools = {}


module.exports = function(server){
	const socketServer = io(server);

	socketServer.on('connection', socket => {
		console.log('Socket is on')

		socket.on('addUser', (poolName) => {
			socket.join(poolName);
			socket.room = poolName;

			if (pools[poolName]) {
				socketServer.to(poolName).emit('joined', pools[poolName].currentBid, pools[poolName].currentTeam, pools[poolName].auctionStarted, pools[poolName].lotsToPick, pools[poolName].lotsRemaining);					
			} else {
				pools[poolName] = {
					lotsToPick: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63],
					lotsRemaining: 64,
					currentTeam: {
						name: 'Team Name',
						id: ''
					},
					currentBid: {
						topBidder: 'Top Bidder',
						bidAmount: 0
					},
					auctionStarted: false
				}
				socketServer.to(poolName).emit('joined', pools[poolName].currentBid, pools[poolName].currentTeam, pools[poolName].auctionStarted, pools[poolName].lotsToPick, pools[poolName].lotsRemaining);
			}
		})
	
		socket.on('top bid', (topBid) => {
			pools[socket.room].currentBid = topBid
			socketServer.to(socket.room).emit('user bid', pools[socket.room].currentBid)
		})

		socket.on('team up', (teamUp, lots) => {
			pools[socket.room].lotsToPick = lots
			pools[socket.room].currentTeam = teamUp
			pools[socket.room].lotsRemaining -= 1
			socketServer.to(socket.room).emit('team up', pools[socket.room].currentTeam, pools[socket.room].lotsToPick, pools[socket.room].lotsRemaining)
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
			socketServer.to(socket.room).emit('user bid', pools[socket.room].currentBid)
			socketServer.to(socket.room).emit('team up', pools[socket.room].currentTeam, pools[socket.room].lotsToPick, pools[socket.room].lotsRemaining)
			socketServer.to(socket.room).emit('updatedPool', pools[socket.room].currentPool)
		})

		socket.on('auctionStarted', (startedBool) => {
			pools[socket.room].auctionStarted = startedBool
			socketServer.to(socket.room).emit('auctionStarted', pools[socket.room].auctionStarted)
		})

	})
}