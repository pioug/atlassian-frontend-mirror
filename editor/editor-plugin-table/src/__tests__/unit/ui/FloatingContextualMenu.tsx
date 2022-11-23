import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorView } from 'prosemirror-view';
import { IntlProvider } from 'react-intl-next';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  table,
  tdCursor,
  tdEmpty,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { getPluginState } from '../../../plugins/table/pm-plugins/plugin-factory';
import FloatingContextualMenu from '../../../plugins/table/ui/FloatingContextualMenu';
import { TablePluginState } from '../../../plugins/table/types';
import tablePlugin from '../../../plugins/table-plugin';

describe('FloatingContextualMenu', () => {
  const createEditor = createEditorFactory<TablePluginState>();
  describe('with right position in plugin state', () => {
    let editorView: EditorView;
    beforeEach(() => {
      ({ editorView } = createEditor({
        doc: doc(table()(tr(th()(p('')), th()(p(''))), tr(tdCursor, tdEmpty))),
        editorProps: {
          allowTables: false,
          dangerouslyAppendPlugins: { __plugins: [tablePlugin()] },
        },
      }));
    });

    it('should render floating contextual menu when no tableCellPosition is passed but exist on editor state ', () => {
      render(
        <IntlProvider locale="en">
          <FloatingContextualMenu
            editorView={editorView}
            isOpen
            pluginConfig={getPluginState(editorView.state).pluginConfig}
            getEditorContainerWidth={jest.fn()}
          />
        </IntlProvider>,
      );
      expect(screen.getAllByLabelText('Popup').length).toBeGreaterThan(0);
    });
  });
});
