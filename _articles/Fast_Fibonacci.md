---
layout: default
title: "Fast Fibonacci Calculations"
date: 2023-01-10
author: "Ben Kashouris"
image: /assets/images/Fibonacci_spiral.png
center_content: true
description: Calculating the n-th Fibonacci number in O(logn) using square and multiply
---

## Introduction
Calculating the nth fibonacci number is an absolutely classic computer science problem; one that has a lot of ways of doing it. What I’d like to explore is a particularly fast and, in my opinion, particularly interesting way of calculating, not just the fibonacci numbers, but any linear homogeneous recurrence relationship with constant coefficients in O(log n) time.

$$
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}^1
\begin{bmatrix}
1 \\
1
\end{bmatrix} =
\begin{bmatrix}
2 \\
1
\end{bmatrix}
$$

$$
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}^2
\begin{bmatrix}
1 \\
1
\end{bmatrix}=
\begin{bmatrix}
3 \\
2
\end{bmatrix}
$$

$$
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}^3
\begin{bmatrix}
1 \\
1
\end{bmatrix}=
\begin{bmatrix}
5 \\
3
\end{bmatrix} 
$$

$$
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}^4
\begin{bmatrix}
1 \\
1
\end{bmatrix}
=
\begin{bmatrix}
8 \\
5
\end{bmatrix}
$$

If we look at these matrices we see that we have our initial vector, with the two seeds of the fibonacci numbers. By multiplying through by the matrix we can shift the vector to make the vector show the next fibonacci numbers. 
In order to fully see why this works, let’s see what this matrix looks like when times by a vector with 2 components

$$
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}
\begin{bmatrix}
a \\
b
\end{bmatrix} =
\begin{bmatrix}
a + b\\
b
\end{bmatrix}
$$

If we set $$a = F_n$$ and $$b = F_{n-1}$$ the equation becomes

$$
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}
\begin{bmatrix}
F_n \\
F_{n-1}
\end{bmatrix} =
\begin{bmatrix}
F_n + F_{n-1}\\
F_n
\end{bmatrix} =
\begin{bmatrix}
F_{n+1}\\
F_n
\end{bmatrix}
$$

Therefore, inductively.

$$
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}^n
\begin{bmatrix}
F_m \\
F_{m-1}
\end{bmatrix} =
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}^{n-1}
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}
\begin{bmatrix}
F_m \\
F_{m-1}
\end{bmatrix} =
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}^{n-1}
\begin{bmatrix}
F_{m+1} \\
F_m
\end{bmatrix}
$$

$$
= \begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}^{n-2}
\begin{bmatrix}
F_{m+2} \\
F_{m+1}
\end{bmatrix}
= \begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}^{0}
\begin{bmatrix}
F_{m+n} \\
F_{m+n-1}
\end{bmatrix} =
\begin{bmatrix}
F_{m+n} \\
F_{m+n-1}
\end{bmatrix}
$$

So what we have is a way of representing the fibonacci sequence in matrix form. This is powerful because it changes calculating the fibonacci sequence to calculating one matrix to the power of the number we want to change our seed vector by. Followed by multiplying the recurrence matrix by the seed vector. So the question becomes not how fast can we calculate the fibonacci sequence but how fast can we exponentiate a matrix. It turns out we can calculate an exponentiate, using square and multiply, in O(log n) time. So our proposed algorithm for calculating the nth fibonacci number would also work in O(log n) time, blowing out of the water the O(n) time complexity of recursion with memorisation. 

## Brief tangent on the square and multiply <span style="font-size:0.6em">(aka exponentiation via squaring or binary exponentiation)</span>
Our problem is to calculate $A^n$. To understand the algorithm we need to understand what happens to our exponent when we do two key operations, squaring and multiplying. 
We note that when we square our number we double the exponent. Doubling a number in binary causes the number to have a bit shift to the left. For example:

$$
(3^4)^2 = 3^{2*4} = 3 ^ {2 * 100_2} = 3 ^ {1000_2}
$$

We can also see that when we multiply our number by its base we add $$1$$ to its exponent.
Now we have these two operations we can look at the key part of the algorithm which is to reconstruct the exponent by using these two operations in binary. For example, 
Lets calculate $$23^{13}$$.
The first thing to do is to convert the exponent to binary $$23^{13}=23^{1101_2}$$

| Square Or Multiply | Calculation       | X                         | Current exponent |
|--------------------|-------------------|---------------------------|------------------|
| Initialization     |                   | $$1$$                     | $$0_2$$          |
| Multiply           | $$X = X \cdot 23$$| $$23$$                    | $$1_2$$          |
| Square             | $$X = X ^ 2$$     | $$529$$                   | $$10_2$$         |
| Multiply           | $$X = X \cdot 23$$| $$12167$$                 | $$11_2$$         |
| Square             | $$X = X ^ 2$$     | $$148035889$$             | $$110_2$$        |
| Square             | $$X = X ^ 2$$     | $$2.191462443\cdot10^{16}$$| $$1100_2$$      |
| Multiply           | $$X = X \cdot 23$$| $$5.040363619\cdot10^{17}$$| $$1101_2$$      |


Which is indeed correct
 
Note that this algorithm can exponentiate any number that defines a “multiplication” operation and “exponentiation” operation. Further note that this algorithm runs in O(k) where k is the number of bits to form the exponent. Since a number N has floor(log N) bits this algorithm runs in O(log n) time.

## Getting back on track
So how do we calculate the 100th fibonacci number? So we know that we exponent by the number we want to shift the vector by so to get the top vector to be the 100th fibonacci number we want to calculate the vector.

