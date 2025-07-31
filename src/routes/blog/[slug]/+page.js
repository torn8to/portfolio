import posts from '$lib/Posts.js';

/**
 * @param {{ params: { slug: string } }} options
 */
export function load(options) {
	const { params } = options;
	const post = posts.find((post) => post.slug === params.slug);
	
	if (!post) {
		return {
			status: 404,
			error: new Error(`Post not found: ${params.slug}`)
		};
	}
	
	return {
		post
	};
} 