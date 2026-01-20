---
title: Rolling Shutter Literature Review
description: A literature review of research using and rectifying rolling shutter 
tags: Computer Vision, Deep Learning
date: 2026-01-15
---

Camera shutters come in two forms global and rolling. Global shutters capture the entire image at the same time, while rolling shutters capture the image line by line.  The line by line capture of rolling shutters causes causes visual artifacts.  These visual artifacts show up as warping and skewed lines in the image. This violates the assumptions of many computer vision algorithms. 


![Rolling Shutter Effect](https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Rolling_shutter_effect_animation.gif/250px-Rolling_shutter_effect_animation.gif)


# homography methods 
There is a series of methods to rectify rolling shutter images try these can replace or assist in the absolute pose estimation for viusal odometry and structure from motion algorithms. Thesese methods estimate the rectifcation of the image by estimating pose and velocity of the camera. the base method relies on 6 or 7 point associations to develop estimates of the camera parameters Enabling rectification of the image, There are a variety of methods that rely on imu [6] and those that solve for camera parameters double linear model [2]. Then more recent versions can solve for focal length and radial distortion [1]. To improve computational efficiency, other use relaxed computational models [4], first and double linear models, and iterative solutions [4]. These methods show improvements over p3p homography among such as the go pro action camera with handheld phone data showing greater stability and smoother motion over sequences of images.  

# deep methods
Other their are a few methods of deep methods to rectify rolling shutter images. single view, imu assisted single view [6], multi view [7], and nerf based methods[8]. These methods show promise in their ability to rectify rolling shutter images with greater accuracy.  pure single view methods show a lack of performaance but includeing modalitites such as imu have greatly improve the accuracy of single view methods of rolling shutter rectification.  This has been improved from the original methods of using a convolutional neural network and being replaced with a diffusion model. Multi view methods have consistently seen the best performance and extend to methods such as structure from motion.


# Hilti 2026 dataset 
The Hilti 2026 dataset [11] contains a few modilities from the dataset that are available to us the first being imu and two fisheye cameras. The fisheye cameras are 1472x1440 rolling shutter cameras attached with 200 degree field of views.  The camera is mounted on a pole to a back pack.  We are also provided with a ground truth trajectories and images of the floor layout as if it were from a bim model.  Ground truth trajectories are provide via lidar odometry as the challenge has not been formally announced they have not given us the lidar data. 

![Hilti 2026 bim model](https://github.com/Hilti-Research/hilti-trimble-slam-challenge-2026/blob/main/images/floor_to_occupancymap.png)
The environments contained in the dataset are mostly featureless construction sites with planar textureless walls.  With some geometric features such as concrete stairs and columns. There is also a man in the entire dataset walking around the site. The rolling shutter effects two things in this challenge one is localizing ourselves in the environment relative to the 2d data provided. The other is providing a stable trajectory for visual odometry as the rolling shutter effect causes the image to be warped and skewed. 

Also a few things to note from playback of the dataset is that the person does not move at a constant pace violating the strict assumptions of that our aformentioned homography methods make. Addresing the localization challenge relative to the 2d bim model compared to the absolute pose of the camera is a challenge in itself. If we need to derive information about the environment discrepencaies caused by the rolling shutter effect will be a source of error in the effecting the result of the images.

# conclusion









# references 

[1] Z. Kukelova, C. Albl, A. Sugimoto, K. Schindler, T. Pajdla, "Minimal Rolling Shutter Absolute Pose with Unknown Focal Length and Radial", European Conference on Computer Vision (ECCV) 2020

[2] C. Albl, Z. Kukelova, V. Larsson and T. Pajdla, "Rolling Shutter Camera Absolute Pose," in IEEE Transactions on Pattern Analysis and Machine Intelligence, 2019.


[3] C. Albl, Z. Kukelova and T. Pajdla, "R6P - Rolling shutter absolute pose problem," 2015 IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 2015.

[4] Kukelova Z., Albl C., Sugimoto A., Pajdla T. Linear Solution to the Minimal Absolute Pose Rolling Shutter Problem. Asian Conference on Computer Vision, 2018.

[5] Albl, C., Kukelova, Z., & Pajdla, T. (2016). Rolling Shutter Absolute Pose Problem With Known Vertical Direction. Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 3355–3363.

[6] J. Mo, M. J. Islam, and J. Sattar, "IMU-Assisted Learning of Single-View Rolling Shutter Correction," arXiv preprint arXiv:2011.03106, 2021.

[7] Vijay Rengarajan, Yogesh Balaji, A. N. Rajagopalan; Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 2017, pp. 2291-2299

[8] B. Zhuang, Q.-H. Tran, P. Ji, L.-F. Cheong, and M. Chandraker, "Learning Structure-And-Motion-Aware Rolling Shutter Correction," in Proc. IEEE Conf. Comput. Vis. Pattern Recognit. (CVPR), 2019, pp. 4551–4560.

[9] M. Li, P. Wang, L. Zhao, B. Liao, and P. Liu, "USB-NeRF: Unrolling Shutter Bundle Adjusted Neural Radiance Fields," in International Conference on Learning Representations (ICLR), 2023.

[10] D. Qu, B. Liao, H. Zhang, O. Ait-Aider and Y. Lao, "Fast Rolling Shutter Correction in the Wild," in IEEE Transactions on Pattern Analysis and Machine Intelligence, vol. 45, no. 10, pp. 11778-11795, Oct. 2023, doi: 10.1109/TPAMI.2023.3284847.

[11] Hilti Research, "Hilti x Trimble 360° Camera-Based SLAM Challenge 2026 - Early Release," GitHub repository, 2025. [Online]. Available: https://github.com/Hilti-Research/hilti-trimble-slam-challenge-2026



