// Spread boundaries are chapter-local. Remember a visited opening so that
// reversing direction reaches the same pages, even around a foldout.
class ChapterSpreads {
  constructor() { this.openings = new Map(); }

  reset() { this.openings.clear(); }

  neighbor(page, total, firstAlone, ratios, step) {
    const known = this.openings.get(page);
    if (known) return known.find(number => number !== page);
    if ((firstAlone && page === 1) || ratios.get(page) <= 1) return;
    let direction = step;
    if (!direction) {
      let start = firstAlone ? 2 : 1;
      for (const [number, heightToWidth] of ratios) {
        if (heightToWidth <= 1 && number < page) start = Math.max(start, number + 1);
      }
      direction = (page - start) % 2 === 0 ? 1 : -1;
    }
    const other = page + direction;
    if (other < (firstAlone ? 2 : 1) || other > total || this.openings.has(other)) return;
    return other;
  }

  remember(pages) {
    for (const page of pages) this.openings.set(page, pages);
  }
}
