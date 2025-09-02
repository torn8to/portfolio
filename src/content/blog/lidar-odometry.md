---
title: Lidar Odometry Pipeline
description: Building and developing a lidar odometry pipeline
tags: Point Cloud Processing, ROS2, C++
date: 2025-07-15
---

## overview
    -- what is lidar odometry 
    -- backbone is the icp method Datastructure and least squares implementation
    -- pipeline 
        -- motion models 
        -- point deskewing 
        -- lie algebra



# Problem Overview  
Lidar odometry is the process of using either 2d or 3d lidar data to use as a way to update track the movement of a robot through space.  The back bone of this is done via iterative closest point algoirithim (icp) or similar algorithims that match and align structural data to develop and build. 


## Iterative Closest Point (icp)
An icp as a simple algorithm at its simples is an alignment of center of mass calculation.  Aligning points between two clouds and getting a transformation matrix that represents the change in space between the two bodies. The transformation is what provides our new odometry position for each iteration. There are many formulations of the icp algorithim using different formulations using information derived factors instead of just points point clouds such as planes and normal vectors.  While the icp implementation I used is just a point to point formulation. The other methods produce good results and are often used to make up for the short coming of point to point icp. The reason we use a point to point is i wanted to write my own imlementation to better understand the math (lie algebra). As such most of math we exist in the lie group SE3 as we are trying to perform odometry over lidar sensors in 3d space. 

## sparse voxel hashmap 
The datastructure we use for efficient lookup is the A sparse voxel hasmap where a voxel is a square region of space that we store N points of a voxel and when lookup nearby points we get the voxel the point exists in and 3x3 grid a round that voxel and find the point stored in with the least distance.  Thsi provides new 

#  Lidar Odometry Pipeline
Out side of the icp implementation we need to develop ways of improving performance to improve performance and compensate for lidar behavior.  the easiest way to improve performance is to incorporate motion models to update where we think the sensor is between updates and compensating as such. As the lidar most commonly used in robotics is a spinning lidar the gathering of 3d data takes time from front to end the biggest in a 10hz lidar that an happen over about 100 ms. Their are other factors such as downsampling the input to reduce the number of points being input to the icp algorithims but this will be skipped as decisions made here are skpped for brevity.

## motion models 
In Lidar odometry because of the delay between readings a lot can happen as mobile robots move need some way of updating the robot state between readings to update the sensor usually we can integrate the lidar odometry algorithim by brining in a higher update source of odometry This commonly is imu data or  wheeled odometry algorithims which update much more quickly usually 100 to 400 hz. The imu data usually requires preintegration to convert angular velocity and linear acceleration readings into an odometry output to be integrated as an update. Imu data usually comes out at a much higher rate than 400 hz but preprocessing is dones as raw imu readings can be very noisy and accumulate error very quickly.  While we will not be integrating for the purpose of this report this is an easy way to improve performance as many sensor intake platforms have these available.  I use a motion model that assumes that the lidar will travel very similarly to the last update. We take the delta of the last transformation and its previous state as a new guess. This reduces the amount of icp iteration on a robot  substantially. This really only works with robots that do not have high acceleration deltas and move predictably based on their last input, this model falls apart and hurts performance when and accuracy when working with handheld data intake platforms. But for the Kitti 360 dataset the results work very well which is based off a car.

![ ]() gif of the hand held construction site with motion model

## deskewing sensor reading
Using the motion model we essentially allows us to deskew points and provide an update  more reliable measurement.  Thsi is done by taking the last transformation and our new guess using the best guess whihc both exist in SE3 space. we then convert the difference between these two space too the tangent space of SE3 denoted by se3 (notice the lower case). Which after normalizing a the point cloud timestamps and multiply by the tangent in the se3 space to deskew our sensor reading this can make big differences as if the robot is moving at linear velocity of 5 m/s and the lidar update at 10hz the raw point and our guess is accurate it can move points about a .5 meters in space.  

## constraing Voxel Hashmap to the local map
An isssue with this data structure is that its performance drops off drastically as the number of points increases and the number of voxels increase as the lookup times get away fro the best case and average case and move towards the worst case which balloon in performance drops. This requires us to keep the datastructure to function as a local map and remove points that are far away as it will impact the performance of the algorithm.  

## Kitti 360 demo and analysis
Demonstration of the Lidar odometry algorithim is happening on the kitti 360 dataset this is time synchronized data attached multi modal data stream combining cameras IMU/GPS and 360 degree lidar data.  we will be measuring the accumulation of error use two metrics to measure the accumulated error of the odometry algorithim absolute translation error and absolute rotation error as well as visual map comparing ground truth with the path of our odometry output over a few sequence of the kitti dataset. 

## improvement
Their are improvements that can be made here to tighten errors such a parameter tuning of the , but as of right now we have a reliable lidar odometry frontend that can be plugged into be used with pose graph optimization backend that can reduce the accumulation errors ans well as incorporate place descriptior for the function for detecting places the robot already has been and enabling a connectiion can reduce the accumulation error among enabling detection of a previous places. The ability of this algorihim to be used with other platforms can be improved by incorporating other sources to improve performance of the algorithim on different platforms. 

TODO finish conclusion
 


# citations
