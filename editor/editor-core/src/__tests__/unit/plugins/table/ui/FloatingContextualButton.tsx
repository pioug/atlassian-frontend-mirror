import { ReactWrapper } from 'enzyme';
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';
import { EditorView } from 'prosemirror-view';
import React from 'react';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import {
  doc,
  table,
  tdCursor,
  tdEmpty,
  thEmpty,
  tr,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { TablePluginState } from '../../../../../plugins/table/types';
import FloatingContextualButton, {
  Props as FloatingContextualButtonProps,
  FloatingContextualButtonInner,
} from '../../../../../plugins/table/ui/FloatingContextualButton';

describe('Floating Contextual Button', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  let createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: { allowTables: true },
      createAnalyticsEvent,
    });

  let wrapper: ReactWrapper<FloatingContextualButtonProps>;
  let editorView: EditorView;
  let refs: { [name: string]: number };

  beforeEach(() => {
    ({ editorView, refs } = editor(
      doc(
        table()(
          tr('{firstCell}', thEmpty, thEmpty, thEmpty),
          tr(tdCursor, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
        ),
      ),
    ));

    const tableNode = findParentNodeOfTypeClosestToPos(
      editorView.state.selection.$from,
      editorView.state.schema.nodes.table,
    );

    wrapper = mountWithIntl(
      <FloatingContextualButton
        editorView={editorView}
        tableNode={tableNode && tableNode.node}
        targetCellPosition={refs.firstCell}
        dispatchAnalyticsEvent={createAnalyticsEvent}
      />,
    );
  });

  describe('when an error is thrown in the component', () => {
    it('handles it gracefully', () => {
      const buttonWrapper = wrapper.find(FloatingContextualButtonInner);
      expect(() =>
        buttonWrapper.simulateError(new Error('Oh no!')),
      ).not.toThrow();
    });

    it('dispatches an analytics event', () => {
      wrapper
        .find(FloatingContextualButtonInner)
        .simulateError(new Error('Oh no!'));
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'unhandledErrorCaught',
        actionSubject: 'floatingContextualButton',
        eventType: 'operational',
        attributes: {
          error: new Error('Oh no!'),
          errorInfo: expect.objectContaining({
            componentStack: expect.stringContaining(
              'in FloatingContextualButton',
            ),
          }),
          errorRethrown: false,
        },
      });
    });
  });
});
