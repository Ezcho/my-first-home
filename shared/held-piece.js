// Shared pickup treatment. Installed by the stage host so Stage 1 source stays intact.
export function installHeldPieceAppearance(doc) {
  const svg = doc.querySelector('#game-svg');
  if (!svg || doc.querySelector('#held-piece-paper')) return;
  const ns = 'http://www.w3.org/2000/svg';
  const node = (tag, attrs, children = []) => {
    const element = doc.createElementNS(ns, tag);
    for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
    element.append(...children);
    return element;
  };
  const filter = node('filter', {
    id: 'held-piece-paper', x: '-50%', y: '-100%', width: '200%', height: '300%',
    'color-interpolation-filters': 'sRGB'
  }, [
    node('feMorphology', { in: 'SourceAlpha', operator: 'dilate', radius: 8, result: 'paper' }),
    node('feMorphology', { in: 'paper', operator: 'dilate', radius: 1, result: 'edge' }),
    node('feFlood', { 'flood-color': '#351e28', result: 'ink' }),
    node('feComposite', { in: 'ink', in2: 'edge', operator: 'in', result: 'outline' }),
    node('feFlood', { 'flood-color': '#fff', result: 'white' }),
    node('feComposite', { in: 'white', in2: 'paper', operator: 'in', result: 'background' }),
    node('feMerge', {}, ['outline', 'background', 'SourceGraphic'].map(input => node('feMergeNode', { in: input }))),
    node('feDropShadow', { dx: 0, dy: 6, stdDeviation: 4, 'flood-color': '#351e28', 'flood-opacity': .22 })
  ]);
  svg.querySelector('defs').append(filter);
  const style = doc.createElement('style');
  style.textContent = '#held-item .piece-art, #held-item .held-art { filter: url(#held-piece-paper); }';
  doc.head.append(style);
}
