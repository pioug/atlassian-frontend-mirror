import ReactDOM from 'react-dom';
import { EditorView } from 'prosemirror-view';
import { Node, DOMSerializer, DOMOutputSpec } from 'prosemirror-model';
import { CodeBlock } from '@atlaskit/code';
import { getPosHandlerNode, getPosHandler } from '../../../nodeviews/';
import { codeBlockClassNames } from '../ui/class-names';
import React from 'react';
import { percentile } from '../../../utils/performance/percentile';

const GUTTER = `.${codeBlockClassNames.gutter}`;
const HIGHLIGHT = `.${codeBlockClassNames.highlighting}`;
const CONTENT = `.${codeBlockClassNames.content}`;
const NOOP_LANGUAGES = [null, undefined, 'none', 'plaintext'];

const toDOM = (node: Node): DOMOutputSpec => [
  'div',
  { class: 'code-block' },
  ['div', { class: codeBlockClassNames.gutter, contenteditable: 'false' }],
  [
    'div',
    { class: codeBlockClassNames.content, 'data-debounce': 'false' },
    [
      'code',
      {
        'data-language': node.attrs.language || '',
        spellcheck: 'false',
        contenteditable: 'true',
      },
      0,
    ],
    [
      'div',
      { class: codeBlockClassNames.highlighting, contenteditable: 'false' },
    ],
  ],
];

export class CodeBlockView {
  node: Node;
  dom: HTMLElement;
  contentDOM: HTMLElement;
  lineNumberGutter: HTMLElement;
  highlighting: HTMLElement | null = null;
  highlighter: React.ReactElement | null = null;
  getPos: getPosHandlerNode;
  view: EditorView;

  measurements: number[] = [];
  count = 0;
  shouldDebounce = false;
  timer: number | null = null;

  constructor(node: Node, view: EditorView, getPos: getPosHandlerNode) {
    const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(node));
    this.getPos = getPos;
    this.view = view;
    this.node = node;
    this.dom = dom as HTMLElement;
    this.contentDOM = contentDOM as HTMLElement;

    this.lineNumberGutter = this.dom.querySelector<HTMLElement>(GUTTER)!;
    this.ensureLineNumbers();

    this.highlight(node);
  }

  private measure(measurement: number) {
    const index = this.count % 10;
    this.count++;
    this.measurements[index] = measurement;
  }

  private highlight(node = this.node, forced = false) {
    if (NOOP_LANGUAGES.includes(node.attrs.language)) {
      return;
    }

    const highlighting = this.dom.querySelector<HTMLElement>(HIGHLIGHT);
    const content = this.dom.querySelector<HTMLElement>(CONTENT);

    if (this.timer) {
      clearTimeout(this.timer);
    }

    if (this.shouldDebounce && !forced && content) {
      content.setAttribute('data-debounce', 'true');

      this.timer = (setTimeout(
        () => this.highlight(node, true),
        (percentile(this.measurements, 0.99) ?? 100) * 10,
      ) as unknown) as number;

      return;
    }

    const start = performance.now();

    ReactDOM.render(
      React.createElement(CodeBlock, {
        text: node.textContent,
        language: node.attrs.language,
        showLineNumbers: false,
      }),
      highlighting,
    );

    this.measure(performance.now() - start);

    content?.setAttribute('data-debounce', 'false');

    this.shouldDebounce =
      (percentile(this.measurements, 0.99) ?? 0) >= 100 ||
      (percentile(this.measurements, 0.95) ?? 0) >= 30;
  }

  private ensureLineNumbers = (node: Node = this.node) => {
    const lines = node.textContent.split('\n').length;

    while (this.lineNumberGutter.childElementCount < lines) {
      this.lineNumberGutter.appendChild(document.createElement('span'));
    }
    while (this.lineNumberGutter.childElementCount > lines) {
      this.lineNumberGutter.removeChild(this.lineNumberGutter.lastChild!);
    }
  };

  update(node: Node) {
    if (node.type !== this.node.type) {
      return false;
    }

    if (node.textContent !== this.node.textContent) {
      this.ensureLineNumbers(node);
    }

    if (node.attrs.language !== this.node.attrs.language) {
      this.contentDOM.setAttribute('data-language', node.attrs.language || '');
    }

    if (
      node.textContent !== this.node.textContent ||
      node.attrs.language !== this.node.attrs.language
    ) {
      this.highlight(node);
    }

    this.node = node;
    return true;
  }

  ignoreMutation(
    record: MutationRecord | { type: 'selection'; target: Element },
  ) {
    return (
      record.target === this.lineNumberGutter ||
      record.target.parentNode === this.lineNumberGutter ||
      (this.highlighting?.contains(record.target) ?? false)
    );
  }
}

export const highlightingCodeBlockNodeView = () => (
  node: Node,
  view: EditorView,
  getPos: getPosHandler,
) => new CodeBlockView(node, view, getPos as getPosHandlerNode);
