// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p, taskItem } from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

import { taskItemNodeViewFactory } from '../../../nodeviews/taskItem';

describe('Task Item - NodeView', () => {
  const createEditor = createEditorFactory();

  const providerFactory = {} as any;
  const eventDispatcher = {} as EventDispatcher;
  const portalProviderAPI = { render() {}, remove() {} } as any;
  let editorView: EditorView;
  let nodeView: NodeView;
  const getPos = () => 0;
  const Providers = ({ children }: { children: React.ReactNode }) => (
    <IntlProvider locale="en">{children}</IntlProvider>
  );

  beforeEach(() => {
    editorView = createEditor({
      doc: doc(p()),
    }).editorView;
    editorView.dispatch = jest.fn();
  });

  afterEach(jest.clearAllMocks);

  it('should render a contentDOM of `div` inside `div`', () => {
    const node = taskItem()('this is the task')(defaultSchema);

    nodeView = taskItemNodeViewFactory(
      portalProviderAPI,
      eventDispatcher,
      providerFactory,
      undefined,
    )(node, editorView, () => -1);

    if (nodeView instanceof ReactNodeView) {
      const contentDOM = nodeView.contentDOM as HTMLElement;

      expect(contentDOM.tagName).toBe('DIV');
      expect(contentDOM.parentElement!.tagName).toBe('DIV');

      editorView.destroy();
      nodeView.destroy();
    }
  });

  it('should dispatch a set attributes step when ticking the task checkbox', async () => {
    const taskItemNode = taskItem({ localId: '1234', state: 'TODO' })(
      'Do something with your life',
    )(defaultSchema);
    nodeView = taskItemNodeViewFactory(
      portalProviderAPI,
      eventDispatcher,
      providerFactory,
      undefined,
    )(taskItemNode, editorView, getPos);

    render((nodeView as ReactNodeView).render({})!, { wrapper: Providers });

    fireEvent.click(screen.getByRole('checkbox', { checked: false }));

    expect(editorView.dispatch).toHaveBeenCalledTimes(1);
    expect(
      (editorView.dispatch as jest.Mock).mock.calls[0][0].steps[0].toJSON(),
    ).toEqual({
      attrs: { localId: '1234', state: 'DONE' },
      pos: 0,
      stepType: 'setAttrs',
    });
  });

  it('should dispatch a set attributes step when un-ticking the task checkbox', async () => {
    const taskItemNode = taskItem({ localId: '4321', state: 'DONE' })(
      'Do nothing with your life',
    )(defaultSchema);
    nodeView = taskItemNodeViewFactory(
      portalProviderAPI,
      eventDispatcher,
      providerFactory,
      undefined,
    )(taskItemNode, editorView, getPos);

    render((nodeView as ReactNodeView).render({})!, { wrapper: Providers });

    fireEvent.click(screen.getByRole('checkbox', { checked: true }));

    expect(editorView.dispatch).toHaveBeenCalledTimes(1);
    expect(
      (editorView.dispatch as jest.Mock).mock.calls[0][0].steps[0].toJSON(),
    ).toEqual({
      attrs: { localId: '4321', state: 'TODO' },
      pos: 0,
      stepType: 'setAttrs',
    });
  });
});
