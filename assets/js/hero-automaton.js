(function () {
  "use strict";

  const states = [
    "4880042825", "244200c118", "48800528a0", "2442804110",
    "48804520a4", "245220c41a", "4888152201", "2552a89142",
    "4880042220", "2442001550", "4880042205", "2442001048"
  ].map(function (state) {
    return BigInt("0x" + state);
  });
  const frameDuration = 1500;
  const cells = Array.from(
    document.querySelectorAll(".hero-automaton [data-cell-index]")
  );

  if (cells.length !== 41) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentFrame = 0;
  let timerId;

  function renderFrame(frameIndex) {
    const state = states[frameIndex];

    cells.forEach(function (cell) {
      const cellIndex = Number(cell.dataset.cellIndex);
      const isActive = (state & (1n << BigInt(cellIndex))) !== 0n;
      cell.classList.toggle("is-active", isActive);
    });
  }

  function startAnimation() {
    window.clearInterval(timerId);
    currentFrame = 0;
    renderFrame(currentFrame);

    if (reducedMotion.matches) {
      return;
    }

    timerId = window.setInterval(function () {
      currentFrame = (currentFrame + 1) % states.length;
      renderFrame(currentFrame);
    }, frameDuration);
  }

  startAnimation();
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", startAnimation);
  } else {
    reducedMotion.addListener(startAnimation);
  }
})();
