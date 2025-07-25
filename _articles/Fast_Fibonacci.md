---
layout: default
title: "Fast Fibonacci Calculations"
date: 2023-01-10
author: "Ben Kashouris"
image: /assets/images/Fibonacci_spiral.png
center_content: true
description: Calculating the n-th Fibonacci number in O(logn) using square and multiply
---

## Prelude
I wrote this article before starting my mathematics degree, so some parts may lack the clarity or formalism of more polished writing. That said, I believe the core idea to be interesting. I think this piece could be especially useful for students who are about to begin their own maths or computer science degrees. It shows how concepts from linear algebra can be applied to solve classic problems in an efficient way.

## Introduction
Calculating the nth Fibonacci number is an absolutely classic computer science problem, one that is notable because of it's wide range of algorithmic approaches that often are classic examples of such algorithms. What I would like to explore is a much faster and, in my opinion, particularly interesting way of calculating not just the Fibonacci numbers, but any linear homogeneous recurrence relationship with constant coefficients in O(log n) time.

### An interesting pattern

$$
\begin{bmatrix}
1 & 1 \\
1 & 0
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
1 & 0
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
1 & 0
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
1 & 0
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

Observing these results, a clear pattern emerges: the top row of the resulting vector corresponds to successive Fibonacci numbers.
To understand why this occurs, consider the role of the matrix and the initial vector. The initial vector contains the two seed values of the Fibonacci sequence, $$F_1$$​ and $$F2$$​. When this vector is multiplied by the matrix
it produces the next pair in the sequence. To see this in action, let us examine the effect of multiplying the matrix by a generic two-component vector:

$$
\begin{bmatrix}
1 & 1 \\
1 & 1
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
1 & 0
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
1 & 0
\end{bmatrix}^n
\begin{bmatrix}
F_m \\
F_{m-1}
\end{bmatrix} =
\begin{bmatrix}
1 & 1 \\
1 & 0
\end{bmatrix}^{n-1}
\begin{bmatrix}
1 & 1 \\
1 & 0
\end{bmatrix}
\begin{bmatrix}
F_m \\
F_{m-1}
\end{bmatrix} =
\begin{bmatrix}
1 & 1 \\
1 & 0
\end{bmatrix}^{n-1}
\begin{bmatrix}
F_{m+1} \\
F_m
\end{bmatrix}
$$

$$
= \begin{bmatrix}
1 & 1 \\
1 & 0
\end{bmatrix}^{n-2}
\begin{bmatrix}
F_{m+2} \\
F_{m+1}
\end{bmatrix}
= \begin{bmatrix}
1 & 1 \\
1 & 0
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

So what we have is a way of representing the Fibonacci sequence in matrix form. This is powerful because it changes calculating the Fibonacci sequence to calculating one matrix to the power of the number we want to change our seed vector by. So the question becomes not how fast can we calculate the Fibonacci sequence, but how fast can we exponentiate a matrix. It turns out we can calculate an exponentiation, using square and multiply, in O(log n) time. So our proposed algorithm for calculating the nth Fibonacci number would also work in O(log n) time, far exceeding the O(n) time complexity of recursion with memorisation. 

## Brief tangent on the square and multiply <span style="font-size:0.6em">(aka exponentiation via squaring or binary exponentiation)</span>
Our problem is to calculate $$A^n$$. To understand the algorithm, we need to understand what happens to our exponent when we do two key operations: squaring and multiplying. 
We note that when we square our number we double the exponent. Doubling a number in binary is equivalent to a left bit shift. So squaring a number causes its exponent to bitwise left shift once. 
For example:

$$
(3^4)^2 = 3^{2*4} = 3 ^ {2 * 100_2} = 3 ^ {1000_2}
$$

We also know when we multiply our number by its base we add $$1$$ to its exponent.

Now we have these two operations we can look at the key part of the algorithm which is to reconstruct the exponent by using these two operations in binary. <br>
For example, <br>
let's calculate $$23^{13}$$. <br>
The first thing to do is to convert the exponent to binary $$23^{13}=23^{1101_2}$$. <br>
Then we initialize our output, $$X$$ which we should think of as $$X^0$$. We now form the exponent of $$A$$ by performing our square and multiply operations. 

| Square Or Multiply | Calculation       | X                         | Current exponent |
|--------------------|-------------------|---------------------------|------------------|
| Initialization     |                   | $$1$$                     | $$0_2$$          |
| Multiply           | $$X = X \cdot 23$$| $$23$$                    | $$1_2$$          |
| Square             | $$X = X ^ 2$$     | $$529$$                   | $$10_2$$         |
| Multiply           | $$X = X \cdot 23$$| $$12167$$                 | $$11_2$$         |
| Square             | $$X = X ^ 2$$     | $$148035889$$             | $$110_2$$        |
| Square             | $$X = X ^ 2$$     | $$2.191462443\cdot10^{16}$$| $$1100_2$$      |
| Multiply           | $$X = X \cdot 23$$| $$5.040363619\cdot10^{17}$$| $$1101_2$$      |


