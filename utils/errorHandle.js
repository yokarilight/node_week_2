const httpHeaders = require('../constants/headers');
const httpStatusCodes = require('../constants/statusCode');

const errorHandle = (res, err, statusCode) => {
	res.writeHead(statusCode ?? httpStatusCodes.NOT_FOUND, httpHeaders);
	res.write(
		JSON.stringify({
			status: false,
			message: err?.message ?? 'invalid router',
		})
	);
	res.end();
}

module.exports = errorHandle;
