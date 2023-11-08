import React from 'react';

import { render, screen } from '@testing-library/react';

import { ReactEditorViewContext } from '@atlaskit/editor-common/ui-react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';
import { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import { selectionPlugin } from '@atlaskit/editor-plugin-selection';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import * as prosemirrorUtils from '@atlaskit/editor-prosemirror/utils';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
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
import { ffTest } from '@atlassian/feature-flags-test-utils';

import tablePlugin from '../../../plugins/table-plugin';
import FloatingDragMenu from '../../../plugins/table/ui/FloatingDragMenu';

describe('FloatingDragMenu', () => {
  const createEditor = createProsemirrorEditorFactory();
  let editorView: EditorView;
  let tableNode: ContentNodeWithPos | undefined;
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
        .add(tablePlugin),
    }));

    tableNode = prosemirrorUtils.findParentNodeOfTypeClosestToPos(
      editorView.state.selection.$from,
      editorView.state.schema.nodes.table,
    );
  });
  describe('should group the menu items correctly', () => {
    ffTest(
      'platform.editor.menu.group-items',
      () => {
        // Run test case when FF platform.editor..menu.group-items is true
        const tableRef = editorView.dom.querySelector('table');
        const editorRef = {
          current: document.createElement('div'),
        };
        render(
          <ReactEditorViewContext.Provider
            value={{
              editorRef,
            }}
          >
            <FloatingDragMenu
              editorView={editorView}
              isOpen
              getEditorContainerWidth={jest.fn()}
              tableRef={tableRef as HTMLTableElement}
              tableNode={tableNode?.node}
              direction="row"
              targetCellPosition={1}
            />
          </ReactEditorViewContext.Provider>,
        );
        expect(screen.getAllByRole('menu')).toHaveLength(1);
        expect(screen.getAllByRole('group')).toHaveLength(2);
      },
      () => {
        // Run test case when FF platform.editor..menu.group-items is false
        const tableRef = editorView.dom.querySelector('table');
        const editorRef = {
          current: document.createElement('div'),
        };
        render(
          <ReactEditorViewContext.Provider
            value={{
              editorRef,
            }}
          >
            <FloatingDragMenu
              editorView={editorView}
              isOpen
              getEditorContainerWidth={jest.fn()}
              tableRef={tableRef as HTMLTableElement}
              tableNode={tableNode?.node}
              direction="row"
              targetCellPosition={1}
            />
          </ReactEditorViewContext.Provider>,
        );
        expect(screen.getAllByRole('menu')).toHaveLength(2);
        expect(screen.queryByRole('group')).toBeNull();
      },
    );
  });
  describe('menu items', () => {
    it('should render the right menu items for row', () => {
      // Run test case when FF platform.editor..menu.group-items is true
      const tableRef = editorView.dom.querySelector('table');
      const editorRef = {
        current: document.createElement('div'),
      };
      render(
        <ReactEditorViewContext.Provider
          value={{
            editorRef,
          }}
        >
          <FloatingDragMenu
            editorView={editorView}
            isOpen
            getEditorContainerWidth={jest.fn()}
            tableRef={tableRef as HTMLTableElement}
            tableNode={tableNode?.node}
            direction="row"
            targetCellPosition={1}
          />
        </ReactEditorViewContext.Provider>,
      );

      const items = screen.getAllByRole('menuitem');
      const menuitemTextArray = items.map((item) => item.textContent);
      expect(menuitemTextArray).toMatchInlineSnapshot(`
          Array [
            "Add row aboveCtrl+Alt+↑",
            "Add row belowCtrl+Alt+↓",
            "Clear cells⌫",
            "Delete row",
            "Move row up",
            "Move row down",
          ]
        `);
    });
    it('should render the right menu items for column', () => {
      const tableRef = editorView.dom.querySelector('table');
      const editorRef = {
        current: document.createElement('div'),
      };
      render(
        <ReactEditorViewContext.Provider
          value={{
            editorRef,
          }}
        >
          <FloatingDragMenu
            editorView={editorView}
            isOpen
            getEditorContainerWidth={jest.fn()}
            tableRef={tableRef as HTMLTableElement}
            tableNode={tableNode?.node}
            direction="column"
            targetCellPosition={1}
          />
        </ReactEditorViewContext.Provider>,
      );

      const items = screen.getAllByRole('menuitem');
      const menuitemTextArray = items.map((item) => item.textContent);
      expect(menuitemTextArray).toMatchInlineSnapshot(`
          Array [
            "Add column leftCtrl+Alt+←",
            "Add column rightCtrl+Alt+→",
            "Distribute columns",
            "Clear cells⌫",
            "Delete column",
            "Move column left",
            "Move column right",
            "Sort increasing",
            "Sort decreasing",
          ]
        `);
    });
  });
});
