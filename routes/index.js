const HttpController = require('../controllers/http');
const PostsController = require('../controllers/posts');

const routes = async (req, res) => {
	const { url, method } = req;

	let body = '';
	req.on('data', (chunk) => {
		body += chunk;
	});

	if (url == '/posts' && method == 'GET') {
		PostsController.getPosts(res);
	} else if (url.startsWith('/posts/') && method == 'GET') {
		PostsController.getSinglePost({ res, url });
	} else if (url == '/posts' && method == 'POST') {
		req.on('end', async () => PostsController.createSinglePost({ res, body }));
	} else if (url.startsWith('/posts/') && method == 'PATCH') {
		req.on('end', async () => PostsController.editSinglePost({ res, url, body }));
	} else if (url == '/posts' && method == 'DELETE') {
		PostsController.deleteAllPosts(res);
	} else if (url.startsWith('/posts/') && method == 'DELETE') {
		PostsController.deleteSinglePosts({ res, url });
	} else if (method === 'OPTIONS') {
    HttpController.cors(res);
  } else {
		HttpController.notFound(res);
  }
}

module.exports = routes;
