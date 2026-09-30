---
layout: default
title: "Where Should You Aim in Darts?"
date: 2026-09-27
author: "Ben Kashouris"
image: /assets/images/darts.svg
center_content: true
show_contents: true
math: true
animated_media: true
topics:
  - Probability
  - Optimisation
description: Exploring how throwing accuracy changes the best place to aim on a dartboard to maximise the average score.
---

## The question

In a game of darts, the highest score from a single dart is 60, achieved by hitting the treble 20. But is this always the best place to aim? If your throws are not very accurate, aiming at the treble 20 can leave you scoring just 5 or 1 in the neighbouring sectors.

This project explores the question, for a player with a given level of accuracy, which aiming position produces the highest average score?

## Mathematical formulation

<div class="definition-block" markdown="1">

### Definition: scoring function

Identify the dartboard with a region of $$\mathbb{R}^2$$, with the origin at the centre of the bull. The **scoring function** is the map

$$
S : \mathbb{R}^2 \longrightarrow \mathbb{R}_{\geq 0},
\qquad
\mathbf{x} \longmapsto S(\mathbf{x}),
$$

where $$S(\mathbf{x})$$ is the score awarded to a dart landing at position $$\mathbf{x}$$. Set $$S(\mathbf{x})=0$$ for positions outside the scoring area.

Each point on a shared boundary is assigned to exactly one adjacent scoring region according to a fixed convention. Thus, $$S$$ is well-defined everywhere.

</div>

### Goal: optimal aiming point

Let $$\mathbf{x}\in\mathbb{R}^2$$ be the aiming point and let $$\boldsymbol{\varepsilon}\in\mathbb{R}^2$$ be a random vector describing the throwing error. The dart lands at $$\mathbf{x}+\boldsymbol{\varepsilon}$$. For a fixed distribution of throwing error, our goal is to find an aiming point that maximises the expected score:

$$
\mathbf{x}^* \in \operatorname*{arg\,max}_{\mathbf{x}\in\mathbb{R}^2}
\left(\mathbb{E}_{\boldsymbol{\varepsilon}}\left[S(\mathbf{x}+\boldsymbol{\varepsilon})\right]\right).
$$

### Monte Carlo simulation

The scoring function is piecewise constant and discontinuous, with scoring regions whose geometry makes finding the optimal aiming point analytically difficult. We therefore use a numerical method.

For a throwing-error distribution $$\mathcal{D}$$, define the expected score at aiming point $$\mathbf{x}$$ by

$$
\mu(\mathbf{x},\mathcal{D})
:=\mathbb{E}_{\boldsymbol{\varepsilon}\sim\mathcal{D}}
\left[S(\mathbf{x}+\boldsymbol{\varepsilon})\right].
$$

We use Monte Carlo simulation to approximate this expectation by averaging the scores of simulated throws:

$$
\mu(\mathbf{x},\mathcal{D})
\approx\frac{1}{n}\sum_{i=1}^{n}S(\mathbf{x}+\boldsymbol{\varepsilon}_i),
\qquad
\boldsymbol{\varepsilon}_1,\ldots,\boldsymbol{\varepsilon}_n
\overset{\mathrm{iid}}{\sim}\mathcal{D}.
$$

By the law of large numbers, this sample average converges to the expected score as $$n\to\infty$$. In fact, its standard error decreases in proportion to $$1/\sqrt{n}$$.

We estimate the expected score at each aiming point on a grid, then select the point with the highest estimated score. This gives an approximation to the optimal aiming point, limited by the grid resolution and simulation error.

### Error distribution

Several error distributions are reasonable to consider. A natural starting point is a centred, isotropic two-dimensional normal distribution in Cartesian coordinates, which models throws as a symmetric bell-shaped spread around the aiming point, with no systematic bias.

The same simulation code can accommodate other distributions, and exploring these could be interesting.

For the rest of this project, we use an isotropic normal distribution:

$$
\mathcal{D}=\mathcal{N}(\mathbf{0},\sigma^2 I_2),
\qquad
\boldsymbol{\varepsilon}\sim\mathcal{D},
$$

where $$I_2$$ is the two-dimensional identity matrix. We measure positions and throwing errors in millimetres. The horizontal and vertical errors are independent, each with variance $$\sigma^2$$ measured in $$\mathrm{mm}^2$$. Thus, $$\sigma$$ is measured in millimetres, and increasing it models a less accurate thrower.

For $$\mathcal{D}=\mathcal{N}(\mathbf{0},\sigma^2 I_2)$$, the expected score is a Gaussian-weighted average of the scoring function:

$$
\mu(\mathbf{x},\mathcal{D})
=\int_{\mathbb{R}^2} S(\mathbf{y})\,
\frac{1}{2\pi\sigma^2}
\exp\!\left(-\frac{\|\mathbf{y}-\mathbf{x}\|^2}{2\sigma^2}\right)
\,\mathrm{d}\mathbf{y},
\qquad \sigma>0.
$$

Increasing $$\sigma$$ averages the scores over a wider area, smoothing out the narrow rings and sector boundaries. This explains why precise targeting of a treble becomes less useful as throwing error grows.

## Results

### How accuracy changes the best target

At low throwing variance, the best target is near the centre of the treble 20. When the spread of throws is small relative to the scoring region, most darts land close enough to the target to retain its advantage. The first heatmap shows this at $$\sigma=3\,\mathrm{mm}$$ per axis: the narrow treble regions remain clearly visible as bands of high expected score.

![Expected-score heatmap at low throwing variance]({{ '/assets/darts/lowvariance.png' | relative_url }})

