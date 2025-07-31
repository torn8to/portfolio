---
title: Teaching a quadruped to walk using reinforcement learning
description: This post is a walkthrough making and teaching a robot to walk 
tags: markdown, demo, svelte
date: 2025-07-15
---
In recent years the building of robotics and parrallelization have made improvementes in parrallel computations and deep learning have opened up tasks that were once considered impossible. In this article will go through the process of training the go2 robot to walk in the world on unkown surfaces.

# Problem Overview
In this article we go over the task of  creating a control policy mapping observations to actions.  We will learn this policy using reinforcment learnning.  The User command is passed to the observations space along with the internal robot state, generating new actions continuing the loop. Out observations space is user commands ie the intended direction of movement, internal states such as motor position and velocity.

This is really difficult as the robot has quite a few tasks one is keep the robot stable. move the legs in a way that propels the robot in the intended direction of travel issues by the user commands and do that smoothly.  All training for this project was done on 8 core amd 6800H processor and an nvidia 3060 laptop chip. Desired training outcomes were usually an overnight training session running on the laptop about 10 hours.

# Policy
Normally for a control policy you would have a hard coded algorithim with parameters optimized for the use case. in our case we will be using a model to control the robot instead.  To do this in a timely manner this requires high throuput space such as a simualtor in our case we are using the genesis simulator which allows you to plugin multiple types of physics solvers enabling use cases for rigid and sf body physics.  

The next part is how do we train the model as we need to figure out how to finetune the model this will be done with using proximal policy optimization. We are using ONPOolicy runnner as it provides more stable results and 

# Reward Functions
The way we tune our algorithm is using reqard functions thes come in a few forms either being an end condition when the robot is in a irrecoverable position, performance metrics and penalties.  We use these to guide out comes to a desired goal. The reward function is an amalgamation of a few terms to determined desired behavior. 

The first is a reward for moving the desired direction of travel of the main body link of the quadraped.  

## Velocity Reward
$$
R_{\text{lin\_vel}} = \exp\left(-\left\| v_{xy}^{ref} - v_{xy}^{actual} \right\|^2\right)
$$

where $ v_{xy}^{ref}$ is the intended velocity on the x and y axis and $v_{xy}^{actual}$ is the simulated robots measured velocity.

## Angular Velocity Reward
$$
R_{\text{ang\_vel}} = \exp\left(-\left\| \omega_{z}^{ref} - \omega_{z}^{actual} \right\|^2\right)
$$


## Vertical Velocity Penalty
This term was introduced to penalize the robot for unwanted movement along the z-axis (vertical direction).

$$
R_{\text{lin\_vel\_z}} = v_{z}^2
$$

## vertical height penalty 
This penalty was introduced to prevent the robot from crawling during early stages of training as this prevents us from finding the desired behaviors of the model.
$$
R_z =  -(z_{\text{actual}} - z_{\text{ref}})^2
$$

## Action Rate Penalty
This penalty adds a slight penalty for large differences in action that would create as a way to discourage abrupt changes. $ \alpha_t$ denotes action at current time and  $\alpha_\text{t-1}$

$$
    R_{\text{actions}} =  (\alpha_{t} - \alpha_{\text{t-1}})^2
$$

# Environment Randomization 
One of the issues with a training a model for control policies is that you do not know inlcudeing environmental factors and internal factors of sensors and actuators. To improve performance of the model when envcountering different situations we randomize the environment and add parameters.

- **Physical Parameters:** Energy consumption of motors, Motor volatage and frictions as well as link mass.

- **Sensor Noise:**  Adding Noise to sensors such as randomizing imu bias, and noise walk 

- **Random Applied Forces:**  Applying rnadom forces to improve robustness sudden forces beiing applied to che chassis such as being pushed

- **Environmental Factors:** This includes creating more environments that have randomized factors such as rnadom tileable environments, other moving items, and randomized floor friction forces.

Training with these parameters will hurt algorithims ability to converge as it has a sparser reward function this requires more episodes more computation.  Thw trade-off for this is creating a more robust control policy this improves real world performance. Than the originla policy that is not exposed to these factors that are moddled on the real world.  


## Rapid Motor Adaptation
The previous policy did not give us the perofmance that i wanted, so i sourced an idea from research that improved adaptation of policy's to different environmets. This adds a module on top of the existing Module that we use to generate the robot walking movements. This takes in the previous observations at t-1 to t-51 to generate an output that is plugged into the observations of the walking policy

## Real World Demo
![Video](https://github.com/torn8to/portfolio/blob/master/src/content/blog/iamges/rl_locomotion/locomotion_real.mp4?raw=true)

## Citations
**(2021) Ashish Kumar**  RMA Rapid Motor Adaptation for Legged Robots

**Hugging Face RL Course** https://huggingface.co/learn/deep-rl-course/unit8/introduction

**(2018) Jie Tan** https://arxiv.org/pdf/1804.10332

**(2020) Xue Ben Peng** https://arxiv.org/pdf/2004.00784 