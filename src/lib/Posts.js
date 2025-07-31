const posts = [
	{
		id: 'acd-fast',
		title: 'Sparse Voxel HashMap ICP',
		tags: ['embedded programming', 'DMA'],
		description:'A fast hashmap implementation that uses a voxel hashmap enabling enabling quick lookup times for smaller hashmaps',
		url: "adc-fast.md",
		slug: 'adc-fast',
		markdownPath: 'src/content/blog/adc-fast.md'
	},
	{
		id: 'sample-post',
		title: 'Reinforcement Learning',
		tags: 'Reinforcement Learning, Simualted Sensors',
		description: 'This project is about training a robot go2 quadrapedal chassis to build leveraging \
		research to have a robot learn to walk in simulation and deploy it to the real world',
		url: "sample-post.md",
		slug: 'sample-post',
		markdownPath: 'src/content/blog/sample-post.md'
	},
	{
		id: 'second-post',
		title: 'Advanced Math with KaTeX',
		tags: 'math, katex, equations',
		description: 'This post demonstrates more advanced mathematical notation using KaTeX in your Svelte blog.',
		url: "sample-post.md",
		slug: 'second-post',
		markdownPath: 'src/content/blog/second-post.md'
	}
];

export default posts; 