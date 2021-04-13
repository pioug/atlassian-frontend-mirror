import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { doc, p, taskItem } from '@atlaskit/editor-test-helpers/doc-builder';

import { EventDispatcher } from '../../../../../event-dispatcher';
import ReactNodeView from '../../../../../nodeviews/ReactNodeView';
import { taskItemNodeViewFactory } from '../../../../../plugins/tasks-and-decisions/nodeviews/taskItem';

describe('Task Item - NodeView', () => {
  const createEditor = createEditorFactory();

  const providerFactory = {} as any;
  const eventDispatcher = {} as EventDispatcher;
  const portalProviderAPI = { render() {}, remove() {} } as any;

  it('should render a contentDOM of `div` inside `div`', () => {
    const { editorView } = createEditor({
      doc: doc(p()),
    });
    const node = taskItem()('this is the task')(defaultSchema);

    const nodeView = taskItemNodeViewFactory(
      portalProviderAPI,
      eventDispatcher,
      providerFactory,
    )(node, editorView, () => -1);

    if (nodeView instanceof ReactNodeView) {
      const contentDOM = nodeView.contentDOM as HTMLElement;

      expect(contentDOM.tagName).toBe('DIV');
      expect(contentDOM.parentElement!.tagName).toBe('DIV');

      editorView.destroy();
      nodeView.destroy();
    }
  });
});