Which is indeed correct. <br>
Note that this algorithm can exponentiate any object that defines a “multiplication” operation and “exponentiation” operation. Further note that this algorithm runs in O(k), where k is the number of bits to form the exponent. Since a number N has floor(log N) bits, this algorithm runs in O(log n) time.

## Getting back on track
So how do we calculate, say, the 100th Fibonacci number? To compute $$F_{100}$$​, we must apply our recurrence matrix sufficiently many times to move from the initial seed vector $$\begin{bmatrix}
F_{2} \\
F_{1}
\end{bmatrix}$$ to $$\begin{bmatrix}
F_{100} \\
F_{199}
\end{bmatrix}$$

$$
\begin{bmatrix}
F_{100} \\
F_{99}
\end{bmatrix} =
\begin{bmatrix}
1 & 1 \\
1 & 0
\end{bmatrix}^{98}
\begin{bmatrix}
F_2 \\
F_1
\end{bmatrix} =
\begin{bmatrix}
1 & 1 \\
1 & 0
\end{bmatrix}^{98}
\begin{bmatrix}
1 \\
1
\end{bmatrix} 
$$

We can calculate
$$\begin{bmatrix}
1 & 1 \\
1 & 0 \\
\end{bmatrix}^{98}$$
with square and multiply, which comes out as  
$$\begin{bmatrix}
21892299583455169026 & 13501852344706746049 \\
13501852344706746949 & 83621143489848422977
\end{bmatrix}^{98}$$<br>
Then we times this by a vector with our seeds in,
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
![Google search showing the 100th Fibonacci number](/assets/images/100_th_fib_number.png)

## Generalizing 
So we could now create a log(n) algorithm that could calculate any Fibonacci number wanted, but it would be a lot more useful if we could do this for any recurrence relation. To do that, all we need to work out is how to form the recurrence matrix for a recurrence rule.

Let’s define a recurrence rule $$F_n=a_1F_{n-1}+a_2F_{n-2}+...+a_kF_{n-k}$$. We attempt to find the recurrence matrix $$A$$, which is a matrix such that

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
Given that the $$i j$$ entry of a matrix is the dot product of the row $$i$$ in the left matrix and the column $$j$$ in the right matrix, we can easily see that we want the first row to be $$a_1, a_2, ..., a_k$$. Furthermore, we note that we wish to bring each element in the input vector down an element in the output vector, so we just need the rest of the matrix to be 1's on the diagonal.<br> 
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
The implementation details of both square and multiply and matrix multiplication are beyond the scope of this post; instead, we will pass these off to generic functions when necessary. 

Problem statement: Given a list, ‘coefficients’, of constants which represent the coefficients of the recurrence rule starting with $$a_1$$ and a list, ‘seeds’, of seed values starting with $$F_1$$ find the nth term.

The very first thing to check is that the nth term asked for isn’t already one given in the seed value. 
``` 
def get_nth_value(coefficients: List[float], seeds: List[float], n: int)-> int:
    order = len(coefficients)
    if 1 <= n <= order: return seeds[n-1]
```
We then construct the recurrence matrix and the seed matrix.
The function Matrix here takes in a 2d list representing the values in the matrix and returns a matrix with those values that can be operated on. We also now the rest of matrix is 1's on the diagonal which we can form by chopping of the last row of the identity matrix.
```
    recurrence_matrix = Matrix([coefficients] + make_identity_matrix_list(order)[:-1])
```

We can now work on calculating the nth term. First, we define difference as the number of steps we need to advance the state vector in order to reach $$F_n$$. Then, we pass the exponentiation $$\text{recurrence_matrix}^{\text{difference}}$$ to square and multiply and finally times by the seed matrix. We can then just return the value at the top of the output vector.
```
    difference = n - order
    foo = square_and_multiply(recurrence_matrix, difference)
    final_matrix = foo * seed_matrix
    return final_matrix[0][0]
```

Our current algorithm functions for positive values of N. But we can easily extend this to work for negative values of N, by adding the ability to invert our recurrence_matrix.
Given that $$A^{-n}=(A^{-1})^n=(A^n)^{-1}$$, it is sufficient to invert the matrix if the difference is negative, then continue as if it were postive. Adding this to our code, we get the final algorithm.
```
def get_nth_value(coefficients: List[float], seeds: List[float], n: int) -> int:
    order = len(coefficients)
    if 1 <= n <= order: return seeds[n-1]
    seed_matrix = Matrix([[i] for i in seeds[::-1]])
    recurrence_matrix = Matrix([coefficients] + make_idenity_matrix_list(order)[:-1])
    difference = n - order
    if difference < 0:
        difference *= -1  
        recurrence_matrix = recurrence_matrix.inverse()  
    foo = square_and_multiply(recurrence_matrix, difference)
    final_matrix = foo * seed_matrix
    return final_matrix[0][0]
```
And there we have it: a log(n) method for calculating the n-th term of any linear homogeneous recurrence relationship with constant coefficients.
