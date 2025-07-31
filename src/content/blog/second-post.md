---
title: Fast Force sensor matrix
description: This post demonstrates more advanced mathematical notation using KaTeX
tags: c++, sqlite, python, javascript
date: 2023-08-20
---


# Architecting a Wireless Sensor System

The architecture of our wireless sensor system integrates several key components working in harmony. At the core, we
utilize the STM32H747XI microcontroller for efficient data collection and initial processing from various sensors. This
powerful dual-core processor connects to a compact single board computer that handles the wireless transmission of
collected data. The system features a touchscreen interface allowing users to configure WebSocket connections and monitor
real-time metrics. These WebSockets establish communication channels with a central server hosting both the web interface
and an SQLite database for persistent storage. The server broadcasts the processed sensor data across the network,
making it accessible through a responsive web UI that enables both qualitative and quantitative analysis. This
architecture enables users to view comprehensive sensor data from any laptop connected to the network, providing a seamless monitoring experience.

In a force matrix the simplest way to configure a force matrixfor relative force wheree instead of facing this requires the least amount of circutry but this makes are force reading not an absolute force value but relative intensities.  A relative force matrix is really simple it is an arrangement of resistors laid out as below.  
![Diagram](https://github.com/torn8to/portfolio_svelte/blob/main/src/content/blog/iamges/resistor_matrix.png?raw=true)


This configuguration only allow for relative intensities this can be easily demonstrated when looking at current flow. This is because the circuit lines are not isolated this means that when other pads are pressed down they effect the voltage rating. Below we ar using  2x2 force matrix with  drive line 1 (dl1) set to high at 3.3v with readline one conected to ground. one where all force are equal and one where the force applied is equal on all resistances. one where less force is being applied to the surrounding pads not being read.  This alters readings and wide distribution of forces effect resistance of the sensor

* arrows are in reverse flow currrent direction
![Diagram](https://github.com/torn8to/portfolio_svelte/blob/main/src/content/blog/iamges/resistor_matrix.png?raw=true)
Another aspect of the 


![Diagram](https://github.com/torn8to/portfolio_svelte/blob/main/src/content/blog/iamges/data_flow.png?raw=true)
## SBC and embedder processor setup and roles


The sensor nodes themselves represent a careful balance between power efficiency and computational capability. The sensor is made up of the power electronics to power the pad, a raspberry pi 4 2gb and arduino giga (stm32h747HXI) coonnected via serial. The giga has two cores an m7 as a primary and an m4 as a subprocessor, the m4 core is some one limited and cannot run Serial, but can run uart, adc, digital pins. AS such for our case since we are communicating with the SBC via serial we are using the m7 core to send serial and the m4 core for processing the data. Early on in the project their was an issue with through put of the sensor was lacking. we were reaching about 1/40th of the minimum desired speed of the sensor about 2hz There were a few reasons for this the amount of readings we need for a full pad was 768 pads total.

![Digikey DMA example](https://www.digikey.com/maker-media/d5573030-464f-4801-8de7-75c126d7f9a2)

To solve this a few changes were mad is making a ping pong dma buffer to access adc readings quickly enabling access to half the buffer while the other half gets written to.  This significantly improved speed significantly enabling a few hundred thousand adc when timed when with shifting across the matrix between the drive lines and the drain channels to direct current flow through the matrix. This in combination with a ping pong buffer that is twice the size of the matrix pad that that gets red in on the m4 core and  readings are converted using the dsp and simd to transmitted over serial on the m7. This enables a performance of 320hz across the matrix.     


![interweaved pad](https://github.com/torn8to/portfolio_svelte/blob/main/src/content/blog/iamges/IMG_0653.jpg?raw=true)


## Web application
The web-application is a sveltekit application using svelte keeping some of the be that facilitates the datanalysis and dataagumentation in frontend relying on client side javascript and wasm (used for opening up multithreading).  The goal of this code is to augment and provide reports info to the interaction and physical forces 