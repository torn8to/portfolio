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
An icp as a simple algorithm at its simples is an alignment of center of mass calculation.  Aligning points between two clouds and getting a transformation matrix that represents the change in space between the two bodies. The transformation is what provides our new odometry position for each iteration. There are many formulations of the icp algorithim using different formulations using information derived factors instead of just points point clouds such as planes and normal vectors.  While the icp implementation I used is just a point to point formulation. The other methods produce good results and are often used to make up for the short coming of point to point icp. The reason we use a point to point is i wanted to write my own imlementation to better understand the math (lie algebra). As such most of math we exist in the lie group SE3 as we are trying to perform odometry over lidar sensors in 3d space.  point to point icp is considered to be robust but adding a weighted term based on the output.  In the pure lidar odometry setup we use the deviation from the output of our motion model in the tightly coupled Lidar Inertial odometry case we use to influence the the kernel scale to alter the kernel scale and change how points are weighted.

$$
     w  = \frac{ks}{ks + P_{\text{residual}}}
$$

## sparse voxel hashmap 
The datastructure we use for efficient lookup is the A sparse voxel hasmap where a voxel is a square region of space that we store N points of a voxel and when lookup nearby points we get the voxel the point exists in and 3x3 grid a round that voxel and find the point stored in with the least distance.  The limitations of this form come with fast lookup times for a smaller number of points but as load factor increases in unordered_map the time it takes for lookup increases drastically. As such we use store this for local point maps keeps near the best case inference times of the map datastructure.

#  Lidar Odometry Pipeline
Out side of the icp implementation we need to develop ways of improving performance to improve performance and compensate for lidar behavior.  the easiest way to improve performance is to incorporate motion models to update where we think the sensor is between updates and compensating as such. As the lidar most commonly used in robotics is a spinning lidar the gathering of 3d data takes time from front to end the biggest in a 10hz lidar that an happen over about 100 ms. Their are other factors such as downsampling the input to reduce the number of points being input to the icp algorithims but this will be skipped as decisions made here are skpped for brevity.

## motion models 
In Lidar odometry because of the delay between readings a lot can happen as mobile robots move need some way of updating the robot state between readings to update the sensor usually we can integrate the lidar odometry algorithim by brining in a higher update source of odometry This commonly is imu data or  wheeled odometry algorithims which update much more quickly usually 100 to 400 hz. The imu data usually requires preintegration to convert angular velocity and linear acceleration readings into an odometry output to be integrated as an update. Imu data usually comes out at a much higher rate than 400 hz but preprocessing is dones as raw imu readings can be very noisy and accumulate error very quickly.  While we will not be integrating for the purpose of this report this is an easy way to improve performance as many sensor intake platforms have these available.  I use a motion model that assumes that the lidar will travel very similarly to the last update. We take the delta of the last transformation and its previous state as a new guess. This reduces the amount of icp iteration on a robot  substantially. This really only works with robots that do not have high acceleration deltas and move predictably based on their last input, this model falls apart and hurts performance when and accuracy when working with handheld data intake platforms. But for the Kitti 360 dataset the results work very well which is based off a car.

![Using a motion model with a hand held data intake platform](
    https://github.com/torn8to/odom_ws/blob/master/media/output.gif?raw
    ) gif of the hand held construction site with motion model

## deskewing sensor reading
Using the motion model we essentially allows us to deskew points and provide an update  more reliable measurement.  Thsi is done by taking the last transformation and our new guess using the best guess whihc both exist in SE3 space. we then convert the difference between these two space too the tangent space of SE3 denoted by se3 (notice the lower case). Which after normalizing a the point cloud timestamps and multiply by the tangent in the se3 space to deskew our sensor reading this can make big differences as if the robot is moving at linear velocity of 5 m/s and the lidar update at 10hz the raw point and our guess is accurate it can move points about a .5 meters in space.  

![](https://github.com/torn8to/odom_ws/blob/master/media/odometry/plot_trajectories.png?raw)

## constraing Voxel Hashmap to the local map
An isssue with this data structure is that its performance drops off drastically as the number of points increases and the number of voxels increase as the lookup times get away fro the best case and average case and move towards the worst case which balloon in performance drops. This requires us to keep the datastructure to function as a local map and remove points that are far away as it will impact the performance of the algorithm.  

## Kitti 360 demo and analysis
Demonstration of the Lidar odometry algorithim is happening on the kitti 360 dataset this is time synchronized data attached multi modal data stream combining cameras IMU/GPS and 360 degree lidar data.  we will be measuring the accumulation of error use two metrics to measure the accumulated error of the odometry algorithim absolute translation error and absolute rotation error as well as visual map comparing ground truth with the path of our odometry output over a few sequence of the kitti dataset. 
@[Youtube]()

## Hilti Slam datset observations
AS i was unable to provide numerical evaluations or graphical showing of this dataset as it is unable to compare it to the ground truth it provides two different platforms a handheld and chassis model. So this will be the equivalent of the steroid sniff test but this does show some of the issues with such some of the shortfalls with parameter tuning and the necesty when it comes to non linear motion models.  On the handheld device we ran into inital issues as the motion model incorrectly predicted motion harming the accuracy and scan to map icp runtime adding tightly coupled imu intergration using the imu to update the position prior as the inital guess for registration. and using the imu preintegrated to deskew the data improved performance drastically. Issues post imu came from noisy sensor data and more performance can be eeked out by providing better registration times converging more often.  Then in robotics system which uses of the hilti slam dataset ist uses a hemispherical lidar. The lidar odometry fronthand had issuesand changes to the voxelization system and the way points are added to maps is changed and Exposed some of the problems with the front.  There were issues as  some of the runs in the dataset do not have a warmup period that skew the results of the accuracy for all preceding measurements. 

# Conslusion
Their are improvements that can be made here to tighten errors such a parameter tuning of the , but as of right now we have a reliable lidar odometry frontend that can be plugged into with a loop closure backend and pose graph optimizer to alter the perfomance and reduce. The use of an Adaptive Ropbust kernel that contols outlier regjection improves performance and makes a reliable point to Point icp that can be used with odometry.  This method also has few tunable parameter making it simple and easy to tune. This is not without its drawback it currently struggles with the small voxel sizes under .5 meter, Their is a sizable map warmup time and with hemispherical lidar sensor the robust kernel can ignore non planar items during the algorithims warm up period impacting results

# citations

ct icp 
kiss icp 
adaptive robust kernels 
Kitti360
