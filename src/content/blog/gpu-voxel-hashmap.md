---
title: GPU SparseVoxel HAshmap
description: Building and developing a lidar odometry pipeline
tags: Point Cloud Processing, C++, Thrust, Cuda
date: 2025-09-15
---

# overview
- why changing the voxel hashmap could be beneficial
- Benefits of gpu programming
- the paradigm 


# Why it could be better  
The goal of this is to reimplemnt the voxel hashmap using cuda gpu my hardware is limited to the 3060 laptop card and the a 16 core amd 6800h as processor.  This is a test into the space of whether or not a using the gpu could improve performance on the icp algorithim as currently when running on all 16 of the laptop cores it smoothly with a 10hz spinning radial lidar.  I want to see if performance improvements can be made by using a gpu can reduce latency.

# the changes
To implement this i'm relying on the thrust to dispatch the code their are issues that change the implemntation due to the dataype selection i'm using the dynamic map from the cucollections.  Then i will be using teh same math library eigen as of 3.4 it is cuda compatible. In this I'm experimenting with thrust which is a parrallel algorithims library.  One of the issues that change the code becuase of Hashmap we use that cause max points perv voxel to be decided at compile time. 

# methodology
The for the individual icp test is we will rely on the icp to iterate through the kitti algorithim we until we reach the desired frame from which we will copy into both a Hashmap on the cpu and and gpu we will check that the individual voxels hold the same points. then we will take a point cloud from the next frame in kitti icp without motion deskewing downsample to .25m boxes with a randomly sampled point on cpu copy over to the gpu then perform one iteration of icp time repeat the sampling and at this point in the odometry algorithim 100 times at each stop mark and compare the time avg and and std deviation.
 
# results


# citations
D. Juenger, N. Iskos, Y. Wang, J. Hemstad, C. Hundt, and N. Sakharnykh, “Maximizing performance with massively parallel hash maps on GPUs,” NVIDIA Developer Blog, Mar. 6, 2023. [Online]. Available: https://developer.nvidia.com/blog/maximizing-performance-with-massively-parallel-hash-maps-on-gpus/
. [Accessed: Oct. 2, 2025].

NVIDIA Corporation, “CUDA Toolkit Documentation,” 2025. [Online]. Available: https://docs.nvidia.com/cuda/
. [Accessed: Oct. 14 , 2025].

