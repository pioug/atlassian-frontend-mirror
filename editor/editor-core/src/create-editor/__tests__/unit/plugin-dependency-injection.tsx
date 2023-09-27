jest.mock('lodash/throttle', () => jest.fn((fn) => fn));

import React from 'react';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { ReactEditorView } from '../../ReactEditorView';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { createIntl } from 'react-intl-next';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { basePlugin } from '@atlaskit/editor-plugin-base';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { replaceRaf } from 'raf-stub';
import { featureFlagsPlugin } from '@atlaskit/editor-plugin-feature-flags';

const portalProviderAPI: any = {
  render() {},
  remove() {},
};

const requiredProps = () => ({
  providerFactory: ProviderFactory.create({}),
  portalProviderAPI,
  onEditorCreated: () => {},
  onEditorDestroyed: () => {},
  editorProps: {},
  intl: createIntl({ locale: 'en' }),
  render: ({ editor }: { editor: React.ReactChild }) => <div>{editor}</div>,
});

replaceRaf();
describe('ReactEditorView: plugin injection API', () => {
  afterEach(jest.clearAllMocks);

  describe('when plugin two ask for plugin one current state', () => {
    it('should call plugin one getSharedState function', () => {
      const fakefn = jest.fn();
      let editorView: EditorView | null = null;
      const plugin1: NextEditorPlugin<'one', { sharedState: number }> = ({
        api,
      }) => {
        return {
          name: 'one',
          getSharedState: (editorState) => {
            fakefn();
            return 12;
          },
        };
      };
      const plugin2: NextEditorPlugin<
        'two',
        { dependencies: [typeof plugin1] }
      > = ({ api }) => {
        return {
          name: 'two',
          pmPlugins: () => {
            return [
              {
                name: 'test',
                plugin: () =>
                  new SafePlugin({
                    view(_editorView) {
                      editorView = _editorView;
                      return {
                        update() {
                          api?.one.sharedState.currentState();
                        },
                      };
                    },
                  }),
              },
            ];
          },
        };
      };

      const preset = new EditorPresetBuilder()
        .add([featureFlagsPlugin, {}])
        .add(basePlugin)
        .add(plugin1)
        .add(plugin2);

      renderWithIntl(<ReactEditorView {...requiredProps()} preset={preset} />);

      // @ts-ignore
      editorView?.dispatch(editorView?.state.tr.insertText('lol'));

      expect(fakefn).toHaveBeenCalled();
    });
  });

  describe('when plugin one shared state changes', () => {
    it('should call the on change listeners with the new state', () => {
      const fakefn = jest.fn();
      let editorView: EditorView | null = null;
      const plugin1: NextEditorPlugin<'one', { sharedState: number }> = ({
        api,
      }) => {
        return {
          name: 'one',
          getSharedState: (editorState) => {
            if (editorState?.doc.textContent === 'lol') {
              return 12;
            }
            return 1;
          },
        };
      };
      const plugin2: NextEditorPlugin<
        'two',
        { dependencies: [typeof plugin1] }
      > = ({ api }) => {
        api?.one.sharedState.onChange(fakefn);
        return {
          name: 'two',
          pmPlugins: () => {
            return [
              {
                name: 'test',
                plugin: () =>
                  new SafePlugin({
                    view(_editorView) {
                      editorView = _editorView;
                      return {};
                    },
                  }),
              },
            ];
          },
        };
      };

      const preset = new EditorPresetBuilder()
        .add([featureFlagsPlugin, {}])
        .add(basePlugin)
        .add(plugin1)
        .add(plugin2);

      renderWithIntl(<ReactEditorView {...requiredProps()} preset={preset} />);

      // @ts-ignore
      editorView?.dispatch(editorView?.state.tr.insertText('lol'));

      (requestAnimationFrame as any).step();
      expect(fakefn).toHaveBeenCalledWith({
        nextSharedState: 12,
        prevSharedState: 1,
      });
    });
  });

  it('should test on change behaviour without change in shared state', () => {
    const fakefn = jest.fn();
    const plugin1: NextEditorPlugin<'one', { sharedState: number }> = ({
      api,
    }) => {
      return {
        name: 'one',
        getSharedState: (editorState) => {
          return 1;
        },
      };
    };
    const plugin2: NextEditorPlugin<
      'two',
      { dependencies: [typeof plugin1] }
    > = ({ api }) => {
      api?.one.sharedState.onChange(fakefn);
      return {
        name: 'two',
      };
    };

    const preset = new EditorPresetBuilder()
      .add([featureFlagsPlugin, {}])
      .add(basePlugin)
      .add(plugin1)
      .add(plugin2);

    renderWithIntl(<ReactEditorView {...requiredProps()} preset={preset} />);

    (requestAnimationFrame as any).step();
    expect(fakefn).toHaveBeenCalledWith({
      nextSharedState: 1,
      prevSharedState: undefined,
    });
  });
});
