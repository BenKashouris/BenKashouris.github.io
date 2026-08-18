(function () {
  "use strict";

  const videos = Array.from(document.querySelectorAll("video[data-autoplay]"));

  if (videos.length === 0) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function play(video) {
    if (reducedMotion.matches) {
      return;
    }

    if (video.readyState === 0) {
      video.load();
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        // Browser autoplay policies can still decline playback.
      });
    }
  }

  function pause(video) {
    video.pause();
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.dataset.inView = entry.isIntersecting ? "true" : "false";

        if (entry.isIntersecting) {
          play(entry.target);
        } else {
          pause(entry.target);
        }
      });
    }, {
      rootMargin: "200px 0px",
      threshold: 0.1
    });

    videos.forEach(function (video) {
      observer.observe(video);
    });
  } else if (!reducedMotion.matches) {
    videos.forEach(play);
  }

  function handleMotionChange() {
    videos.forEach(function (video) {
      if (reducedMotion.matches) {
        pause(video);
      } else if (video.dataset.inView === "true") {
        play(video);
      }
    });
  }

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleMotionChange);
  } else {
    reducedMotion.addListener(handleMotionChange);
  }
})();
