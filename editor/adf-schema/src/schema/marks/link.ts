import { MarkSpec, Mark } from 'prosemirror-model';
import { LINK } from '../groups';
import { isRootRelative, isSafeUrl, normalizeUrl } from '../../utils/url';

export interface ConfluenceLinkMetadata {
  linkType: string;
  versionAtSave?: string | null;
  fileName?: string | null;
  spaceKey?: string | null;
  contentTitle?: string | null;
  isRenamedTitle?: boolean;
  anchorName?: string | null;
  contentId?: string | null;
  container?: ConfluenceLinkMetadata;
}

export interface LinkAttributes {
  /**
   * @validatorFn safeUrl
   */
  href: string;
  title?: string;
  id?: string;
  collection?: string;
  occurrenceKey?: string;

  __confluenceMetadata?: ConfluenceLinkMetadata;
}

/**
 * @name link_mark
 */
export interface LinkDefinition {
  type: 'link';
  attrs: LinkAttributes;
}

const getLinkAttrs = (attribute: string) => (domNode: Node | string) => {
  const dom = domNode as HTMLLinkElement;

  const href = dom.getAttribute(attribute) || '';
  const attrs: { __confluenceMetadata: string; href?: string } = {
    __confluenceMetadata: dom.hasAttribute('__confluenceMetadata')
      ? JSON.parse(dom.getAttribute('__confluenceMetadata') || '')
      : undefined,
  };

  if (!isSafeUrl(href)) {
    return false;
  }

  if (isRootRelative(href)) {
    attrs.href = href;
    return attrs;
  }

  attrs.href = normalizeUrl(href);
  return attrs;
};

export const link: MarkSpec = {
  excludes: `${LINK}`, // ED-5844 No multiple links in media node
  group: LINK,
  attrs: {
    href: {},
    __confluenceMetadata: {
      default: null,
    },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: '[data-block-link]',
      getAttrs: getLinkAttrs('data-block-link'),
      contentElement: (node) => {
        const clone = node.cloneNode(true);
        (clone as HTMLElement).removeAttribute('data-block-link');
        (clone as HTMLElement).setAttribute('data-skip-paste', 'true');
        const wrapper = document.createElement('div');
        wrapper.appendChild(clone);
        return wrapper;
      },
    },
    {
      tag: 'a[href]',
      getAttrs: getLinkAttrs('href'),
    },
  ],
  toDOM(node, isInline) {
    const attrs = Object.keys(node.attrs).reduce<any>((attrs, key) => {
      if (key === '__confluenceMetadata') {
        if (node.attrs[key] !== null) {
          attrs[key] = JSON.stringify(node.attrs[key]);
        }
      } else if (key === 'href') {
        attrs[key] = isSafeUrl(node.attrs[key]) ? node.attrs[key] : undefined;
      } else {
        attrs[key] = node.attrs[key];
      }

      return attrs;
    }, {});

    if (isInline) {
      return ['a', attrs];
    }

    return [
      'a',
      {
        ...attrs,
        ['data-block-link']: 'true',
        class: 'blockLink',
      },
      0,
    ];
  },
};

const OPTIONAL_ATTRS = [
  'title',
  'id',
  'collection',
  'occurrenceKey',
  '__confluenceMetadata',
];

export const toJSON = (mark: Mark) => ({
  type: mark.type.name,
  attrs: Object.keys(mark.attrs).reduce<Record<string, string>>(
    (attrs, key) => {
      if (OPTIONAL_ATTRS.indexOf(key) === -1 || mark.attrs[key] !== null) {
        attrs[key] = mark.attrs[key];
      }
      return attrs;
    },
    {},
  ),
});
