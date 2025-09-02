const posts = [
	{
		id: 'lidar-odometry',
		title: 'Scan To Model Lidar Odometry',
		tags: ['Point Cloud Processing', 'ROS2', 'C++'],
		description:'A scan to model lidar odometry algorithm using point to point icp using a voxel hashmap for efficient point lookup, A pipeline using motion models for deskewing points',
		url: "lidar-odometry.md",
		slug: 'lidar-odometry',
		markdownPath: 'src/content/blog/lidar-odometry.md'
  },
	{
		id: 'acd-fast',
		title: 'A fast adc formulation for',
		tags: ['Point Cloud Processing', 'ROS2', 'C++'],
		description:'A scan to model lidar odometry algorithm using point to point icp using a voxel hashmap for efficient point lookup, A pipeline using motion models for deskewing points',
		url: "adc-fast.md",
		slug: 'adc-fast',
		markdownPath: 'src/content/blog/adc-fast.md'
	},
	{
		id: 'sample-post',
		title: 'Reinforcement Learning',
		tags: 'Reinforcement Learning, Simultation, Python ',
		description: 'This project is about training a robot go2 quadrapedal chassis to build leveraging \
		research to have a robot learn to walk in simulation and deploy it to a chassis',
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
