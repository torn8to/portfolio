const posts = [
	{
		id: 'lidar-odometry',
		title: 'Scan To Model Lidar Odometry',
		tags: ['Point Cloud Processing', 'ROS2', 'C++'],
		description: 'A scan to model lidar odometry algorithm \
		using point to point icp using a voxel hashmap for efficient point lookup, A pipeline using motion models for deskewing points',
		url: "lidar-odometry.md",
		slug: 'lidar-odometry',
		markdownPath: 'src/content/blog/lidar-odometry.md'
	},
	{
		id: 'gpu-icp',
		title: 'Speeding up ICP with GPU programming',
		tags: ['C++', 'CUDA'],
		description: 'benchmarking a gpu implementation of icp and comparing it to the multithreaded cpu version',
		url: "gpu-icp.md",
		slug: 'gpu-icp',
		markdownPath: 'src/content/blog/gpu-icp.md'
	},
	{
		id: 'quadraped-training',
		title: 'Reinforcement Learning',
		tags: 'Reinforcement Learning, Simultation, Python',
		description: 'This project is about training a robot go2 quadrapedal chassis to build leveraging \
		research to have a robot learn to walk in simulation and deploy it to a chassis',
		url: "quadraped-training.md",
		slug: 'quadraped-training',
		markdownPath: 'src/content/blog/quadraped-training.md'
	}
];

export default posts; 
