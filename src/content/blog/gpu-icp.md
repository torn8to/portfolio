---
title: GPU SparseVoxel HAshmap
description: Building and developing a lidar odometry pipeline
tags: Point Cloud Processing, C++, Thrust, Cuda
date: 2025-09-15
---

# introduction
To open up the ability of online lidar slam i need to be able to run the icp algorithim in tandom with the odometry algorithim. This will allow for the odometry algorithim to run at a higher rate than the cpu on my computer will allow maintaining a constant frame rate. as such i need to be able to run the icp algorithim at a higher rate than the cpu can handle. The option i have is to use the nvidia gpu integrated into my laptop.

# hardware 
Lenovo Legion 5 16" with a 3060 laptop card and a 16 core amd 6800h as processor.
CPU: AMD Ryzen 9 6800H
CORES: 16
THREADS: 32
RAM: 16GB DDR4
GPU: NVIDIA GeForce RTX 3060 Laptop GPU
GPU RAM: 6GB
Operating System: Ubuntu 24.04.5 LTS


# Challenges
There are a few challenges that i need to address to make this work. I need to use a Hashmap on the gpu to store the voxels. The libraries on the cpu Eigen and Sophus do have support for cuda a few of the functions i need to use Constructor and do can not be directly translated to the gpu. More specifically the exponential map function is a static function that calls a constructor. Eigen the default implementations have alignment checks that are not compatible with the gpu luckily there is a workaround for this below. this allows me to copy my data from the cpu to with it being compatible with the gpu Sophus supports these eigen types which allows me to do point transforms easily.

```cpp
    Eigen::Vector3dDNA = Eigen::Matrix<double, 3, 1, Eigen::DontAlign>

```
The issue with sophus comes with the deriving the jacobian as we need to get the exponential map of the source which is a static function that calls the constructor of the SO3 class.  This requires us to implement our own exponential map function.

The next issue is the Hashmap implementation on the gpu as it is not directly supported by the cuda toolkit. In my case i will be using the library stdgpu whihch implements a hashmap on the gpu. This is a template library that allows for the use of a hashmap on the gpu.  

A few changes to datastructures underlying the hashmap are needed to make it work on the gpu. The first is inserting new voxels into the hashmap. To prevent race we use a set of voxels to be inserted into the hashmap. That we use to check if a voxel is already in the hashmap. If it is we skip it, if not we insert a new voxel with no points into the hashmap. Then for adding new points as we cannot gurantee threads safety we use an int attached to Voxel struct that is operates as a lock for the voxel. we use the atomic Compare and SWAP function to increment the lock and decrement it. When the lock is acquired we set the value to one using the compare and swap we copy the points into shared memory validate that the point meets the criteria to add it to the voxel then add it to the voxel in global memory. 

Some other differences in the implementation at well such as number of points in a voxel are declared at compile time instead of runtime. This is to simplify the implementation as the structure of the voxel is fixed at compile time.

Their are parts that happen outside of the icp algorihm such as random sampling and motion deskewing that are run on the cpu for both implementations. point sampling happens on the cpu as the implemnting the hashmap sampling on the gpu does not provide the same randomness as the cpu implementation. The motion deskewing is kept on the cpu as the overhead of copying the data to the gpu is slower than running the multithreaded implementation on the cpu.

# Methodology and Setup
To compare the performance of the implementations on the gpu and cpu we will test two configurations of VoxelHashMap on the cpu altering the the number of threads used in the icp algorithm to 8 and 16 as well as a the gpu implementation using a block size of 4096.  The parameters such as voxel size and max points per voxel will be the same to match the cpu implementation.  

 - max points per voxel = 27
 - Sparse voxel size = .5m
 - icp max iterations = 500
 - local map radius = 100m

For validating the accuracy of each method we will use compare to odometry outputs from the 16 core implementation. and use an approximate check of the double to be precise to 1e-4 discrepancy greater than 1e-4 will be marked as a failure. The GPU implementation will be checked against the odometry from the 16 core implementation.  instead of timing the icp algorithm directly we will be timing the odometry algorithm as a whole to get a more accurate representation of the performance of the entire system. The icp algorithm is the bulk of the runtime of the odometry algorithm.  

