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
  td,
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table-plugin';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
// import { TableCssClassName as ClassName } from '../../../plugins/table/types';
import { DragControls } from '../../../plugins/table/ui/TableFloatingControls/RowControls';

describe('NumberColumn', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder, tableOptions = {}) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, {}])
        .add(contentInsertionPlugin)
        .add(widthPlugin)
        .add(guidelinePlugin)
        .add(selectionPlugin)
        .add([tablePlugin, { tableOptions }]),
      pluginKey: pluginKey,
    });

  it('should only render one child container if hovered cell provided', () => {
    const { editorView } = editor(
      doc(
        p('text'),
        table()(
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(td({})(p('\n\n\n\n\n')), tdEmpty, tdEmpty),
        ),
      ),
      { dragAndDropEnabled: true },
    );
    const ref = editorView.dom.querySelector('table');

    render(
      <IntlProvider locale="en">
        <DragControls
          tableRef={ref!}
          tableActive
          editorView={editorView}
          hoveredCell={{ rowIndex: 1, colIndex: 1 }}
          hoverRows={jest.fn()}
          selectRow={jest.fn()}
          updateCellHoverLocation={jest.fn()}
        />
      </IntlProvider>,
    );

    const dragHandle = screen.getAllByTestId('table-floating-row-drag-handle');

    expect(dragHandle.length).toBe(1);
  });

  it('should not render any drag handle containers if hoveredCell is undefined', () => {
    const { editorView } = editor(
      doc(
        p('text'),
        table()(
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(tdEmpty, tdEmpty, tdEmpty),
          tr(td({})(p('\n\n\n\n\n')), tdEmpty, tdEmpty),
        ),
      ),
      { dragAndDropEnabled: true },
    );
    const ref = editorView.dom.querySelector('table');

    render(
      <IntlProvider locale="en">
        <DragControls
          tableRef={ref!}
          tableActive
          editorView={editorView}
          hoveredCell={{
            colIndex: undefined,
            rowIndex: undefined,
          }}
          hoverRows={jest.fn()}
          selectRow={jest.fn()}
          updateCellHoverLocation={jest.fn()}
        />
      </IntlProvider>,
    );

    const dragHandle = screen.queryAllByTestId(
      'table-floating-row-drag-handle',
    );

    expect(dragHandle.length).toBe(0);
  });
});
