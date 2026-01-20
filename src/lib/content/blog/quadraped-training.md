---
title: Teaching a quadruped to walk using reinforcement learning
description: This post is a walkthrough making and teaching a robot to walk 
tags: markdown, demo, svelte
date: 2025-09-15
github: https://github.com/torn8to/go2_rl
owner: torn8to
repo: go2_rl
---

# Problem Overview
In this article we go over the task of creating a control policy mapping observations to actions. This is commonly referred to as a model predictive controller (MPC) in the literature.  We will learn this policy using reinforcement learning.  More specifically we use are using model based with a proximal policy optimization as the backbone algorithm. The User command is passed to the observations space along with the internal robot state, generating new actions continuing the loop. Out observations space is user commands ie the intended direction of movement, internal states such as motor position and velocity.

This is really difficult as the robot has quite a few tasks one is keep the robot stable. move the legs in a way that propels the robot in the intended direction of travel issues by the user commands and do that smoothly.  All training for this project was done on 8 core amd 6800H processor and an nvidia 3060 laptop chip. Desired training outcomes were usually an overnight training session running on the laptop about 10 hours.

# Sensors and Actuators
To support the policy on the robot we use a contact force sensors on the foot to detect contact with the ground, encoders for motor position and velocity, 6 axis imu. This are included in the go2 chassis. Another modality included in the chassis is lidar this is not included in the demo for simplicity sake. The sensors and actuators use noise models to simulate noise you would typically expect in the environment.

# Actor Critic
The basis of our policy is based on actor critic and proximal policy optimization.  Actor Critic relies on using two models an Actor the one that observes state and interacts with the environment and the Critic evaluates the quality of the actions taken by the actor.  This balances out the policy for a search and exploitation to find an optimal policy.  This comes about between the interactions of the actor and the environment.

![actorcritic](https://github.com/torn8to/portfolio/blob/master/src/lib/content/blog/iamges/rl_locomotion/act.png?raw=true)
# Reward Functions
The way we tune our algorithm is using reward functions thes come in a few forms either being an end condition when the robot is in a irrecoverable position such as falling over or a large deviation in orientation, performance metrics and penalties.  We use these to guide out comes to a desired goal. The reward function is an amalgamation of a few terms.

This combination of rewards is r to get the desired behavior we want for a performant policy.  This has to do with the getting the robot to move in the desired pattern with certain criteria. This includes the desired direction without extemporaneous movement and proper and stable movement.  Without these sub rewards the policy will settle on to a pattern that may satisfy the rewards but leads to a form of control we deem undesirable or suboptimal. The lack of these extra terms vertical velocity and vertical height penalty. Leads to a policy where the robot will try will move in a way that is not desired such as crawling or spazzing in the direction of travel.

## Linear Velocity Reward
$$
R_{\text{lin\_vel}} = \exp\left(-\left\| v_{xy}^{ref} - v_{xy}^{actual} \right\|^2\right)
$$

where $ v_{xy}^{ref}$ is the intended velocity on the x and y axis and $v_{xy}^{actual}$ is the simulated robots measured velocity.

## Angular Velocity Reward
$$
R_{\text{ang\_vel}} = \exp\left(-\left\| \omega_{z}^{ref} - \omega_{z}^{actual} \right\|^2\right)
$$


## Vertical Velocity Penalty
This term was introduced to penalize the robot for unwanted movement along the z-axis (vertical direction). This leads to a more stable main chassis during the policy.

$$
R_{\text{lin\_vel\_z}} = v_{z}^2
$$

## vertical height penalty 
This penalty was introduced to prevent the robot from crawling during early stages of training as this prevents us from finding the desired behaviors of the model.
$$
R_z =  -(z_{\text{actual}} - z_{\text{ref}})^2
$$

## Action Rate Penalty
This penalty adds a slight penalty for large differences in action that would create as a way to discourage abrupt changes to motor commands leading to a more energy efficient policy.
$$
    R_{\text{actions}} =  (\alpha_{t} - \alpha_{\text{t-1}})^2
$$
<iframe width="560" height="315" src="https://www.youtube.com/embed/Yozsxkf-_yU" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>   

# sim2real
## Environment Randomization 
One of the issues with a training a model for control policies is that you do not know inlcudeing environmental factors and internal factors of sensors and actuators. To improve performance of the model when envcountering different situations we randomize the environment and add parameters.

- **Physical Parameters:** Energy consumption of motors, Motor volatage and frictions as well as link mass.

- **Random Applied Forces:**  Applying random forces to improve robustness sudden forces beiing applied to the chassis such as being pushed or bumped.

- **Environmental Factors:** This includes creating more environments that have randomized factors such as random tileable environments, other moving items, and randomized floor friction forces.


The environmental randomization is the addition of Random Applied Forces and Environmental factors.   This is done to improve the policy performance and policy robustness by ensuring that the robot simualtion model is accurate to the real world environment

# Rapid Motor Adaptation
Improving upon sim2real with Rapid Motor Adaptation (RMA) to improve upon the policy performance in real world environments. We add an addition to the model part way through the training process which is adding an encoder that analyzes the state over the previous 50 iterations of the state and it adds it encodes an estimate of the enviromental parameters into the model in our case we just estimate the friction of the floor. This allows the policy to interperet envromental conditions and improving the policy performance when training with enviroment randomization, improving policy performance in real world environments.

# Training Schedule
To easily train the model we use a training schedule that allows us to train behaviors of the model smoothly to enable good convergence on the later stages of the policy. we train with a batch size of 4096 as the lower batch sizes do not converge well and larger batch sizes do not bring any additional benefits to training with a drawback of longer training times. This involves training on a flat world for the first 500 iterations on a flat world with env randomization. Then we switch to a world with random uniform terrains and continue training for 1

| stage | dynamic friction | random terrain | random sensor noise | random applied forces | iterations |
|---|---|---|---|---|
| 1 | - [ ] dynamic friction | - [ ] flat | - [ ]  | 500 |
| 2 | - [x] constant | - [ ] flat | - [ ] | 500 |
| 3 | 1 | 1 | 0 | 0 |
| 4 | 1 | 1 | 1 | 0 |
| 5 | 1 | 1 | 1 | 1 |


## Real World Demo
<iframe width="560" height="315" src="https://www.youtube.com/embed/xmJhrCm5OaE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>   

## Citations
**(2021) Ashish Kumar**  RMA Rapid Motor Adaptation for Legged Robots

**Hugging Face RL Course** https://huggingface.co/learn/deep-rl-course/unit8/introduction

**(2018) Jie Tan** https://arxiv.org/pdf/1804.10332

**(2020) Xue Ben Peng** https://arxiv.org/pdf/2004.00784 