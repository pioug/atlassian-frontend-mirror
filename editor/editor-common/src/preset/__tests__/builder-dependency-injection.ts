import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import { EditorPluginInjectionAPI, EditorPresetBuilder } from '../../preset';

describe('Editor EditorPresetBuilder - build', () => {
  describe('when plugin is create', () => {
    it('should send the pluginInjectionAPI.api() result as parameter', () => {
      const fakeAPI = {};
      const pluginInjectionAPIFake = {
        api: jest.fn().mockReturnValue(fakeAPI),
        onEditorPluginInitialized: jest.fn(),
      } as any;

      const plugin1: NextEditorPlugin<'one'> = jest.fn((_, api) => {
        return {
          name: 'one',
        };
      });

      new EditorPresetBuilder().add(plugin1).build({
        pluginInjectionAPI: pluginInjectionAPIFake,
      });

      expect(plugin1).toHaveBeenCalledWith(undefined, fakeAPI);
    });

    it('should call onEditorPluginInitialized', () => {
      const pluginInjectionAPIFake = {
        api: jest.fn().mockReturnValue({}),
        onEditorPluginInitialized: jest.fn(),
      } as any;
      const one = {
        name: 'one',
      };
      // @ts-ignore
      const plugin1: NextEditorPlugin<'one'> = (_, api) => {
        return one;
      };
      const two = {
        name: 'two',
      };
      // @ts-ignore
      const plugin2: NextEditorPlugin<'two'> = (_, api) => {
        return two;
      };
      new EditorPresetBuilder().add(plugin1).add(plugin2).build({
        pluginInjectionAPI: pluginInjectionAPIFake,
      });

      expect(
        pluginInjectionAPIFake.onEditorPluginInitialized,
      ).toHaveBeenNthCalledWith(2, two);
      expect(
        pluginInjectionAPIFake.onEditorPluginInitialized,
      ).toHaveBeenNthCalledWith(1, one);
    });

    describe('when is specified on excludePlugins', () => {
      it('should not call onEditorPluginInitialized', () => {
        const pluginInjectionAPIFake = {
          api: jest.fn().mockReturnValue({}),
          onEditorPluginInitialized: jest.fn(),
        } as any;
        const one = {
          name: 'one',
        };
        // @ts-ignore
        const plugin1: NextEditorPlugin<'one'> = (_, api) => {
          return one;
        };
        const two = {
          name: 'two',
        };
        // @ts-ignore
        const plugin2: NextEditorPlugin<'two'> = (_, api) => {
          return two;
        };
        const three = {
          name: 'three',
        };
        // @ts-ignore
        const plugin3: NextEditorPlugin<'three'> = (_, api) => {
          return three;
        };
        new EditorPresetBuilder()
          .add(plugin1)
          .add(plugin2)
          .add(plugin3)
          .build({
            pluginInjectionAPI: pluginInjectionAPIFake,
            excludePlugins: new Set(['two']),
          });

        expect(
          pluginInjectionAPIFake.onEditorPluginInitialized,
        ).toHaveBeenNthCalledWith(1, one);
        expect(
          pluginInjectionAPIFake.onEditorPluginInitialized,
        ).toHaveBeenNthCalledWith(2, three);
      });
    });
  });

  describe('when using a real PluginInjectionAPI', () => {
    it('should enable external plugins to be called in the initialisation function', () => {
      const fakefn = jest.fn();
      const plugin1: NextEditorPlugin<'one', { sharedState: number }> = (
        _,
        api,
      ) => {
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
      > = (_, api) => {
        api?.externalPlugins.one.sharedState.currentState();
        return {
          name: 'two',
        };
      };

      const pluginInjectionAPI = new EditorPluginInjectionAPI({
        // We don't care about the editor state
        // @ts-ignore
        getEditorState: () => {
          return 1;
        },
      });
      new EditorPresetBuilder().add(plugin1).add(plugin2).build({
        pluginInjectionAPI,
      });

      expect(fakefn).toHaveBeenCalled();
    });
  });
});
