import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import selectionPlugin from '@atlaskit/editor-core/src/plugins/selection';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import { isTableSelected } from '@atlaskit/editor-tables/utils';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  table,
  thEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table-plugin';
import { getPluginState } from '../../../plugins/table/pm-plugins/plugin-factory';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import { CornerControls } from '../../../plugins/table/ui/TableFloatingControls/CornerControls';

describe('CornerControls', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(selectionPlugin)
        .add(tablePlugin),
      pluginKey,
    });

  describe('when button is clicked', () => {
    it('should select the table', () => {
      const { editorView } = editor(
        doc(table()(tr(thEmpty, thEmpty, thEmpty))),
      );

      const ref = editorView.dom.querySelector('table') || undefined;

      render(
        <IntlProvider locale="en">
          <CornerControls tableRef={ref} editorView={editorView} />
        </IntlProvider>,
      );

      const cornerControl = screen.getByLabelText('Highlight table');

      fireEvent.click(cornerControl);

      expect(isTableSelected(editorView.state.selection)).toBe(true);
    });
  });

  describe('when button is hovered', () => {
    it('should highlight the table with hover decoration', () => {
      const { editorView } = editor(
        doc(
          table()(tr(thEmpty, thEmpty, thEmpty), tr(thEmpty, thEmpty, thEmpty)),
        ),
      );

      const ref = editorView.dom.querySelector('table') || undefined;

      render(
        <IntlProvider locale="en">
          <CornerControls tableRef={ref} editorView={editorView} />
        </IntlProvider>,
      );

      const cornerControl = screen.getByLabelText('Highlight table');

      fireEvent.mouseOver(cornerControl);

      const { hoveredColumns, hoveredRows } = getPluginState(editorView.state);
      expect(hoveredColumns).toEqual([0, 1, 2]);
      expect(hoveredRows).toEqual([0, 1]);
    });
  });
});
