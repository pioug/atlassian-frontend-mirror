import rafSchedule from 'raf-schd';
import { EditorView } from 'prosemirror-view';
import { Node, DOMSerializer, DOMOutputSpec } from 'prosemirror-model';
import { browser } from '@atlaskit/editor-common';
import { getPosHandlerNode, getPosHandler } from '../../../nodeviews/';
import { selectNode } from '../../../utils/commands';
import { codeBlockClassNames } from '../ui/class-names';

const MATCH_NEWLINES = new RegExp('\n', 'g');

function isHtmlElement(n: EventTarget): n is HTMLElement {
  return (n as HTMLElement).nodeType === 1;
}
// For browsers <= IE11, we apply style overrides to render a basic code box
const isIE11 = browser.ie && browser.ie_version <= 11;
const toDOM = (node: Node) =>
  [
    'div',
    { class: 'code-block' + (isIE11 ? ' ie11' : '') },
    ['div', { class: codeBlockClassNames.gutter, contenteditable: 'false' }],
    [
      'div',
      { class: codeBlockClassNames.content },
      [
        'pre',
        [
          'code',
          { 'data-language': node.attrs.language || '', spellcheck: 'false' },
          0,
        ],
      ],
    ],
  ] as DOMOutputSpec;

export class CodeBlockView {
  node: Node;
  dom: HTMLElement;
  contentDOM: HTMLElement;
  lineNumberGutter: HTMLElement;
  getPos: getPosHandlerNode;
  view: EditorView;

  constructor(node: Node, view: EditorView, getPos: getPosHandlerNode) {
    const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(node));
    this.getPos = getPos;
    this.view = view;
    this.node = node;
    this.dom = dom as HTMLElement;
    this.contentDOM = contentDOM as HTMLElement;
    this.lineNumberGutter = this.dom.querySelector(
      `.${codeBlockClassNames.gutter}`,
    ) as HTMLElement;

    this.ensureLineNumbers();
    this.initHandlers();
  }

  private initHandlers() {
    if (this.dom) {
      this.dom.addEventListener('click', this.handleClick);
    }
  }

  private ensureLineNumbers = rafSchedule(() => {
    let lines = 1;
    this.node.forEach(node => {
      const text = node.text;
      if (text) {
        lines += (node.text!.match(MATCH_NEWLINES) || []).length;
      }
    });

    while (this.lineNumberGutter.childElementCount < lines) {
      this.lineNumberGutter.appendChild(document.createElement('span'));
    }
    while (this.lineNumberGutter.childElementCount > lines) {
      this.lineNumberGutter.removeChild(this.lineNumberGutter.lastChild!);
    }
  });

  update(node: Node) {
    if (node.type !== this.node.type) {
      return false;
    }
    if (node !== this.node) {
      if (node.attrs.language !== this.node.attrs.language) {
        this.contentDOM.setAttribute(
          'data-language',
          node.attrs.language || '',
        );
      }
      this.node = node;
      this.ensureLineNumbers();
    }
    return true;
  }

  ignoreMutation(
    record: MutationRecord | { type: 'selection'; target: Element },
  ) {
    // Ensure updating the line-number gutter doesn't trigger reparsing the codeblock
    return (
      record.target === this.lineNumberGutter ||
      record.target.parentNode === this.lineNumberGutter
    );
  }

  private handleClick = (event: Event) => {
    // Make sure event.target is an HTMLElement
    if (event.target === null || !isHtmlElement(event.target)) {
      return;
    }
    const target = event.target;

    // If clicking on the border of the code block
    const targetIsBorder = target === this.dom;

    // If clicking in the left gutter of the code block
    const targetIsGutter = target.closest(`.${codeBlockClassNames.gutter}`);

    // This gives us click leniency
    const targetIsContent = target.classList.contains(
      codeBlockClassNames.content,
    );

    if (targetIsBorder || targetIsGutter || targetIsContent) {
      event.stopPropagation();
      const { state, dispatch } = this.view;
      selectNode(this.getPos())(state, dispatch);
    }
  };
  destroy() {
    if (this.dom) {
      this.dom.removeEventListener('click', this.handleClick);
    }
  }
}

export const codeBlockNodeView = () => (
  node: Node,
  view: EditorView,
  getPos: getPosHandler,
) => new CodeBlockView(node, view, getPos as getPosHandlerNode);
