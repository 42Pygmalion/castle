var http = require('http');
var fs = require('graceful-fs');

function openChest (res) {
	res.on('data', (chunk) => {
		if (JSON.parse(chunk.toString('utf8')).status == "It looks like there is something here!") {
				fs.appendFile("./chests", JSON.parse(chunk.toString('utf8')).id + '\n', (err) => {
			    	if (err) {
			    		return console.log(err);
				    }
				});
		}
	});
}

function wasNotVisited (room) {
	fs.readFile("./visited", (err, data) => {
    	if (err) {
    		return console.log(err);
	    }
		data.toString().split('\n').forEach((line) => {
			if (room == line) {
				return (0);
			}
		});
	});
	return (1);
}

function justVisited (room) {
	fs.appendFile("./visited", room + '\n', (err) => {
    	if (err) {
    		return console.log(err);
	    }
	});
}

function openDoor (res) {
    var data = '';
    var i = 0;
    res.on('data', (chunk) => {
        var data = JSON.parse(chunk);
        while (data.rooms[i]) {
       		console.log(data.rooms[i]);
        	if (wasNotVisited(data.rooms[i])) {
	      		var request = http.request({host: 'castles.poulpi.fr', path: data.rooms[i]}, openDoor);
	        	request.on('error', (e) => {
	    			console.log(e.message);
				});
				request.end();
	        	justVisited(data.rooms[i]);
			}
        	// console.log('dd');
        	i++;
        }
        i = 0;
        while (data.chests[i]) {
        	var request = http.request({host: 'castles.poulpi.fr', path: data.chests[i]}, openChest);
        	request.on('error', (e) => {
    			console.log(e.message);
			});
			request.end();
        	i++;
        }
    });
}

fs.writeFile("./visited", "", (err, data) => {
	if (err)
		console.log(err);
});

fs.writeFile("./chests", "", (err, data) => {
	if (err)
		console.log(err);
});

var request = http.request({host: 'castles.poulpi.fr', path: '/castles/1/rooms/entry'}, openDoor);
request.on('error', (e) => {
    console.log(e.message);
});
request.end();