As the variance increases, the best target moves towards the lower-left part of the board. At $$\sigma=35\,\mathrm{mm}$$, the expected score depends on a much wider neighbourhood around the aiming point. The benefit of aiming at treble 20 is reduced by the low-scoring 1 and 5 sectors beside it, while the lower-left region offers a different balance of possible landing scores. 

![Expected-score heatmap at medium throwing variance]({{ '/assets/darts/mediumvar.png' | relative_url }})

At high variance, the best target moves close to the bull. In the heatmap at $$\sigma=125\,\mathrm{mm}$$, the narrow scoring rings have largely disappeared into a broad central peak. Aiming centrally reduces the chance of missing the scoring area, which becomes increasingly important as the spread grows.

![Expected-score heatmap at high throwing variance]({{ '/assets/darts/highvar.png' | relative_url }})

### The path of the best aiming point

The next plot summarises how the preferred aiming position changes with throwing variance. It shows the centroid of the largest connected 95% confidence region. When the region splits into two separate parts near the switch, we use the larger part rather than averaging across both.

This gives a representative location for a group of candidate optimal points, although the centroid itself need not be optimal.

![Path of the best aiming point as throwing variance increases]({{ '/assets/darts/best-aim-path.png' | relative_url }})

The dashed part of the path marks a switch between competing regions near treble 20 and the lower-left part of the board. Although the expected-score surface varies smoothly with throwing accuracy, the location of its maximum can jump when one peak overtakes another. At a transition where both peaks have the same maximal expected score, the optimal aiming point is not unique.

The animation below shows the highlighted candidate aiming points as the throwing variance increases, making this jump easier to follow.

<figure>
  <video class="darts-video" controls loop muted playsinline preload="metadata" data-autoplay aria-label="Best aiming points as throwing variance increases">
    <source src="{{ '/assets/darts/bestpoint.mp4' | relative_url }}" type="video/mp4">
    <a href="{{ '/assets/darts/bestpoint.mp4' | relative_url }}">Download the best aiming points animation.</a>
  </video>
</figure>

### Heatmaps

These animations show how the whole expected-score surface changes as throwing variance increases. The dynamic colour scale adjusts in each frame, making differences between aiming points easier to see. The fixed colour scale allows direct comparisons across frames, showing how the expected scores fall as the throws become more dispersed.

<div class="darts-video-comparison">
  <figure>
    <video class="darts-video" controls loop muted playsinline preload="metadata" data-autoplay aria-label="Expected-score heatmap with a dynamic colour scale">
      <source src="{{ '/assets/darts/heatmap_dynamic.mp4' | relative_url }}" type="video/mp4">
      <a href="{{ '/assets/darts/heatmap_dynamic.mp4' | relative_url }}">Download the dynamic-scale heatmap.</a>
    </video>
    <figcaption>Dynamic colour scale.</figcaption>
  </figure>
  <figure>
    <video class="darts-video" controls loop muted playsinline preload="metadata" data-autoplay aria-label="Expected-score heatmap with a fixed colour scale">
      <source src="{{ '/assets/darts/heatmap_fixed.mp4' | relative_url }}" type="video/mp4">
      <a href="{{ '/assets/darts/heatmap_fixed.mp4' | relative_url }}">Download the fixed-scale heatmap.</a>
    </video>
    <figcaption>Fixed colour scale.</figcaption>
  </figure>
</div>

Restricting the colour to the top 5% of sampled aiming points makes the highest-scoring regions easier to follow. This shows how the shape and location of the promising regions change.

<div class="darts-video-comparison">
  <figure>
    <video class="darts-video" controls loop muted playsinline preload="metadata" data-autoplay aria-label="Top five percent of aiming points with a dynamic colour scale">
      <source src="{{ '/assets/darts/heatmap_5%25_dynamic.mp4' | relative_url }}" type="video/mp4">
      <a href="{{ '/assets/darts/heatmap_5%25_dynamic.mp4' | relative_url }}">Download the top-five-percent dynamic-scale heatmap.</a>
    </video>
    <figcaption>Top 5% with a dynamic colour scale.</figcaption>
  </figure>
  <figure>
    <video class="darts-video" controls loop muted playsinline preload="metadata" data-autoplay aria-label="Top five percent of aiming points with a fixed colour scale">
      <source src="{{ '/assets/darts/heatmap_5%25_fixed.mp4' | relative_url }}" type="video/mp4">
      <a href="{{ '/assets/darts/heatmap_5%25_fixed.mp4' | relative_url }}">Download the top-five-percent fixed-scale heatmap.</a>
    </video>
    <figcaption>Top 5% with a fixed colour scale.</figcaption>
  </figure>
</div>

### How much does the choice of target matter?

The final plot compares the estimated optimal target with two fixed strategies: aiming at treble 20 and aiming at the bull. Expected scores are per dart, and the horizontal axis shows the standard deviation $$\sigma$$ in millimetres per axis.

![Expected scores for different aiming strategies as throwing variance changes]({{ '/assets/darts/all-strategies.png' | relative_url }})

At very low throwing variance, aiming at treble 20 is clearly preferable to aiming at the bull: the curves approach 60 and 50, respectively, as $$\sigma$$ approaches zero. The choice of target can therefore make a substantial difference for a very accurate player.

Across much of the middle of the plotted range, the optimal strategy offers a smaller improvement over aiming at treble 20, visually on the order of one or two points per dart. The separation between the optimal and treble-20 curves shows when adjusting the target begins to offer a noticeable scoring advantage.

The practical conclusion is that accurate players benefit from targeting treble 20, players with a larger spread may benefit from shifting towards the lower-left region, and very dispersed throws favour a target near the centre.