For each iteration on the odometry we will be running odometry using the a Lidar odometry with no imu data. This provides a better snapshot of the performance of the icp algorithm.  We will be timing the odometry algorithm in full including point sampling, motion deskewing, icp, as well as updating the sparse voxel hash map with the new points and removing the voxels outside of the local map radius. 

The only application open will be a fresh terminal executing the odometry algorithm. with no other applications open to prevent any other processes from using the gpu except for the default driver processes.  The benchmark will be run on 10513 frames of the kitti360 dataset sequence 00. The times of processing each scan of the odometry algorithm will be saved to a file and then analyzed using a box and whisker plot and a histogram to show the distribution of the timing.
# results
![results](https://github.com/torn8to/portfolio/blob/master/src/content/blog/iamges/gpu_icp/box%20and%20whisker%20plot%20and%20histogram.png?raw=true)

The Box and whisker plot shows the distribution of the timings and the outliers of the timings of the odometry algorithm. With circles representing the outliers in timing the data.  The dotted line in the box and whisker plot represents the 10 hz threshold line for processing the odometry algorithm for a single 10 hz lidar scan. While most of the scans are below the threshold of 10 hz for all implementations the gpu implementation is able to process the scans at 10hz we have outliers that take longer than 10hz and this long tail distribution becomes a problem in realtime  setups as scans that that take longer than 10hz will cause skipped frames.  This can cause the odometry algorithm to fail to process the scan and cause the odometry to be unstable and fail. This happens with the 8 core cpu implementation but not with the 8 core implementation when used in real time.  The gpu implementation is able to solve this with only a few outliers that exist over 10 hz but it does with only 10 runs being over 10 hz threshold. This succeds in preventing skipped frames and allows the odometry algorithm to run at 10 hz. 

The histogram shows a different version of the tailend distribution issue which is that a miniscule amount of readings have a processing time to break the algorithm and prevent it from running at 10 hz. The gpu version has a miniscule amount of readings that take longer than 10 hz but the 8 core cpu version has a miniscule amount of readings that take longer than 10 hz. This opens up overhead on to run other programs and algorithms on the cpu that may be needed for the odometry algorithm to run at 10 hz. 

![results](https://github.com/torn8to/portfolio/blob/master/src/content/blog/iamges/gpu_icp/zoomed%20histogram.png?raw=true)
An interesting side note is that in low iteration icp the cpu based method is actually faster than the gpu based method. This is because of the overhead of copying the data to the gpu. but each iteration of the icp algorithm is faster on the gpu on average by 3.76x faster for each icp iteration. This opens up overhead for global optimization to take place along side the odometry algorithm. enabling the definition of a more accuarate gloabl map.   

# citations
Journal Article (SLAMCast):
[1] P. Stotko, S. Krumpen, M. B. Hullin, M. Weinmann, and R. Klein, "SLAMCast: Large-Scale, Real-Time 3D Reconstruction and Streaming for Immersive Multi-Client Live Telepresence," IEEE Transactions on Visualization and Computer Graphics, vol. 25, no. 5, pp. 2102–2112, May 2019.
arXiv Preprint (stdgpu):
[2] P. Stotko, "stdgpu: Efficient STL-like Data Structures on the GPU," arXiv:1908.05936, Aug. 2019. [Online]. Available: https://arxiv.org/abs/1908.05936

Blog Post:
[3] D. Juenger, N. Iskos, Y. Wang, J. Hemstad, C. Hundt, and N. Sakharnykh, "Maximizing performance with massively parallel hash maps on GPUs," NVIDIA Developer Blog, Mar. 6, 2023. [Online]. Available: https://developer.nvidia.com/blog/maximizing-performance-with-massively-parallel-hash-maps-on-gpus/. [Accessed: Oct. 2, 2025].

Documentation:
[4] NVIDIA Corporation, "CUDA Toolkit Documentation," 2025. [Online]. Available: https://docs.nvidia.com/cuda/. [Accessed: Oct. 14, 2025].