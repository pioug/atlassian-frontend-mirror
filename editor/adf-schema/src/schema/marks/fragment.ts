import { Mark, MarkSpec } from '@atlaskit/editor-prosemirror/model';
import { isDOMElement } from '../../utils/parseDOM';

export type LocalId = string;

export interface FragmentAttributes {
  /**
   * @minLength 1
   */
  localId: LocalId;
  name?: string;
}

/**
 * @name fragment_mark
 * @description Indicates that the elements decorated with this mark belong to a "fragment" entity, which represents a collection of ADF nodes.
 * This entity can be referred to later by its `localId` attribute.
 */
export interface FragmentDefinition {
  type: 'fragment';
  attrs: FragmentAttributes;
}

export interface FragmentMark extends Mark {
  attrs: FragmentAttributes;
}

const parseFragment = (
  maybeValue: string | Node,
): FragmentAttributes | false => {
  if (!isDOMElement(maybeValue)) {
    return false;
  }

  const name = maybeValue.getAttribute('data-name') ?? undefined;
  const localId = maybeValue.getAttribute('data-localId');

  if (!localId) {
    return false;
  }

  return { localId, name };
};

export const fragment: MarkSpec = {
  inclusive: false,
  excludes: '',
  attrs: { localId: { default: '' }, name: { default: null } },
  parseDOM: [
    {
      tag: '[data-mark-type="fragment"]',
      getAttrs: (maybeValue) => parseFragment(maybeValue),
    },
  ],
  toDOM(mark: Mark, inline) {
    const wrapperStyle = inline ? 'span' : 'div';

    return [
      wrapperStyle,
      {
        'data-mark-type': 'fragment',
        'data-name': mark.attrs.name,
        'data-localId': mark.attrs.localId,
      },
    ];
  },
};

export const toJSON = (mark: Mark) => {
  return {
    type: mark.type.name,
    attrs: {
      localId: mark.attrs.localId,
      ...(mark.attrs.name ? { name: mark.attrs.name } : {}),
    },
  };
};
