const httpHeaders = require('../constants/headers');
const httpStatusCodes = require('../constants/statusCode');

const successHandle = (res, data) => {
  res.writeHead(httpStatusCodes.OK, httpHeaders);
  res.write(
    JSON.stringify({
      status: 'success',
      data: data,
    })
  );
  res.end();
}

module.exports = successHandle;
