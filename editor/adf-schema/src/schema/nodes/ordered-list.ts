import { NodeSpec } from '@atlaskit/editor-prosemirror/model';

export const orderedListSelector = '.ak-ol';

export const orderedList: NodeSpec = {
  group: 'block',
  attrs: {
    order: { default: 1 },
  },
  content: 'listItem+',
  marks: 'unsupportedMark unsupportedNodeAttribute',
  selectable: false,
  parseDOM: [{ tag: 'ol' }],
  toDOM() {
    const attrs = {
      class: orderedListSelector.substr(1),
    };
    return ['ol', attrs, 0];
  },
};

// resolve "start" to a safe, 0+ integer, otherwise return undefined
// Note: Any changes to this function should also be made to "resolveOrder"
// in packages/editor/editor-common/src/utils/list.ts
const resolveStart = (start: any): number | undefined => {
  const num = Number(start);
  if (Number.isNaN(num)) {
    return;
  }
  if (num < 0) {
    return;
  }
  return Math.floor(Math.max(num, 0));
};

export const orderedListWithOrder: NodeSpec = {
  ...orderedList,
  parseDOM: [
    {
      tag: 'ol',
      getAttrs: (domNode) => {
        const dom = domNode as HTMLElement;
        let startDOMAttr = dom.getAttribute('start');
        if (startDOMAttr) {
          const start = resolveStart(startDOMAttr);
          if (typeof start === 'number') {
            return { order: start };
          }
        }
        return null;
      },
    },
  ],
  toDOM(node) {
    const start = resolveStart(node?.attrs?.order);
    const attrs = {
      start: typeof start === 'number' ? String(start) : undefined,
      class: orderedListSelector.substr(1),
    };
    return ['ol', attrs, 0];
  },
};
