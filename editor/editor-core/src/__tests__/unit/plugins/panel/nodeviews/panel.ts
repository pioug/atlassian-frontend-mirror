import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { panelNodeView } from '../../../../../plugins/panel/nodeviews/panel';
import { doc, p, panel } from '@atlaskit/editor-test-helpers/schema-builder';
import { createProsemirrorEditorFactory } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

describe('Panel - NodeView', () => {
  const createEditor = createProsemirrorEditorFactory();
  it('should render a contentDOM of `div` inside `div[data-panel-type]`', () => {
    const { editorView } = createEditor({
      doc: doc(p()),
    });

    const node = panel()(p('this is the decision'))(defaultSchema);

    const nodeView = panelNodeView(node, editorView, () => -1);

    const contentDOM = nodeView!.contentDOM as HTMLElement;

    expect(contentDOM.tagName).toBe('DIV');
    expect(contentDOM.parentElement!.tagName).toBe('DIV');
    expect(contentDOM.parentElement!.getAttribute('data-panel-type')).toBe(
      'info',
    );
  });
});
