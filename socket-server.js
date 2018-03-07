const io = require('socket.io')


let currentBid = {
	topBidder: "Top Bidder",
	bidAmount: 0
};

let currentTeam = {
	name: "Team Name",
	id: ''
};

let currentPool = {}


module.exports = function(server){
	const socketServer = io(server);

	socketServer.on('connection', socket => {
		console.log('Socket is on')

		socket.on('addUser', (poolName) => {
			socket.join(poolName);
			socket.room = poolName;

			// Need a way to only push currentBid and currentTeam to the pool the user is in at scale
			
			socketServer.to(poolName).emit('joined', currentBid, currentTeam);
		})
	
		socket.on('top bid', (topBid) => {
			currentBid = topBid
			socketServer.emit('user bid', currentBid)
		})

		socket.on('team up', (teamUp) => {
			currentTeam = teamUp
			socketServer.emit('team up', currentTeam)
		})

		socket.on('selectedPool', (selectedPool) => {
			currentPool = selectedPool
			currentBid = {
				topBidder: "Top Bidder",
				bidAmount: 0
			}
			currentTeam = {
				name: "Team Name",
				id: ''
			}
			socketServer.emit('user bid', currentBid)
			socketServer.emit('team up', currentTeam)
			socketServer.emit('updatedPool', currentPool, currentBid, currentTeam)
		})

		// Need to find a way to update the state of selectedPool everytime a bid is submitted



	})
}