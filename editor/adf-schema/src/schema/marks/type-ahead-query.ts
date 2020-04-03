import { MarkSpec } from 'prosemirror-model';
import { SEARCH_QUERY } from '../groups';
import { B400 } from '../../utils/colors';

export const typeAheadQuery: MarkSpec = {
  inclusive: true,
  group: SEARCH_QUERY,
  parseDOM: [{ tag: 'span[data-type-ahead-query]' }],
  toDOM(node) {
    return [
      'span',
      {
        'data-type-ahead-query': 'true',
        'data-trigger': node.attrs.trigger,
        style: `color: ${B400}`,
      },
    ];
  },
  attrs: {
    trigger: { default: '' },
  },
};
