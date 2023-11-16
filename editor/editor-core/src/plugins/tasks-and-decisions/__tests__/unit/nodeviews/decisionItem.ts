// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  decisionItem,
  doc,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';

import { decisionItemNodeView } from '../../../nodeviews/decisionItem';

describe('Decision Item - NodeView', () => {
  const createEditor = createEditorFactory();
  const portalProviderAPI = { render() {}, remove() {} } as any;
  const eventDispatcher = {} as EventDispatcher;

  it('should render a contentDOM of `div` inside `li`', () => {
    const { editorView } = createEditor({
      doc: doc(p()),
    });
    const node = decisionItem()('this is the decision')(defaultSchema);

    const nodeView = decisionItemNodeView(
      portalProviderAPI,
      eventDispatcher,
      undefined,
    )(node, editorView, () => -1);

    if (nodeView instanceof ReactNodeView) {
      const contentDOM = nodeView.contentDOM as HTMLElement;

      expect(contentDOM.tagName).toBe('DIV');
      expect(contentDOM.parentElement!.tagName).toBe('LI');

      editorView.destroy();
      nodeView.destroy();
    }
  });
});
