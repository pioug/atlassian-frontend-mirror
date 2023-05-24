import React from 'react';

import { render } from '@testing-library/react';
import { ReadonlyTransaction } from 'prosemirror-state';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { WidthProvider } from '@atlaskit/editor-common/ui';
import { name } from '@atlaskit/editor-core/src/version-wrapper';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import type { WidthPluginState } from '@atlaskit/editor-plugin-width';
import WidthEmitter from '../..';

import { PluginKey, EditorState } from 'prosemirror-state';

// TODO: ED-17870 This workaround will be removed here.
// @ts-ignore
const widthPluginKey = {
  key: 'widthPlugin$',
  getState: (state: EditorState) => {
    return (state as any)['widthPlugin$'];
  },
} as PluginKey;

describe(name, () => {
  const createEditor = createEditorFactory();

  describe('WidthBroadcaster', () => {
    const fakeWidth = 500;
    let mockOffsetWidth: jest.SpyInstance;

    beforeEach(() => {
      mockOffsetWidth = jest
        .spyOn(window.HTMLElement.prototype, 'offsetWidth', 'get')
        .mockImplementation(() => fakeWidth);
      jest.useFakeTimers();
    });

    afterEach(() => {
      mockOffsetWidth.mockClear();
    });

    it('should trigger a meta transaction with width', () => {
      let width;
      const { editorView } = createEditor({
        doc: doc(p()),
        editorPlugins: [
          {
            pmPlugins: () => [
              {
                rank: 1,
                plugin: () =>
                  new SafePlugin({
                    state: {
                      init: () => null,
                      apply(tr: ReadonlyTransaction) {
                        const widthState = tr.getMeta(widthPluginKey) as
                          | WidthPluginState
                          | undefined;
                        width = widthState ? widthState.width : undefined;
                      },
                    },
                  }),
              },
            ],
          },
        ],
      });

      const { unmount } = render(
        <WidthProvider>
          <WidthEmitter editorView={editorView} />
        </WidthProvider>,
      );

      const event = new Event('resize');
      window.dispatchEvent(event);
      // This is to trigger `requestAnimationFrame`. It's from `raf-stub` package that we are using inside `SizeDetector`
      (window.requestAnimationFrame as any).step();
      // This is to trigger `requestAnimationFrame`. It's from `raf-stub` package that we are using inside `WidthProvider`
      (window.requestAnimationFrame as any).step();

      jest.runOnlyPendingTimers();

      expect(width).toEqual(fakeWidth);
      unmount();
      editorView.destroy();
    });
  });
});
