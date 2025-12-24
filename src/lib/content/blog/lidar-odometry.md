---
title: Lidar Odometry Pipeline
description: Building and developing a lidar odometry pipeline
tags: Point Cloud Processing, ROS2, C++
date: 2025-09-30
github: https://github.com/torn8to/pcl_lib
owner: torn8to
repo: pcl_lib
---

# Video
<iframe width="560" height="315" src="https://www.youtube.com/embed/_HwBUZM7TRw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>   

# Problem Overview  
Lidar odometry is the process of using either 2d or 3d lidar data to use as a way to update track the movement of a robot through space.  The back bone of this is done via iterative closest point algoirithim (icp) or similar algorithims that match and align structural data to develop and build.  To gain a better understanding im going to reimplement the kiss icp pipeline.

## Iterative Closest Point (icp)
An icp as a simple algorithm at its simples is an alignment of center of mass calculation.  Aligning points between two clouds and getting a transformation matrix that represents the change in space between the two bodies. The transformation is what provides our new odometry position for each iteration. There are many formulations of the icp algorithim using different formulations using information derived factors instead of just points point clouds such as planes and normal vectors.  While the icp implementation I used is just a point to point formulation. The other methods produce good results and are often used to make up for the short coming of point to point icp. The reason we use a point to point is i wanted to write my own imlementation to better understand the math (lie algebra). As such most of math we exist in the lie group SE3 as we are trying to perform odometry over lidar sensors in 3d space.  point to point icp is considered to be robust but adding a weighted term based on the output.  In the pure lidar odometry setup we use the deviation from the output of our motion model in the tightly coupled Lidar Inertial odometry case we use to influence the the kernel scale to alter the kernel scale and change how points are weighted.

### Formulating the jacobian
To libnearize the problem we need to formualte the jacobian to linearize the system. our input to the jacobian is tx, ty tz rx ry rz which is the tangent of the se3 space relative to the source coorespondence and our output is in the form of difference in source and target coorespondences colloquially called the residual .  This output is dependent upon the dimension of the space but  for ours it is 3 dimensional space as we areddoign icp. the first part of the hjacobian is an idenity matrix as the tx ty tz relative to the residual evaluates to a contant as is just (x y z) respectively.  The second part of the jacobian is more complicated as it is. we need to parital derivatives rx ry rz realtive to x y z. luckily for us we in lie algebra we have a way to get the hat operator which allows us to -1 * hat of the source get us the derivative of the rotation relative to the the source cloud. This completes our jacobian.

### kernel scale
Kernel scale is a way to build a an adapable uncertainty meausrement into weighting outliers in weight a point when building a linear system based on kernel scale in our case a scalar value that weight the effect of magnitude of the residual making points with higher deviation having less weight and point with less magnitude worh more and the kernel scale is a way of controlling outlier weighting for the transform. Using a loss function with the kernel scale allows us to modify value provided to kernel scale based on the previous input. I just copied the loss function from kiss-icp more can be read about it in. 


$$
    w  = \frac{ks}{ks + P_{\text{residualNorm}}}
$$

### sparse voxel hashmap 
The datastructure i use for efficient lookup is the A sparse voxel hasmap where a voxel is a square region of space that we store k points of a voxel and when lookup nearby points we get the voxel the point exists in and 3x3 grid a round that voxel and find the point stored in with the least distance.  The limitations of this form come with fast lookup times for a smaller number of points but as load factor increases in unordered_map the time it takes for lookup increases drastically. As such we store this for local point maps instead of for global. (cite the adpative voxelizaton paper)

#  Lidar Odometry Pipeline
Icp is not the only part of the odometry pipeline they are a few components that overlay the icp algorithim that allow us increase the speed and accuracy of processing a measurement. This comes in the form of motion models, point deskewing and point sampling strategies.  

## motion models 
In Lidar odometry because of the delay between readings a lot can happen as mobile robotgif of the hand held construction site with motion model.  The motion model we use is from kiss-icp their constant motion model which assumes that the motion between each lidar pose is similar as in most cases when existing on the period of a lidar scan motion is similar. This model has issues when used chassis with a chassis but when used on less stable motion platforms, such as a handheld platform. 

$$
    \Delta EM_{t+1} = P_{t-1}^{-1} * P_{t}
$$
$$
    EP_{t+1} = \Delta EM_{t+1} * P_{t}
$$

