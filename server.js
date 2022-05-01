const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./model/postModel');
const headers = require('./constants/headers');
const httpStatusCodes = require('./constants/statusCode');
const successHandle = require('./utils/successHandle');
const errorHandle = require('./utils/errorHandle');

dotenv.config({path: './config.env'});

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB)
  .then(() => {
    console.log('connect db successfully')
  }).catch((err) => {
    console.log(err);
  });

const requestListener = async (req, res) => {
	const { url, method } = req;

	let body = '';
	req.on('data', (chunk) => {
		body += chunk;
	});

	if (url == '/posts' && method == 'GET') {
		const allPosts = await Post.find();
		successHandle(res, allPosts);
	} else if (url.startsWith('/posts/') && method == 'GET') {
		try {
			const id = url.split('/').pop();
			const targetPost = await Post.findById(id);
			successHandle(res, targetPost);
		} catch (err) {
			errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
		}
	} else if (url == '/posts' && method == 'POST') {
		req.on('end', async () => {
			try {
				const data = JSON.parse(body);
				const newPost = await Post.create(data);
				successHandle(res, newPost);
			} catch (err) {
				errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
			}
		});
	} else if (url.startsWith('/posts/') && method == 'PATCH') {
		req.on('end', async () => {
			try {
				const id = url.split('/').pop();
				const data = JSON.parse(body);
				const editPost = await Post.findByIdAndUpdate(id, data, { new: true });
				if (editPost === null) {
					throw Error('cannot find post');
				}
				successHandle(res, editPost);
			} catch (err) {
				errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
			}
		});
	} else if (url == '/posts' && method == 'DELETE') {
		try {
			await Post.deleteMany();
			successHandle(res, []);
		} catch (err) {
			errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
		}
	} else if (url.startsWith('/posts/') && method == 'DELETE') {
		try {
			const id = url.split('/').pop();
			await Post.findByIdAndDelete(id);
			const allPosts = await Post.find();
			successHandle(res, allPosts);
		} catch (err) {
			errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
		}
	} else if (method === 'OPTIONS') {
    res.writeHead(200, headers);
		res.end();
  } else {
		errorHandle(res);
  }
}
	
const server = http.createServer(requestListener)
server.listen(process.env.PORT || 3005);
