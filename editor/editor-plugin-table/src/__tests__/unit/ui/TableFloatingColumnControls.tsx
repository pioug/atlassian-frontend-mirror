import React from 'react';

import { fireEvent } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import type { DocBuilder, Refs } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import type { PluginKey } from '@atlaskit/editor-prosemirror/state';
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
  tdEmpty,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import tablePlugin from '../../../plugins/table-plugin';
import { pluginKey } from '../../../plugins/table/pm-plugins/plugin-key';
import type { TablePluginState } from '../../../plugins/table/types';
import TableFloatingColumnControls from '../../../plugins/table/ui/TableFloatingColumnControls';

describe('TableFloatingColumnControls', () => {
  const createEditor = createProsemirrorEditorFactory();
  const fakeGetEditorFeatureFlags = () => ({});
  const editor = (
    doc: DocBuilder,
    options?: {
      dragAndDropEnabled?: boolean;
    },
  ) => {
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, {}])
      .add(contentInsertionPlugin)
      .add(widthPlugin)
      .add(guidelinePlugin)
      .add(selectionPlugin)
      .add([tablePlugin, { ...options, tableOptions: {} }]);
    return createEditor<TablePluginState, PluginKey, typeof preset>({
      doc,
      preset,
      pluginKey: pluginKey,
    });
  };

  const getNodeFunc = (view: EditorView, refs: Refs) => () =>
    view.state.doc.nodeAt(refs['<node>'])!;

  afterEach(async () => {
    // cleanup any pending drags
    fireEvent.dragEnd(window);
    // Optional: unwind a post-drop browser bug fix
    // tick forward a micro task to flush a post-drag bug fix
    await 1;
    // this will trigger the fix to be released
    fireEvent.pointerMove(window);
  });

  it('should not render floating column controls when tableRef undefined and drag and drop is not enabled', () => {
    const { editorView, refs } = editor(
      doc(p('text'), '{<node>}', table()(tr(tdEmpty, tdEmpty, tdEmpty))),
    );

    const { container } = render(
      <TableFloatingColumnControls
        editorView={editorView}
        getNode={getNodeFunc(editorView, refs)}
        getEditorFeatureFlags={fakeGetEditorFeatureFlags}
      />,
    );
    expect(container.innerHTML).toEqual('');
  });

  it('should not render floating column controls when tableRef undefined and drag and drop is enabled', () => {
    const { editorView, refs } = editor(
      doc(p('text'), '{<node>}', table()(tr(tdEmpty, tdEmpty, tdEmpty))),
      {
        dragAndDropEnabled: true,
      },
    );
    const { container } = render(
      <TableFloatingColumnControls
        editorView={editorView}
        getNode={getNodeFunc(editorView, refs)}
        getEditorFeatureFlags={fakeGetEditorFeatureFlags}
      />,
    );
    expect(container.innerHTML).toEqual('');
  });

  it.todo('should not render drop target when no drag is active');

  it.todo(
    'should render a drop target per column when dragging' /*, () => {
    const { editorView, refs } = editor(
      doc(
        p('text'),
        '{<node>}',
        table()(tr(tdEmpty, tdCursor, tdEmpty, tdEmpty, tdEmpty)),
      ),
      {
        dragAndDropEnabled: true,
      },
    );
    const ref = editorView.dom.querySelector('table') || undefined;

    render(
      <IntlProvider locale="en">
        <TableFloatingColumnControls
          getNode={getNodeFunc(editorView, refs)}
          tableRef={ref}
          tableActive={true}
          hoveredCell={{ colIndex: 1, rowIndex: 0}}
          editorView={editorView}
          getEditorFeatureFlags={fakeGetEditorFeatureFlags}
        />
      </IntlProvider>,
    );

    screen.debug();

    const dragHandle = screen.getByTestId(
      'table-floating-column-controls-drag-handle',
    );

    fireEvent.dragStart(dragHandle);

     // ticking forward an animation frame will complete the lift
    // @ts-expect-error
    requestAnimationFrame.step();

    const dropTargets = screen.getAllByTestId(
      'table-floating-column-controls-drop-target',
    );

    expect(dropTargets).toHaveLength(5);
  }*/,
  );

  // FIXME and unskp: presumably doesn't work becuase TableFloatingColumnControls are now mounted via ReactDOM.createPortal
  it.skip('should render a drop target per column regardless of row count', () => {
    const { editorView, refs } = editor(
      doc(
        p('text'),
        '{<node>}',
        table()(tr(tdEmpty), tr(tdEmpty), tr(tdEmpty)),
      ),
      {
        dragAndDropEnabled: true,
      },
    );
    const ref = editorView.dom.querySelector('table') || undefined;

    render(
      <IntlProvider locale="en">
        <TableFloatingColumnControls
          getNode={getNodeFunc(editorView, refs)}
          tableRef={ref}
          tableActive={true}
          editorView={editorView}
          getEditorFeatureFlags={fakeGetEditorFeatureFlags}
        />
      </IntlProvider>,
    );

    const dropTargets = screen.getAllByTestId(
      'table-floating-column-controls-drop-target',
    );
    expect(dropTargets).toHaveLength(1);
  });

  it.todo('should remove column drop targets when dragging ends');
});
