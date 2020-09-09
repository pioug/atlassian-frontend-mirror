import collapse from './collapse-whitespace';

export default function (fragment: string): Document {
  const html = `<!doctype html><html><body>${fragment}</body></html>`;
  const parser: DOMParser = new (window as any).DOMParser();
  const tree = parser.parseFromString(html, 'text/html');
  collapse(tree.documentElement!, isBlock);
  return tree;
}

function isBlock(node: Node) {
  // these blocks are mainly used to collapse whitespace between the blocks
  // (preventing spurious text nodes of ' ')
  switch (node.nodeName.toUpperCase()) {
    case 'ADDRESS':
    case 'ARTICLE':
    case 'ASIDE':
    case 'AUDIO':
    case 'BLOCKQUOTE':
    case 'BODY':
    case 'CANVAS':
    case 'CENTER':
    case 'DD':
    case 'DIR':
    case 'DIV':
    case 'DL':
    case 'DT':
    case 'FIELDSET':
    case 'FIGCAPTION':
    case 'FIGURE':
    case 'FOOTER':
    case 'FORM':
    case 'FRAMESET':
    case 'H1':
    case 'H2':
    case 'H3':
    case 'H4':
    case 'H5':
    case 'H6':
    case 'HEADER':
    case 'HGROUP':
    case 'HR':
    case 'HTML':
    case 'ISINDEX':
    case 'LI':
    case 'MAIN':
    case 'MENU':
    case 'NAV':
    case 'NOFRAMES':
    case 'NOSCRIPT':
    case 'OL':
    case 'OUTPUT':
    case 'P':
    case 'PRE':
    case 'SECTION':
    case 'TABLE':
    case 'TBODY':
    case 'TD':
    case 'TFOOT':
    case 'TH':
    case 'THEAD':
    case 'TR':
    case 'UL':
      return true;
  }
  return false;
}
