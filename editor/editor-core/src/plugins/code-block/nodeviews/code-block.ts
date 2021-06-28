import rafSchedule from 'raf-schd';
import { EditorView } from 'prosemirror-view';
import { Node, DOMSerializer, DOMOutputSpec } from 'prosemirror-model';
import { getPosHandlerNode, getPosHandler } from '../../../nodeviews/';
import { codeBlockClassNames } from '../ui/class-names';

const MATCH_NEWLINES = new RegExp('\n', 'g');

const toDOM = (node: Node) =>
  [
    'div',
    { class: 'code-block' },
    ['div', { class: codeBlockClassNames.gutter, contenteditable: 'false' }],
    [
      'div',
      { class: codeBlockClassNames.content },
      [
        'code',
        {
          'data-language': node.attrs.language || '',
          spellcheck: 'false',
          contenteditable: 'true',
        },
        0,
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
  }

  private ensureLineNumbers = rafSchedule(() => {
    let lines = 1;
    this.node.forEach((node) => {
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
}

export const codeBlockNodeView = () => (
  node: Node,
  view: EditorView,
  getPos: getPosHandler,
) => new CodeBlockView(node, view, getPos as getPosHandlerNode);
