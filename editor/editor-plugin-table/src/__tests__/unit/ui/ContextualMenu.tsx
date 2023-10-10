import React from 'react';

import { render, screen } from '@testing-library/react';
import { createIntl } from 'react-intl-next';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
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
  const createEditor = createProsemirrorEditorFactory();
  describe('with right table cell position in plugin state', () => {
    let editorView: EditorView;
    beforeEach(() => {
      ({ editorView } = createEditor({
        doc: doc(table()(tr(th()(p('')), th()(p(''))), tr(tdCursor, tdEmpty))),
        preset: new Preset<LightEditorPlugin>()
          .add([featureFlagsPlugin, {}])
          .add([analyticsPlugin, {}])
          .add(contentInsertionPlugin)
          .add(widthPlugin)
          .add(guidelinePlugin)
          .add(selectionPlugin)
          .add([tablePlugin, { tableOptions: { advanced: true } }]),
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
        />,
      );

      expect(
        screen.getByTestId('table-cell-contextual-menu'),
      ).toBeInTheDocument();
    });
  });
});
