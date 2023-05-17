import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import React from 'react';

import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import {
  doc,
  p,
  table,
  tr,
  tdEmpty,
  tdCursor,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { TablePluginState } from '../../../plugins/table/types';
import { hoverTable } from '../../../plugins/table/commands';
import TableFloatingControls from '../../../plugins/table/ui/TableFloatingControls';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import { getDecorations } from '../../../plugins/table/pm-plugins/decorations/plugin';
import tablePlugin from '../../../plugins/table-plugin';
import { PluginKey } from 'prosemirror-state';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';

describe('TableFloatingControls', () => {
  const createEditor = createProsemirrorEditorFactory();
  const fakeGetEditorFeatureFlags = () => ({});
  const preset = new Preset<LightEditorPlugin>()
    .add([featureFlagsPlugin, {}])
    .add([analyticsPlugin, {}])
    .add(contentInsertionPlugin)
    .add(tablePlugin);

  const editor = (doc: DocBuilder) =>
    createEditor<TablePluginState, PluginKey>({
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
