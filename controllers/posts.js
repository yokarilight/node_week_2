const httpStatusCodes = require('../constants/statusCode');
const Post = require('../model/postModel');
const successHandle = require('../utils/successHandle');
const errorHandle = require('../utils/errorHandle');

const posts = {
	async getPosts(res) {
		const allPosts = await Post.find();
		successHandle(res, allPosts);
	},
	async getSinglePost({ res, url }) {
		try {
			const id = url.split('/').pop();
			const targetPost = await Post.findById(id);
			successHandle(res, targetPost);
		} catch (err) {
			errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
		}
	},
	async createSinglePost({ res, body }) {
		try {
			const data = JSON.parse(body);
			const newPost = await Post.create(data);
			successHandle(res, newPost);
		} catch (err) {
			errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
		}
	},
	async editSinglePost({ res, url, body }) {
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
	},
	async deleteAllPosts(res) {
		try {
			await Post.deleteMany();
			successHandle(res, []);
		} catch (err) {
			errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
		}
	},
	async deleteSinglePosts({ res, url }) {
		try {
			const id = url.split('/').pop();
			await Post.findByIdAndDelete(id);
			const allPosts = await Post.find();
			successHandle(res, allPosts);
		} catch (err) {
			errorHandle(res, err, httpStatusCodes.BAD_REQUEST);
		}
	},
}

module.exports = posts;