This fails when the motion between scans differs to great causing the odometry to fail. This can be corrected by using promper imu integration either through a preintegration or a kalman filter. This will not be covered in this writing.
![Using a motion model with a hand held data intake platform](https://github.com/torn8to/odom_ws/blob/master/media/lidar_odom.gif)
if gif is not loading try this [link](https://github.com/torn8to/odom_ws/blob/master/media/lidar_odom.gif)


To make up for this we use imu preintegration which is allows us to take preferably processed imu measurements and build higher frequency odometry to inform lidar odometry. thsi gets plugged in simiilarly to the aforementioned kiss icp constant motion model. The imu output is fused for point deskewing and as an initial guess for point deskewing.

## deskewing sensor reading
Deskewing sensor readings happens due to the nature of multi dimensional lidar sensors collect data.  They spin at a constant rate and based on predicted motion pattern via the contant motion model. this can be done by normalizing the time stamps and converting the estimated change in pose converting it to the log of the pose and multiplying by the normalized timestamp().  we multiply the log by the normalized timestamp and convert to the exponential map to arrive at the compensated motion point. 

# results and analysis
The section below we will go over a graphical and numerical analysis of the point method.  The hardware this was run on was the amd ryzen 6800h running in balanced power mode with the cores averaging about the lidar odometry is running on 16 cores, with an nvidia 3060 laptop card with 6gb of vram.  The odometry algorithim was run in ros2 using the constant motion model.  Data was quantitatively analyzed using the evo toolkit by Michael Grupp.

## kitti360 dataset 
Below is a plot of the odometry trajectories. v. the ground truth on the kitti 360 dataset odometry results.  This dataset we have ground truths and read the odometry readings.  Align the first frame of the data on the ground truth and then we draw the paths on to the image and evaluate the the rotation and translation errors of the odometry algorithm. in the evo traj tool box we use to tools the ape and rpe. For evaluation for absolute trajecotry error and relative rotation error we downsample the data down too 2000 samples. This is required as the number of poses in the data collection and the ground truth do not match. The Kitti360 dataset does not have timestamps recorded in the point cloud as such motion compensation is not running.

![a plot of trajectory of the odometry algorithim on kitti 360](https://github.com/torn8to/portfolio/blob/master/src/content/blog/iamges/odometry/plot_trajectories.png?raw=true)

The figure above that we can see is a un colored reference where ground truth is in the dotted line.  We see a consistent under turning of the lidar odometry model and this error propogates even more on the straight aways. a Visual inspection in rviz notes that we run into an issue alignment struggles to match on tight turns especially when it reaches the a higher amount of iterations for icp closure.

###  translation and rotation error
| Metric | Absolute translation Error (M) | reative translation error (rad) |
|:--------|---------------:|------------:|
| max     | 270.917181     | 0.644514 |
| mean    | 104.885192     | 0.082769 |
| median  | 97.903733      | 0.033575 |
| min     | 0.000000       | 0.000568 |
| rmse    | 123.030679     | 0.132017 |
| sse     | 30273096.023512| 34.839502 |
| std     | 64.308978      | 0.102848 |


![a plot of trajectory of the odometry algorithim on kitti 360](https://github.com/torn8to/portfolio/blob/master/src/lib/content/blog/iamges/odometry/ate_map.png?raw=true)


![a plot of trajectory of the odometry algorithim on kitti 360](https://github.com/torn8to/portfolio/blob/master/src/lib/content/blog/iamges/odometry/ate_raw.png?raw=true)


In translation errror we see that on the overall their is a large progressive growth in error over time that while errors occur on some longer straight aways and do recover the overall trend is as the more distance travelled we se greater error.  While the maxes are earlier on the and their is recover the consitent accumulation error pushes it away from the ground truth. 


![a plot of trajectory of the odometry algorithim on kitti 360](https://github.com/torn8to/portfolio/blob/master/src/lib/content/blog/iamges/odometry/plots_map.png?raw=true)


![a plot of trajectory of the odometry algorithim on kitti 360](https://github.com/torn8to/portfolio/blob/master/src/lib/content/blog/iamges/odometry/plots_raw.png?raw=true)

In the rotation error plots we see a consistent low error when it comes to the straight aways with a few areas that show rotation error.  This heavily apparent when the car does 180s and takes turns. This is a result of error in the motion model and and tight turn causes the point deskewing to be off. An initial guess to be off drastically causing more icp iterations or the convergence criteria can not be met. whihc prevents other clouds from being processed.

# Full Kitti360 Dataset Quantitative


| Kitti360 run | ATE (m) | ROE (radians) |
|:--------|---------------:|------------:|
| 0000    | 270.917181     | 0.644514 |
| 0002    | NA             | NA       |
| 0003    | 270.917181     | 0.644514 |
| 0004    | 104.885192     | 0.082769 |
| 0005    | 97.903733      | 0.033575 |
| 0006    | 270.917181     | 0.644514 |
| 0007    | 104.885192     | 0.082769 |
| 0009    | 97.903733      | 0.033575 |
| 0010    | 123.030679     | 0.132017 |


*The data would not run properly as it was missing lidar points redownloading the dataset did not fix the missing point issue.

![a plot of trajectory of the odometry algorithim on kitti 360](https://github.com/torn8to/portfolio/blob/master/src/lib/content/blog/iamges/odometry/ate_map.png?raw=true)  


![a plot of trajectory of the odometry algorithim on kitti 360](https://github.com/torn8to/portfolio/blob/master/src/lib/content/blog/iamges/odometry/ate_raw.png?raw=true)


In translation errror we see that on the overall their is a large progressive growth in error over time that while errors occur on some longer straight aways and do recover the overall trend is as the more distance travelled we se greater error.  While the maxes are earlier on the and their is recover the consitent accumulation error pushes it away from the ground truth. 


![a plot of trajectory of the odometry algorithim on kitti 360](https://github.com/torn8to/portfolio/blob/master/src/lib/content/blog/iamges/odometry/plots_map.png?raw=true)


![a plot of trajectory of the odometry algorithim on kitti 360](https://github.com/torn8to/portfolio/blob/master/src/lib/content/blog/iamges/odometry/plots_raw.png?raw=true)

In the rotation error plots we see a consistent low error when it comes to the straight aways with a few areas that show rotation error.  This heavily apparent when the car does 180s and takes turns. This is a result of error in the motion model and and tight turn causes the point deskewing to be off. An initial guess to be off drastically causing more icp iterations or the convergence criteria can not be met. whihc prevents other clouds from being processed.


# conclusion
I've implemented a point to point lidar odometry algorithims that can efficiently run in realtime on my laptop. It can perform odometry in realtime with little parameter finetuning. Their are still many ways to improve the algorithm as we briefly touched on aparts where the odometry algorithim struggles but this could be helpful such as opening up reliable performance for enabling multiple sensor configurations to work reliably.  In implementation of the algorithims on the gpu is ripe for massive speed due to the highly parallel nature of gpus can work well with the nature of hashmaps and the higly non sequential nature of many of the procedures enables a performance boost in implemnting the datastructures and algorithims on the gpu.
Implementing loop closure detection with pose graph optimization will provid drastic improvements to accuracy and reduce the accumulation of pose error that comes from persistent operation.

# Citations
N. Chebrolu, T. Läbe, O. Vysotska, J. Behley, and C. Stachniss, “Adaptive robust kernels for non-linear least squares problems,” arXiv preprint arXiv:2004.14938, 2020.

I. Vizzo, T. Guadagnino, B. Mersch, L. Wiesmann, J. Behley, and C. Stachniss, “KISS-ICP: In defense of point-to-point ICP – Simple, accurate, and robust registration if done the right way,” IEEE Robotics and Automation Letters, vol. 8, no. 2, pp. 1029–1036, Feb. 2023, doi: 10.1109/LRA.2023.3236571.

H. Lim, D. Kim, B. Kim, and H. Myung, “AdaLIO: Robust adaptive LiDAR-inertial odometry in degenerate indoor environments,” arXiv preprint arXiv:2304.12577, 2023.



# conclusion
I've implemented a point to point lidar odometry algorithims that can efficiently run in realtime on my laptop. It can perform odometry in realtime with little parameter finetuning. Their are still many ways to improve the algorithm as we briefly touched on aparts where the odometry algorithim struggles but this could be helpful such as opening up reliable performance for enabling multiple sensor configurations to work reliably.  In implementation of the algorithims on the gpu is ripe for massive speed due to the highly parallel nature of gpus can work well with the nature of hashmaps and the higly non sequential nature of many of the procedures enables a performance boost in implemnting the datastructures and algorithims on the gpu.
Implementing loop closure detection with pose graph optimization will provid drastic improvements to accuracy and reduce the accumulation of pose error that comes from persistent operation.

# Citations
N. Chebrolu, T. Läbe, O. Vysotska, J. Behley, and C. Stachniss, “Adaptive robust kernels for non-linear least squares problems,” arXiv preprint arXiv:2004.14938, 2020.

I. Vizzo, T. Guadagnino, B. Mersch, L. Wiesmann, J. Behley, and C. Stachniss, “KISS-ICP: In defense of point-to-point ICP – Simple, accurate, and robust registration if done the right way,” IEEE Robotics and Automation Letters, vol. 8, no. 2, pp. 1029–1036, Feb. 2023, doi: 10.1109/LRA.2023.3236571.

H. Lim, D. Kim, B. Kim, and H. Myung, “AdaLIO: Robust adaptive LiDAR-inertial odometry in degenerate indoor environments,” arXiv preprint arXiv:2304.12577, 2023.