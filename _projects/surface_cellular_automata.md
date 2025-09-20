---
layout: default
title: "Surface Cellular Automata"
date: 2025-03-08
author: "Ben Kashouris"
image: /assets/images/cellular_orb.png
description: A Cellular Automata that runs on the surface of an arbitrary 3d mesh.
center_content: true
---

## Introduction
Click [here](https://github.com/BenKashouris/Surface-Cellular-Automata) for the Github repository. <br>

The goal of this project is to run cellular automata on the surface of 3D objects. For example, the automaton can evolve directly on the surface of an icosphere (a sphere composed of triangular faces):
<img src="/assets/gifs/icosphere.gif" width="300" height="200">
The same approach works on any supplied mesh, such as a torus:
<img src="/assets/gifs/toros.gif" width="300" height="200">
In addition, the project can use a polygon unwrapping algorithm to flatten the mesh into a 2D representation:
<img src="/assets/gifs/icosphere_projected.gif" width="300" height="200">
This unwrapping is especially interesting because it lets us visualise the structure of the flat automaton in 3D. For example, a 2D grid with connected edges can be transformed into a torus. In fact, any two shapes that are topologically equivalent will produce the same automaton behaviour:
<img src="/assets/gifs/torus_projected.gif" width="300" height="200">

## Development journey
In terms of complexity, the 3D automata system was relatively straightforward to implement. I began by generating simple 3D shapes procedurally in code, which made early testing and iteration easy. Later on, I switched to loading .obj files for greater flexibility.

The core logic was simple: since 3D graphics already represent surfaces using triangles, all I needed to do was associate a state value with each triangle and identify its neighbouring triangles through shared edges. With that in place, implementing cellular automata became trivial; it just required running a rule for time evolution.

Where the project really became interesting, and difficult, was in “project mode”, the feature responsible for flattening a 3D mesh into 2D. This required careful reasoning about both geometry and topology. While the cellular automata logic was mostly local and self-contained, the unfolding algorithm had to consider global structure, ensure non-overlapping layout, and manage spatial constraints that weren’t present in the automata logic.

What started as a secondary feature, quickly became the central technical challenge of the entire project. 

### Attempted method for polygon unwrapping
My first idea was to pre-generate a flat 2D grid and traverse the 3D surface and the grid in the same order, before simply using the traversal visit index to form a bijection between the two.<br>
However, my major issue was ensuring that the traversal on the surface was deterministic. In the current implementation, the neighbours are stored unordered. In order for this method to work, I needed to find some local ordering. This would prove to be non-trivial. <br>
To address this, I implemented an ordering algorithm based on projected centroids. As below:
```
Input Face
Calculate the centroid of the face and the centroids of the neighbours of the face.
Calculate the plane that contains all 3 vertices of the face.
Project the centroids of the neighbours onto the plane.
Calculate the vector to the "right" of the face centroid.
    - Use the cross product of the input vector and the y-axis.
    - If the input is close to the y-axis, use the z-axis instead.
Project this "right" vector onto the plane.
For each neighbour, compute the angle between its projected centroid and the projected "right" vector.
Sort the neighbours to establish a consistent ordering.
```
This seemed to be working, in fact I ended up writing a entirely separate debug tool to check this.
The next step would be to build the flat mesh and traverse that. This I realized was going to be unsuited to the project as currently implemented, as it would involve making a huge quantity of faces in memory that might not be used, as well as having to potentially dynamically resize the grid as needed. <br>
This was the turning point. I chose to abandon this strategy and reformulate the problem.

### Actual method for polygon unwrapping
The algorithm I decided on works in 2 steps:
1. Construct a spanning tree over the mesh
2. Traverse the spanning tree to place triangles onto a 2D grid 

The motivation for building a spanning tree first is to eliminate cycles in the traversal order, which can otherwise cause overlapping triangles during unwrapping. By ensuring the structure is acyclic, we can always place a child triangle relative to its parent in a consistent and non-overlapping manner.


#### Step 1: Building the Spanning Tree <br>
We begin with a breadth-first search (BFS) traversal from an arbitrary root cell. Each time we discover a new neighbour, we record not only the parent–child relationship but also the shared edge between the two cells. This information is essential for the next step, where triangles are positioned relative to one another. <br>
The spanning tree is stored as a dictionary that maps each cell to a list of its children, along with the corresponding shared edge. <br>

#### Step 2 Traversing and Placing Triangles
The algorithm for this is fairly simple.
```
Start with the root triangle of Step 1: place this in 2D manually.
For each child/neighbour:
    Find the shared edge in 2D
    Compute the third vertex from the shared edge
    Store the new triangle in 2D
```

The main challenge is computing the third vertex. For any triangle, there are two possible positions for this vertex relative to the shared edge—“above” or “below” it. 

We resolve this using the winding order, which is the order in which a triangle’s vertices are stored. By convention, most 3D formats (like .obj) store vertices in counter-clockwise order when viewed from the outside of the mesh.

Our approach is as follows:
```
1. Identify the vertex in the 3D child triangle that is not part of the shared edge.
2. Determine whether this vertex lies clockwise or anticlockwise relative to the shared edge in 3D, with the winding order.
3. Use the same orientation to place the third vertex in 2D
```

By consistently applying this method throughout the traversal, we maintain the proper orientation of all triangles in the 2D projection. This keeps the mesh coherent and avoids flipped triangles, which could otherwise break subsequent processing.

Once we have the direction, it is a fairly simple process to compute the third vertex position on the grid. We simply take the shared edge vector and rotate it 60 degrees around the point we compared the winding order to, in the direction determined by the winding order.

This allowed for a unwrapping method that was suited for the project. 
Further details about the capabilities of this project and an installation guide can be found in the README of the github repo.