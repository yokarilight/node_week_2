const headers = require('../constants/headers');
const errorHandle = require('../utils/errorHandle');

const http = {
	cors(res) {
		res.writeHead(200, headers);
		res.end();
	},
	notFound(res) {
		errorHandle(res);
	}
}

module.exports = http;
