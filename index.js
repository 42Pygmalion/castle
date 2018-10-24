const request = require('request-promise')

const host = 'http://castles.poulpi.fr';
const header = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36';

async function checkRoom (data) {
	data.chests.forEach(async function (chest) {
		try {
			let checkChest = await request.get({uri: host + chest, headers: header, json: true});
			if (checkChest.status == "It looks like there is something here!")
				console.log(checkChest.id);
		} catch(err) {
		    return Promise.reject(new Error(400));
		}
	});
	data.rooms.forEach(async function (room) {
		try {
			let newRoom = await request.get({uri: host + room, headers: header, json: true});
			checkRoom(newRoom);
		} catch(err) {
		    return Promise.reject(new Error(400));
		}
	});
}

async function main () {
	try {
		let data = await request.get({uri: host + '/castles/1/rooms/entry', headers: header, json: true});
		checkRoom(data);
	} catch(err) {
	    return Promise.reject(new Error(400));
	}
}

main();