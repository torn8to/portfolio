---
title: Lidar Slam 
description: Building and developing a lidar Slam system
tags: Point Cloud Processing, C++, Thrust, Cuda
date: 2025-12-22
github: https://github.com/torn8to/simple-lidar-odometry
owner: torn8to
repo: pcl_lib
draft: true
---
# SLAM (draft)
The issue we have the lidar slam challenge is that the odometry system while it does provide good results stuggles with contiuous accumulation of drift and error While this can be combatted. To combat this we try to implement a process called slam in which we build out a global data base of meausrement to rectify accumulation of error over long duration odometry. This allows us to find the global position and rectify the path of the robot via a pose graph.  This is useful as a more accurate global pose allows for an easier detection of pose with in a global map simplifying navigation between two places. While what follows will be a pure lidar based on lidar readings.

## How to match

In the literature their are a few ways of matching lidar data one is scancontext (tro) which relys on sensor specific modeling comparing output between lidar scans. While the original implementation mostly invoved converting to a radial signal in the polar sphere based for aligning and detecting matching areas.  The next area that shows promise would be uisng encoding the local area into Birds eye view (BEV) image.  This involves building a map and envoding the point into an image viewed down vertically the originally used way is using the max pixel height encoded tothe image. Kiss Slam chooses an alternative using a density based function based in which you envode the amount of points in a vertical.  They do this as this keeps alot of structural information that would normally be degraded in max version of the birds as surface orientation matters.
![https://github.com/portfolio/src/content/blog/Backend/bev_density.png]

## Pose Graph optimization

# experimentation

# results


# citations




