import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
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
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table-plugin';
import { hoverTable } from '../../../plugins/table/commands';
import { getDecorations } from '../../../plugins/table/pm-plugins/decorations/plugin';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import type { TablePluginState } from '../../../plugins/table/types';
import TableFloatingControls from '../../../plugins/table/ui/TableFloatingControls';

describe('TableFloatingControls', () => {
  const createEditor = createProsemirrorEditorFactory();
  const fakeGetEditorFeatureFlags = () => ({});
  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, {}])
    .add(contentInsertionPlugin)
    .add(widthPlugin)
    .add(guidelinePlugin)
    .add(selectionPlugin)
    .add(tablePlugin);

  const editor = (doc: DocBuilder) =>
    createEditor<TablePluginState, PluginKey, typeof preset>({
      doc,
      preset,
      pluginKey: pluginKey,
    });

  describe('when tableRef is undefined', () => {
    it('should not render table header', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      );
      const { container } = render(
        <TableFloatingControls
          editorView={editorView}
          getEditorFeatureFlags={fakeGetEditorFeatureFlags}
        />,
      );
      expect(container.innerHTML).toEqual('');
    });
  });

  describe('when tableRef is defined', () => {
    it('should render CornerControls and RowControls', () => {
      const { editorView } = editor(
        doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      );
      const ref = editorView.dom.querySelector('table') || undefined;

      render(
        <IntlProvider locale="en">
          <TableFloatingControls
            tableRef={ref}
            tableActive={true}
            editorView={editorView}
            getEditorFeatureFlags={fakeGetEditorFeatureFlags}
          />
        </IntlProvider>,
      );

      expect(screen.getByLabelText('Highlight row')).toBeTruthy();
      expect(screen.getByLabelText('Highlight table')).toBeTruthy();
    });
  });

  describe('when delete icon is hovered', () => {
    it('should add a node decoration to table nodeView with class="danger"', () => {
      const { editorView } = editor(
        doc(
          p('text'),
          table()(
            tr(tdCursor, tdEmpty),
            tr(tdEmpty, tdEmpty),
            tr(tdEmpty, tdEmpty),
          ),
        ),
      );
      hoverTable(true)(editorView.state, editorView.dispatch);
      const decorationSet = getDecorations(editorView.state);
      const decoration = decorationSet.find()[0] as any;
      expect(decoration.type.attrs.class.indexOf('danger')).toBeGreaterThan(-1);
    });
  });
});
