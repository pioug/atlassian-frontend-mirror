import { MarkSpec, Mark, Fragment } from 'prosemirror-model';
import { LINK, COLOR } from '../groups';
import { isSafeUrl, normalizeUrl } from '../../utils/url';

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

  if (isSafeUrl(href)) {
    attrs.href = normalizeUrl(href);
  } else {
    return false;
  }

  return attrs;
};

export const link: MarkSpec = {
  excludes: `${LINK} ${COLOR}`, // ED-5844 No multiple links in media node
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
        const wrapper = document.createElement('div');
        wrapper.appendChild(clone);
        return wrapper;
      },
    },
    {
      tag: 'a[href]',
      context: 'paragraph/|heading/|mediaSingle/|taskItem/|decisionItem/',
      getAttrs: getLinkAttrs('href'),
    },
    {
      /**
       * When links aren't wrapped in a paragraph and due to
       * the odd nature of how our schema is set up, prosemirror will
       * add the link to the paragraph node itself where it should be on
       * the text node, this satisfies our schema because link is allowed
       * in many places (e.g. listitem)
       * This change comes through via prosemirror-model@1.9.1
       */
      tag: 'a[href]',
      getAttrs: getLinkAttrs('href'),
      getContent: (node, schema) => {
        if (node instanceof HTMLAnchorElement) {
          const href = node.getAttribute('href');
          const text = node.innerText;

          return Fragment.from(
            schema.nodes.paragraph.createChecked(
              undefined,
              schema.text(text, [schema.marks.link.create({ href })]),
            ),
          );
        }

        return Fragment.empty;
      },
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
