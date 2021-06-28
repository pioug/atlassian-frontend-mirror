import { NodeSpec, Node as PMNode, Fragment } from 'prosemirror-model';
import { TextDefinition as Text } from './text';
import { BreakoutMarkDefinition } from '../marks/breakout';
import { MarksObject, NoMark } from './types/mark';

/**
 * @name codeBlock_node
 */
export type CodeBlockBaseDefinition = {
  type: 'codeBlock';
  /**
   * @allowUnsupportedInline true
   */
  content?: Array<Text & NoMark>;
  marks?: Array<any>;
  attrs?: CodeBlockAttrs;
};

export type CodeBlockAttrs = {
  language?: string;
};

/**
 * @name codeBlock_with_no_marks_node
 */
export type CodeBlockDefinition = CodeBlockBaseDefinition & NoMark;

/**
 * @name codeBlock_with_marks_node
 */
export type CodeBlockWithMarksDefinition = CodeBlockBaseDefinition &
  MarksObject<BreakoutMarkDefinition>;

const getLanguageFromEditorStyle = (dom: HTMLElement): string | undefined => {
  return dom.getAttribute('data-language') || undefined;
};

// example of BB style:
// <div class="codehilite language-javascript"><pre><span>hello world</span><span>\n</span></pre></div>
const getLanguageFromBitbucketStyle = (
  dom: HTMLElement,
): string | undefined => {
  if (dom && dom.classList.contains('codehilite')) {
    // code block html from Bitbucket always contains an extra new line
    return extractLanguageFromClass(dom.className);
  }
  return;
};

// If there is a child code element, check that for data-language
const getLanguageFromCode = (dom: HTMLElement): string | undefined => {
  const firstChild = dom.firstElementChild;
  if (firstChild && firstChild.nodeName === 'CODE') {
    return firstChild.getAttribute('data-language') || undefined;
  }
};

const extractLanguageFromClass = (className: string): string | undefined => {
  const languageRegex = /(?:^|\s)language-([^\s]+)/;
  const result = languageRegex.exec(className);
  if (result && result[1]) {
    return result[1];
  }
  return;
};

const removeLastNewLine = (dom: HTMLElement): HTMLElement => {
  const parent = dom && dom.parentElement;
  if (parent && parent.classList.contains('codehilite')) {
    dom.textContent = dom.textContent!.replace(/\n$/, '');
  }
  return dom;
};

export const codeBlock: NodeSpec = {
  attrs: { language: { default: null }, uniqueId: { default: null } },
  content: '(text | unsupportedInline)*',
  marks: 'unsupportedMark unsupportedNodeAttribute',
  group: 'block',
  code: true,
  defining: true,
  parseDOM: [
    {
      tag: 'pre',
      preserveWhitespace: 'full',
      getAttrs: (domNode) => {
        let dom = domNode as HTMLElement;
        const language =
          getLanguageFromBitbucketStyle(dom.parentElement!) ||
          getLanguageFromEditorStyle(dom.parentElement!) ||
          getLanguageFromCode(dom) ||
          dom.getAttribute('data-language')!;
        dom = removeLastNewLine(dom);
        return { language };
      },
    },
    // Handle VSCode paste
    // Checking `white-space: pre-wrap` is too aggressive @see ED-2627
    {
      tag: 'div[style]',
      preserveWhitespace: 'full',
      getAttrs: (domNode) => {
        const dom = domNode as HTMLElement;
        if (
          dom.style.whiteSpace === 'pre' ||
          (dom.style.fontFamily &&
            dom.style.fontFamily.toLowerCase().indexOf('monospace') > -1)
        ) {
          return {};
        }
        return false;
      },
      // @see ED-5682
      getContent: (domNode, schema) => {
        const dom = domNode as HTMLElement;
        const code = Array.from(dom.children)
          .map((child) => child.textContent)
          .filter((x) => x !== undefined)
          .join('\n');
        return code ? Fragment.from(schema.text(code)) : Fragment.empty;
      },
    },
    // Handle GitHub/Gist paste
    {
      tag: 'table[style]',
      preserveWhitespace: 'full',
      getAttrs: (dom) => {
        if ((dom as HTMLElement).querySelector('td[class*="blob-code"]')) {
          return {};
        }
        return false;
      },
    },
    {
      tag: 'div.code-block',
      preserveWhitespace: 'full',
      getAttrs: (domNode) => {
        const dom = domNode as HTMLElement;
        // TODO: ED-5604 Fix it inside `react-syntax-highlighter`
        // Remove line numbers
        const lineNumber = dom.querySelectorAll(
          '.react-syntax-highlighter-line-number',
        );

        if (lineNumber.length > 0) {
          // It's possible to copy without the line numbers too hence this
          // `react-syntax-highlighter-line-number` check, so that we don't remove real code
          lineNumber.forEach((line) => line.remove());
        }
        return {};
      },
    },
  ],
  toDOM(node) {
    return ['pre', ['code', { 'data-language': node.attrs.language }, 0]];
  },
};

export const toJSON = (node: PMNode) => ({
  attrs: Object.keys(node.attrs).reduce<Record<string, any>>((memo, key) => {
    if (key === 'uniqueId') {
      return memo;
    }

    if (key === 'language' && node.attrs.language === null) {
      return memo;
    }

    memo[key] = node.attrs[key];
    return memo;
  }, {}),
});
