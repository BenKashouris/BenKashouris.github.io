(() => {
  const content = document.querySelector('.article-content');
  const rail = document.querySelector('.contents-rail');
  const list = rail?.querySelector('[data-article-toc]');

  if (!content || !rail || !list) return;

  const headings = [...content.querySelectorAll('h2, h3')];
  if (headings.length < 2) return;

  const usedIds = new Set([...document.querySelectorAll('[id]')].map((element) => element.id));

  headings.forEach((heading, index) => {
    if (!heading.id) {
      const base = heading.textContent
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || `section-${index + 1}`;
      let id = base;
      let suffix = 2;

      while (usedIds.has(id)) {
        id = `${base}-${suffix}`;
        suffix += 1;
      }

      heading.id = id;
      usedIds.add(id);
    }

    const item = document.createElement('li');
    const link = document.createElement('a');
    item.dataset.level = heading.tagName.slice(1);
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    item.append(link);
    list.append(item);
  });

  rail.hidden = false;

  const links = new Map([...list.querySelectorAll('a')].map((link) => [link.hash.slice(1), link]));
  const setCurrent = () => {
    let current = headings[0];
    headings.forEach((heading) => {
      if (heading.getBoundingClientRect().top <= 140) current = heading;
    });
    links.forEach((link) => link.removeAttribute('aria-current'));
    links.get(current.id)?.setAttribute('aria-current', 'location');
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      setCurrent();
      ticking = false;
    });
  };

  setCurrent();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
