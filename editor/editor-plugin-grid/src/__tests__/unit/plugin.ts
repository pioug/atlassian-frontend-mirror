import { act, render } from '@testing-library/react';
import { EditorView } from 'prosemirror-view';

import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { widthPlugin } from '@atlaskit/editor-plugin-width';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import { gridPlugin } from '../../plugin';

describe('gridPlugin', () => {
  const createEditor = createProsemirrorEditorFactory();
  let editorView: EditorView;
  let editorConfig: any;
  const gridApiRef: any = { current: null };

  beforeEach(() => {
    const pluginDependsOnGrid: NextEditorPlugin<
      'test',
      { dependencies: [typeof gridPlugin] }
    > = (_, api) => {
      gridApiRef.current = api;
      return {
        name: 'test',
      };
    };
    const preset = new Preset<LightEditorPlugin>()
      .add(widthPlugin)
      .add(gridPlugin)
      .add(pluginDependsOnGrid);

    ({ editorView, editorConfig } = createEditor({
      preset,
    }));
  });

  it('should not be visible initially', async () => {
    const { findByTestId } = render(
      editorConfig.contentComponents[1]({ editorView }),
    );
    const gridContainer = await findByTestId('gridContainer');
    expect(window.getComputedStyle(gridContainer).display).toBe('none');
  });

  it('should be visible if it is executed via the API', async () => {
    const { findByTestId } = render(
      editorConfig.contentComponents[1]({ editorView }),
    );

    act(() => {
      gridApiRef.current?.dependencies?.grid?.actions?.displayGrid(editorView)({
        visible: true,
        gridType: 'full',
        highlight: [],
      });
    });

    const gridContainer = await findByTestId('gridContainer');
    expect(window.getComputedStyle(gridContainer).display).toBe('block');
    const childNodes = gridContainer.querySelectorAll(':scope > *');
    childNodes.forEach(child => {
      expect(child.className).toBe('gridLine');
    });
  });

  it('should be display none if turned off subsequently', async () => {
    const { findByTestId } = render(
      editorConfig.contentComponents[1]({ editorView }),
    );

    act(() => {
      gridApiRef.current?.dependencies?.grid?.actions?.displayGrid(editorView)({
        visible: true,
        gridType: 'full',
        highlight: [],
      });
    });

    act(() => {
      gridApiRef.current?.dependencies?.grid?.actions?.displayGrid(editorView)({
        visible: false,
        gridType: 'full',
        highlight: [],
      });
    });

    const gridContainer = await findByTestId('gridContainer');
    expect(gridContainer).not.toBeVisible();
  });

  it('should show the highlights when requested by the API', async () => {
    const { findByTestId } = render(
      editorConfig.contentComponents[1]({ editorView }),
    );

    const highlight = [2, 5];

    act(() => {
      gridApiRef.current?.dependencies?.grid?.actions?.displayGrid(editorView)({
        visible: true,
        gridType: 'full',
        highlight,
      });
    });

    const gridContainer = await findByTestId('gridContainer');
    expect(window.getComputedStyle(gridContainer).display).toBe('block');
    const childNodes = gridContainer.querySelectorAll(':scope > *');
    childNodes.forEach((child, idx) => {
      if (highlight.includes(idx)) {
        expect(child.className).toBe('gridLine highlight');
      } else {
        expect(child.className).toBe('gridLine');
      }
    });
  });
});
