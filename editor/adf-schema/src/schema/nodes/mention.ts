import { NodeSpec, Node as PMNode } from 'prosemirror-model';

export enum USER_TYPES {
  DEFAULT = 'DEFAULT',
  SPECIAL = 'SPECIAL',
  APP = 'APP',
}

export type UserType = keyof typeof USER_TYPES;

export interface MentionAttributes {
  id: string;
  text?: string;
  userType?: UserType;
  accessLevel?: string;
}

/**
 * @name mention_node
 */
export interface MentionDefinition {
  type: 'mention';
  attrs: MentionAttributes;
}

export const mention: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: true,
  attrs: {
    id: { default: '' },
    text: { default: '' },
    accessLevel: { default: '' },
    userType: { default: null },
  },
  parseDOM: [
    {
      tag: 'span[data-mention-id]',
      getAttrs: (domNode) => {
        const dom = domNode as HTMLElement;
        const attrs: MentionAttributes = {
          id: dom.getAttribute('data-mention-id') || mention.attrs!.id.default,
          text: dom.textContent || mention.attrs!.text.default,
          accessLevel:
            dom.getAttribute('data-access-level') ||
            mention.attrs!.accessLevel.default,
        };

        const userType = dom.getAttribute('data-user-type') as USER_TYPES;
        if (USER_TYPES[userType]) {
          attrs.userType = userType;
        }

        return attrs;
      },
    },
  ],
  toDOM(node) {
    const { id, accessLevel, text, userType } = node.attrs;
    const attrs: any = {
      'data-mention-id': id,
      'data-access-level': accessLevel,
      contenteditable: 'false',
    };
    if (userType) {
      attrs['data-user-type'] = userType;
    }
    return ['span', attrs, text];
  },
};

const isOptional = (key: string) => {
  return ['userType'].indexOf(key) > -1;
};

export const toJSON = (node: PMNode) => ({
  attrs: Object.keys(node.attrs).reduce<typeof node.attrs>((obj, key) => {
    if (isOptional(key) && !node.attrs[key]) {
      return obj;
    }
    obj[key] = node.attrs[key];
    return obj;
  }, {}),
});
