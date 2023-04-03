import React from 'react';
import { render, screen } from '@testing-library/react';
import { EditorView } from 'prosemirror-view';
import { createIntl } from 'react-intl-next';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  tdCursor,
  tdEmpty,
  th,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';
import tablePlugin from '../../../plugins/table-plugin';

import { ContextualMenu } from '../../../plugins/table/ui/FloatingContextualMenu/ContextualMenu';

describe('ContextualMenu', () => {
  const getEditorContainerWidth = () => ({ width: 500 });
  const getEditorFeatureFlags = () => ({});
  const createEditor = createProsemirrorEditorFactory();
  describe('with right table cell position in plugin state', () => {
    let editorView: EditorView;
    beforeEach(() => {
      ({ editorView } = createEditor({
        doc: doc(table()(tr(th()(p('')), th()(p(''))), tr(tdCursor, tdEmpty))),
        preset: new Preset<LightEditorPlugin>().add([
          tablePlugin,
          { tableOptions: { advanced: true } },
        ]),
      }));
    });

    it('should render contextual menu when no tableCellPosition is passed but exist on editor state ', () => {
      const intl = createIntl({ locale: 'en' });
      render(
        <ContextualMenu
          intl={intl}
          editorView={editorView}
          isOpen
          selectionRect={{ bottom: 0, left: 0, right: 0, top: 0 }}
          getEditorContainerWidth={getEditorContainerWidth}
          getEditorFeatureFlags={getEditorFeatureFlags}
        />,
      );

      expect(
        screen.getByTestId('table-cell-contextual-menu'),
      ).toBeInTheDocument();
    });
  });
});
