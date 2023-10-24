import React from 'react';

import { fireEvent, render } from '@testing-library/react';
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
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table-plugin';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import { TableCssClassName as ClassName } from '../../../plugins/table/types';
import NumberColumn from '../../../plugins/table/ui/TableFloatingControls/NumberColumn';

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

  it('should update plugin state for hovered cell - when drag and drop is enabled', () => {
    const { editorView } = editor(
      doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      { dragAndDropEnabled: true },
    );
    const hoverCellLocationMock = jest.fn();
    const ref = editorView.dom.querySelector('table');

    const { container } = render(
      <IntlProvider locale="en">
        <NumberColumn
          tableRef={ref!}
          tableActive
          editorView={editorView}
          hoverRows={jest.fn()}
          selectRow={jest.fn()}
          updateCellHoverLocation={hoverCellLocationMock}
          isDragAndDropEnabled
        />
      </IntlProvider>,
    );

    const firstNumberedCell = container.querySelector(
      `.${ClassName.NUMBERED_COLUMN} > div`,
    );

    fireEvent.mouseOver(firstNumberedCell!);

    expect(hoverCellLocationMock).toHaveBeenCalledWith(0);
  });

  it('should render button disabled numbered column cells - when drag and drop is enabled', () => {
    const { editorView } = editor(
      doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      { dragAndDropEnabled: true },
    );
    const ref = editorView.dom.querySelector('table');

    const { container } = render(
      <IntlProvider locale="en">
        <NumberColumn
          tableRef={ref!}
          tableActive
          editorView={editorView}
          hoverRows={jest.fn()}
          selectRow={jest.fn()}
          updateCellHoverLocation={jest.fn()}
          isDragAndDropEnabled
        />
      </IntlProvider>,
    );

    const firstNumberedCells = container.querySelectorAll(
      `.${ClassName.NUMBERED_COLUMN} > div`,
    );

    firstNumberedCells.forEach((cell) => {
      expect(
        cell.classList.contains(ClassName.NUMBERED_COLUMN_BUTTON_DISABLED),
      ).toBeTruthy();
    });
  });

  it('should render buttons for numbered column cells - when drag and drop is disabled', () => {
    const { editorView } = editor(
      doc(p('text'), table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      { dragAndDropEnabled: false },
    );
    const ref = editorView.dom.querySelector('table');

    const { container } = render(
      <IntlProvider locale="en">
        <NumberColumn
          tableRef={ref!}
          tableActive
          editorView={editorView}
          hoverRows={jest.fn()}
          selectRow={jest.fn()}
          updateCellHoverLocation={jest.fn()}
          isDragAndDropEnabled={false}
        />
      </IntlProvider>,
    );

    const firstNumberedCells = container.querySelectorAll(
      `.${ClassName.NUMBERED_COLUMN} > div`,
    );

    firstNumberedCells.forEach((cell) => {
      expect(
        cell.classList.contains(ClassName.NUMBERED_COLUMN_BUTTON_DISABLED),
      ).toBeFalsy();
    });
  });
});