$$
\begin{bmatrix}
F_{100} \\
F_{99}
\end{bmatrix} =
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}^{98}
\begin{bmatrix}
F_2 \\
F_1
\end{bmatrix} =
\begin{bmatrix}
1 & 1 \\
0 & 1
\end{bmatrix}^{98}
\begin{bmatrix}
1 \\
1
\end{bmatrix} 
$$

We can calculate
$$\begin{bmatrix}
1 & 1 \\
0 & 1 \\
\end{bmatrix}^{98}$$
With square and multiply which comes out as  
$$\begin{bmatrix}
21892299583455169026 & 13501852344706746049 \\
13501852344706746949 & 83621143489848422977
\end{bmatrix}^{98}$$
Finally we times this by our seed vector
$$\begin{bmatrix}
21892299583455169026 & 13501852344706746049 \\
13501852344706746949 & 83621143489848422977
\end{bmatrix}^{98}
\begin{bmatrix}
1 \\
1
\end{bmatrix}=
\begin{bmatrix}
354224848179261915075 \\
218922995834555169026
\end{bmatrix} $$

Which is indeed the
![Google search showing the 100th fibonacci number](/assets/images/100_th_fib_number.png)

So we could now create a log(n) algorithm that could calculate any fibonacci number wanted. But it would be a lot more useful if we could do this for any recurrence relation, to do that all we really need to work out is how to work out the recurrence matrix.

Let’s define a recurrence rule $$F_n=a_1F_{n-1}+a_2F_{n-2}+...+a_kF_{n-k}$$ We attempt to find the recurrence matrix $$A$$, which is a matrix such that

$$
A\cdot
\begin{bmatrix}
F_{n-1} \\
F_{n-2} \\
F_{n-1} \\
... \\
F_{n-k} \\
\end{bmatrix} =
\begin{bmatrix}
F_n=a_1F_{n-1}+a_2F_{n-2}+...+a_kF_{n-k} \\
F_{n-1} \\
F_{n-2} \\
... \\
F_{n-k-1} \\
\end{bmatrix}
$$

Given that the seed vector is $$k$$ by $$1$$ and the output vector is also $$k$$ by $$1$$, we know that $$A$$ must be $$K$$ by $$K$$.  
Given that the $$i j$$ entry of a matrix is the dot product of the row $$i$$ in the left matrix and the column $$j$$ in the right matrix. We can work out that the first row will just be the coefficients of the recurrence rule. The rest of the matrix will be $$1$$ on a diagonal.
Therefore,
$$A = 
\begin{bmatrix}
a_1 & a_2 & a_3 & ... & a_k \\
1 & 0 & 0 & ... & 0 \\
0 & 1 & 0 & ... & 0 \\
... & ... & ... & ... & ... \\
0 & 0 & 0 & ... & 1 \\
\end{bmatrix}$$

## Designing an algorithm
The implementation details of both square and multiply and matrix multiplication are beyond the scope of this post, instead we will pass these off to generic functions when necessary. 

Problem statement: Given a list, ‘coefficients’, of constants which represent the coefficients of the recurrence rule starting with Fn-1 and a list, ‘seeds’, of seed values starting with F1 find the nth term.

The very first thing to check is that the nth term asked for isn’t already one given in the seed value. 
``` 
def get_nth_value(coeffients: List[float], seeds: List[float], n: int)-> int:
    order = len(coeffients)
    if 1 <= n <= order: return seeds[n-1]
```
We then construct the recurrence matrix and the seed matrix.
The function Matrix here takes in a 2d list representing the values in the matrix and returns a matrix with those values that can be operated on. We know that the first row of values is just the coefficients of the relation rule. We know that the rest of the matrix is made up by the identity matrix shifted one position to the left. Or the identity matrix with everything shifted down one and the removal of the last row. So what we can do is construct a 2d list representing the identity matrix and then we can remove the last row and add it to the coefficients list.
```
    coeffients_matrix = Matrix([coeffients] + make_idenity_matrix_list(order)[:-1])
```
We then construct the coefficient matrix. The only thing to note is that we have to reverse the list since the recurrence rule and seed matrices are given in opposite orders.

We can now work on calculating the nth term. A nice way to visualise this next step is to think about the seed matrix being a slider on an infinite list of the terms of the sequence. If we wish to change the position of the slider we must multiply by the recurrence rule. We work out the amount that we must shift the slider in order to have the nth term on the first value of the slider. We then pass the exponentiation to square and multiply and finally times by the seed matrix. We can then just return the value in the top left.
```
    difference = n - order
    foo = square_and_multiply(coeffients_matrix, difference)
    final_matrix = foo * seed_matrix
    return final_matrix[0][0]
```

## A tiny last comment

Our current algorithm functions for positive values of N. But we can easily extend this to work for negative values of N. Going back to the slider metaphor, if we wish to slide the slider the opposite way how can we do this? Well we can multiply by the inverse of the recurrence matrix. 
Given that $$A^{-n}=(A^{-1})^n$$ it is actually sufficient to invert the matrix if the difference is negative. Adding this to our code we get the final algorithm.
```
def get_nth_value(coefficients: List[float], seeds: List[float], n: int) -> int:
    order = len(coefficients)
    if 1 <= n <= order: return seeds[n-1]
    seed_matrix = Matrix([[i] for i in seeds[::-1]])
    coeffients_matrix = Matrix([coefficients] + make_idenity_matrix_list(order)[:-1])
    difference = n - order
    if difference < 0:
        difference *= -1  
        coeffients_matrix = coeffients_matrix.inverse()  
    foo = square_and_multiply(coeffients_matrix, difference)
    final_matrix = foo * seed_matrix
    return final_matrix[0][0]
```
Thanks 🙂
