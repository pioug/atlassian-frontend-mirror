import { MarkSpec, Mark } from 'prosemirror-model';
import { FONT_STYLE } from '../groups';

export interface SubSupAttributes {
  type: 'sub' | 'sup';
}

/**
 * @name subsup_mark
 */
export interface SubSupDefinition {
  type: 'subsup';
  attrs: SubSupAttributes;
}

export interface SubSupMark extends Mark {
  attrs: SubSupAttributes;
}

function getAttrFromVerticalAlign(node: HTMLElement) {
  if (node.style.verticalAlign) {
    const type = node.style.verticalAlign.slice(0, 3);
    if (type === 'sub' || type === 'sup') {
      return { type };
    }
  }
  return false;
}

export const subsup: MarkSpec = {
  inclusive: true,
  group: FONT_STYLE,
  attrs: { type: { default: 'sub' } },
  parseDOM: [
    { tag: 'sub', attrs: { type: 'sub' } },
    { tag: 'sup', attrs: { type: 'sup' } },
    {
      // Special case for pasting from Google Docs
      // Google Docs uses vertical align to denote subscript and super script
      tag: 'span',
      style: 'vertical-align=super',
      getAttrs: node => getAttrFromVerticalAlign(node as HTMLElement),
    },
    {
      tag: 'span',
      style: 'vertical-align=sub',
      getAttrs: node => getAttrFromVerticalAlign(node as HTMLElement),
    },
  ],
  toDOM(mark) {
    return [mark.attrs.type];
  },
};
