const queues = new Map();

function generateUniqueQueueID() {
	let id;
	do {
		id = Math.floor(10000 + Math.random() * 90000);
	} while (queues.has(id));
	return id;
}

module.exports = { queues, generateUniqueQueueID };
