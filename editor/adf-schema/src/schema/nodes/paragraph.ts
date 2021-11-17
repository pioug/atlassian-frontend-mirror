import { NodeSpec, DOMOutputSpec, Fragment, Schema } from 'prosemirror-model';
import { AlignmentMarkDefinition, IndentationMarkDefinition } from '../marks';
import { MarksObject, NoMark } from './types/mark';
import { isSafeUrl } from '../../utils/url';
import { Inline } from './types/inline-content';

/**
 * @name paragraph_node
 */
export interface ParagraphBaseDefinition {
  type: 'paragraph';
  /**
   * @allowUnsupportedInline true
   */
  content?: Array<Inline>;
  marks?: Array<any>;
}

/**
 * @name paragraph_with_no_marks_node
 */
export type ParagraphDefinition = ParagraphBaseDefinition & NoMark;

/**
 * NOTE: Need this because TS is too smart and inline everything.
 * So we need to give them separate identity.
 * Probably there's a way to solve it but that will need time and exploration.
 * // http://bit.ly/2raXFX5
 * type T1 = X | Y
 * type T2 = A | T1 | B // T2 = A | X | Y | B
 */

/**
 * @name paragraph_with_alignment_node
 */
export type ParagraphWithAlignmentDefinition = ParagraphBaseDefinition &
  MarksObject<AlignmentMarkDefinition>;

/**
 * @name paragraph_with_indentation_node
 */
export type ParagraphWithIndentationDefinition = ParagraphBaseDefinition &
  MarksObject<IndentationMarkDefinition>;

export type ParagraphWithMarksDefinition =
  | ParagraphWithAlignmentDefinition
  | ParagraphWithIndentationDefinition;

const getLinkContent = (node: Node, schema: Schema) => {
  if (!(node instanceof HTMLAnchorElement)) {
    return Fragment.empty;
  }

  const href = node.getAttribute('href') || '';
  const text = node.innerText;

  if (!text || text.length === 0) {
    return Fragment.empty;
  }

  const marks = isSafeUrl(href)
    ? [
        schema.marks.link.create({
          href,
        }),
      ]
    : [];

  const textNode = schema.text(text, marks);

  return Fragment.from(textNode);
};

const blockTags = {
  address: true,
  article: true,
  aside: true,
  blockquote: true,
  canvas: true,
  dd: true,
  div: true,
  dl: true,
  fieldset: true,
  figcaption: true,
  figure: true,
  footer: true,
  form: true,
  h1: true,
  h2: true,
  h3: true,
  h4: true,
  h5: true,
  h6: true,
  header: true,
  hgroup: true,
  hr: true,
  li: true,
  noscript: true,
  ol: true,
  output: true,
  p: true,
  pre: true,
  section: true,
  table: true,
  tfoot: true,
  ul: true,
};

const isListItemNode = (node: Node | null): boolean => {
  return Boolean(node && node.nodeName.toLowerCase() === 'li');
};

const isTextNode = (node: Node | null): boolean => {
  return Boolean(node && node.nodeType === Node.TEXT_NODE);
};

const isImageNode = (node: Node | null): boolean => {
  return Boolean(node && node.nodeName.toLowerCase() === 'img');
};

const hasInlineImage = (node: Node | null): boolean => {
  if (!node) {
    return false;
  }

  return Array.from(node.childNodes).some((child) => {
    const isImage = isImageNode(child);

    if (!isImage && child.childNodes) {
      return Array.from(node.childNodes).some((node) => hasInlineImage(node));
    }

    return isImage;
  });
};

const hasWhiteSpacePre = (node: Node | null): boolean => {
  return Boolean(
    node instanceof HTMLElement && node.style.whiteSpace === 'pre',
  );
};

const hasFontFamilyMonospace = (node: Node | null): boolean => {
  return Boolean(
    node instanceof HTMLElement && node.style.fontFamily.includes('monospace'),
  );
};

const isBlockLevelNode = (node: Node | null): boolean => {
  return Boolean(node && blockTags.hasOwnProperty(node.nodeName.toLowerCase()));
};

const NOT_INTERNAL_LINKS = [
  ':not([data-inline-card])',
  ':not([data-block-card])',
  ':not([data-block-link])',
  ':not([data-skip-paste])',
].join('');

const ANCHOR_LINK = `a[href]${NOT_INTERNAL_LINKS}`;

const NOT_INTERNAL_ELEMENTS = [
  ':not(.code-block)',
  ':not([data-node-type])',
  ':not([data-embed-card])',
  ':not([data-layout-section])',
  ':not([data-pm-slice])',
  ':not([data-mark-type])',
].join('');

const pDOM: DOMOutputSpec = ['p', 0];
export const paragraph: NodeSpec = {
  selectable: false,
  content: 'inline*',
  group: 'block',
  marks:
    'strong code em link strike subsup textColor typeAheadQuery underline confluenceInlineComment action annotation unsupportedMark unsupportedNodeAttribute dataConsumer fragment',
  parseDOM: [
    { tag: 'p' },
    {
      tag: `div${NOT_INTERNAL_ELEMENTS}, li:not([data-pm-slice])`,
      priority: 100,
      getAttrs: (node) => {
        if (!(node instanceof Node)) {
          return false;
        }

        const isCodeBlock =
          hasWhiteSpacePre(node) || hasFontFamilyMonospace(node);

        if (isCodeBlock || !node.hasChildNodes()) {
          return false;
        }

        const hasInlineChildren = Array.from(node.childNodes).every(
          (child) =>
            !isBlockLevelNode(child) &&
            // IMG is considered block for mediaSingle
            !isImageNode(child),
        );

        if (!hasInlineChildren) {
          return false;
        }

        if (
          // We can skip this rule for pure list items
          isListItemNode(node) &&
          Array.from(node.childNodes).every(isTextNode)
        ) {
          return false;
        }

        return null;
      },
    },
    {
      tag: `:not(span) + ${ANCHOR_LINK}`,
      priority: 100,
      getContent: getLinkContent,
    },
    {
      tag: `:not(span) > ${ANCHOR_LINK}:first-child`,
      getAttrs: (node) => {
        if (!(node instanceof Node)) {
          return false;
        }

        if (isBlockLevelNode(node.firstChild)) {
          return null;
        }

        if (hasInlineImage(node)) {
          return false;
        }

        const isNextSiblingValid =
          node.nextSibling === null ||
          (node.nextSibling instanceof Text &&
            (node.nextSibling.textContent || '').trim().length === 0);

        if (isNextSiblingValid) {
          return null;
        }

        // This rule should not match when there is any sibling after the anchor
        if (!isBlockLevelNode(node.nextSibling)) {
          return false;
        }

        return null;
      },
      priority: 100,
      getContent: getLinkContent,
    },
  ],
  toDOM() {
    return pDOM;
  },
};
