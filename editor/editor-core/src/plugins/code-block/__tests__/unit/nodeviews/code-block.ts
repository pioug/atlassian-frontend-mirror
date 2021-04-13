import createStub from 'raf-stub';
import {
  code_block,
  doc,
  p,
  RefsNode,
} from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { codeBlockNodeView } from '../../../nodeviews/code-block';
import { createProsemirrorEditorFactory } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

const codeBlock = (attrs?: {}) => (...args: any) =>
  code_block(attrs)(...args)(defaultSchema);

const createCodeBlockNodeview = (node: RefsNode) => {
  const { editorView } = createProsemirrorEditorFactory()({
    doc: doc(p()),
  });
  return codeBlockNodeView()(node, editorView, () => -1);
};

describe('Code Block - NodeView', () => {
  let waitForAnimationFrame: any;

  beforeEach(() => {
    let stub = createStub();
    waitForAnimationFrame = stub.flush;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(stub.add);
  });

  afterEach(() => {
    ((window.requestAnimationFrame as any) as jest.SpyInstance<
      any
    >).mockClear();
  });

  describe('on initial render', () => {
    it('should render a contentDOM of `code`', () => {
      const node = codeBlock()('this is code');
      const nodeView = createCodeBlockNodeview(node);

      expect(nodeView.contentDOM.tagName).toBe('CODE');
    });

    it('should render language on contentDOM as `data-language`', () => {
      const node = codeBlock({ language: 'custom' })('this is code');
      const nodeView = createCodeBlockNodeview(node);
      expect(nodeView.contentDOM.getAttribute('data-language')).toBe('custom');
    });
  });

  describe('#update', () => {
    it('should update if node is the same', () => {
      const node = codeBlock()('this is code');
      const nodeView = createCodeBlockNodeview(node);
      expect(nodeView.update(node)).toBeTruthy();
    });

    it('should update line numbers if node has changed', () => {
      const oldNode = codeBlock()('this is code');
      const nodeView = createCodeBlockNodeview(oldNode);
      waitForAnimationFrame();
      expect(nodeView.lineNumberGutter.childElementCount).toBe(1);

      const newNode = codeBlock()('this is code\n');
      expect(nodeView.update(newNode)).toBeTruthy();
      waitForAnimationFrame();
      expect(nodeView.lineNumberGutter.childElementCount).toBe(2);
    });

    it('should update language on contentDOM if changed', () => {
      const oldNode = codeBlock({ language: 'custom' })('this is code');
      const nodeView = createCodeBlockNodeview(oldNode);
      waitForAnimationFrame();

      const newNode = codeBlock({ language: 'different' })('this is code');
      expect(nodeView.update(newNode)).toBeTruthy();
      waitForAnimationFrame();
      expect(nodeView.contentDOM.getAttribute('data-language')).toBe(
        'different',
      );
    });
  });

  describe('line numbers', () => {
    it('should delay updating lineNumbers until the next animation frame', () => {
      const node = codeBlock()('this is code');
      const nodeView = createCodeBlockNodeview(node);
      expect(nodeView.lineNumberGutter.childElementCount).toBe(0);
      waitForAnimationFrame();
      expect(nodeView.lineNumberGutter.childElementCount).toBe(1);
    });
    it('should render one spans in lineNumberGutter when node text has no newlines', () => {
      const node = codeBlock()('this is code');
      const nodeView = createCodeBlockNodeview(node);
      waitForAnimationFrame();
      expect(nodeView.lineNumberGutter.childElementCount).toBe(1);
    });
    it('should render two spans in lineNumberGutter when node text has one newline', () => {
      const node = codeBlock()('this is code\nwith a newline');
      const nodeView = createCodeBlockNodeview(node);
      waitForAnimationFrame();
      expect(nodeView.lineNumberGutter.childElementCount).toBe(2);
    });
    it('should render one span in lineNumberGutter when node has two newline-less text children', () => {
      const node = codeBlock()('this is code', 'and more text');
      const nodeView = createCodeBlockNodeview(node);
      waitForAnimationFrame();
      expect(nodeView.lineNumberGutter.childElementCount).toBe(1);
    });
  });

  describe('#ignoreMutation', () => {
    it('should ignore any mutation to the lineNumberGutter dom', () => {
      const node = codeBlock()('this is code');
      const nodeView = createCodeBlockNodeview(node);
      waitForAnimationFrame();

      const mutation: MutationRecord = {
        target: nodeView.lineNumberGutter,
      } as any;
      expect(nodeView.ignoreMutation(mutation)).toBe(true);
    });
    it('should ignore mutation when lineNumberGutter children change', () => {
      const node = codeBlock()('this is code');
      const nodeView = createCodeBlockNodeview(node);
      waitForAnimationFrame();

      const mutation: MutationRecord = {
        target: nodeView.lineNumberGutter.lastChild!,
      } as any;
      expect(nodeView.ignoreMutation(mutation)).toBe(true);
    });
    it('should not ignore any mutation to the contentDOM', () => {
      const node = codeBlock()('this is code');
      const nodeView = createCodeBlockNodeview(node);
      waitForAnimationFrame();

      const mutation: MutationRecord = {
        target: nodeView.contentDOM,
      } as any;
      expect(nodeView.ignoreMutation(mutation)).toBe(false);
    });
  });
});
