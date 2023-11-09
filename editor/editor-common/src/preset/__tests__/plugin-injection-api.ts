jest.mock('lodash/throttle', () => jest.fn((fn) => fn));

// eslint-disable-next-line import/no-extraneous-dependencies
import type {
  ExtractInjectionAPI,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';

import type { EditorCommand } from '../../types/editor-command';
import {
  EditorPluginInjectionAPI,
  SharedStateAPI,
} from '../plugin-injection-api';

describe('EditorPluginInjectionAPI', () => {
  afterEach(jest.clearAllMocks);

  let coreAPI: EditorPluginInjectionAPI;
  const fakeDispatch = jest.fn();
  const fakeTr = { insertText: jest.fn().mockReturnValue(42) };

  beforeEach(() => {
    const getEditorStateFake = jest.fn().mockReturnValue(() => {
      return {}; // Fake EditorState
    }) as any;

    const getEditorViewFake = jest.fn().mockImplementation(() => {
      return {
        dispatch: fakeDispatch,
        state: { tr: fakeTr },
      };
    }) as any;

    coreAPI = new EditorPluginInjectionAPI({
      getEditorState: getEditorStateFake,
      getEditorView: getEditorViewFake,
    });
  });

  describe('when plugin actions is called', () => {
    it('should call the plugin dependency action', () => {
      const actionPluginOneFn = jest.fn();
      type ActionsOne = {
        lol: typeof actionPluginOneFn;
      };
      const plugin1: NextEditorPlugin<'one', { actions: ActionsOne }> = ({
        api,
      }) => {
        return {
          name: 'one',
          actions: {
            lol: actionPluginOneFn,
          },
        };
      };

      const plugin2: NextEditorPlugin<
        'two',
        {
          dependencies: [typeof plugin1];
        }
      > = ({ api }) => {
        api?.one.actions.lol();
        return {
          name: 'two',
        };
      };

      const api = coreAPI.api() as any;
      const one = plugin1({ api, config: undefined });
      coreAPI.onEditorPluginInitialized(one);

      const two = plugin2({
        api,
        config: undefined,
      });
      coreAPI.onEditorPluginInitialized(two);

      expect(actionPluginOneFn).toHaveBeenCalled();
    });
  });

  describe('when sharedState.currentState is called', () => {
    let getSharedStateFake = jest.fn() as any;

    beforeEach(() => {
      getSharedStateFake.mockReset();
    });

    it('should call the plugin dependency getSharedState', () => {
      const plugin1: NextEditorPlugin<'one', { sharedState: number }> = ({
        api,
      }) => {
        return {
          name: 'one',
          getSharedState: getSharedStateFake,
        };
      };
      const plugin2: NextEditorPlugin<
        'two',
        {
          dependencies: [typeof plugin1];
        }
      > = ({ api }) => {
        return {
          name: 'two',

          checkCurrentState: () => {
            api?.one.sharedState.currentState();
          },
        };
      };

      const api = coreAPI.api() as any;
      const one = plugin1({ api, config: undefined });
      coreAPI.onEditorPluginInitialized(one);

      const two = plugin2({
        api,
        config: undefined,
      });
      coreAPI.onEditorPluginInitialized(two);

      // @ts-ignore
      two.checkCurrentState();

      expect(getSharedStateFake).toHaveBeenCalled();
    });
  });

  describe('when the shared state changes', () => {
    it('should can the sharedState.onChange callback', () => {
      const plugin1: NextEditorPlugin<'one', { sharedState: number }> = ({
        api,
      }) => {
        let counter = 1;

        return {
          name: 'one',
          getSharedState: (fakeEditorState) => {
            // @ts-ignore
            if (fakeEditorState === true) {
              counter++;
            }

            return counter;
          },
        };
      };
      const fakeOnChange = jest.fn();
      const plugin2: NextEditorPlugin<
        'two',
        {
          dependencies: [typeof plugin1];
        }
      > = ({ api }) => {
        api?.one.sharedState.onChange(fakeOnChange);
        return {
          name: 'two',
        };
      };
      const api = coreAPI.api() as any;

      coreAPI.onEditorPluginInitialized(plugin1({ api, config: undefined }));

      coreAPI.onEditorPluginInitialized(plugin2({ api, config: undefined }));

      coreAPI.onEditorViewUpdated({
        // @ts-ignore
        newEditorState: true,
        // @ts-ignore
        oldEditorState: false,
      });

      expect(fakeOnChange).toHaveBeenCalledWith({
        nextSharedState: 2,
        prevSharedState: undefined,
      });
    });

    describe('when the getSharedState return the same object propeties byt the same instance', () => {
      const SHOULD_CHANGE_STATE = 88;
      it('should not call the onChange twice', () => {
        type OneState = {
          some: number;
          lol: {
            name: string;
          };
        };
        const plugin1: NextEditorPlugin<'one', { sharedState: OneState }> = ({
          api,
        }) => {
          return {
            name: 'one',
            getSharedState: (fakeEditorState) => {
              // @ts-ignore
              if (fakeEditorState < SHOULD_CHANGE_STATE) {
                return {
                  some: -9,
                  lol: {
                    name: 'First state',
                  },
                };
              }
              return {
                some: 12,
                lol: {
                  name: 'Same name',
                },
              };
            },
          };
        };
        const fakeOnChange = jest.fn();
        const plugin2: NextEditorPlugin<
          'two',
          {
            dependencies: [typeof plugin1];
          }
        > = ({ api }) => {
          api?.one.sharedState.onChange(fakeOnChange);
          return {
            name: 'two',
          };
        };

        const api = coreAPI.api() as any;

        coreAPI.onEditorPluginInitialized(
          plugin1({
            config: undefined,
            api,
          }),
        );
        coreAPI.onEditorPluginInitialized(
          plugin2({
            config: undefined,
            api,
          }),
        );

        coreAPI.onEditorViewUpdated({
          // @ts-ignore
          newEditorState: SHOULD_CHANGE_STATE,
          // @ts-ignore
          oldEditorState: 77,
        });

        coreAPI.onEditorViewUpdated({
          newEditorState: 99,
          oldEditorState: SHOULD_CHANGE_STATE,
        } as any);
        coreAPI.onEditorViewUpdated({
          newEditorState: 99 * 2,
          oldEditorState: SHOULD_CHANGE_STATE,
        } as any);
        coreAPI.onEditorViewUpdated({
          newEditorState: 99 * 3,
          oldEditorState: SHOULD_CHANGE_STATE,
        } as any);

        expect(fakeOnChange).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('SharedStateAPI', () => {
    function foo() {}
    function bar() {}

    describe('when the same function is added twice for the same plugin name', () => {
      it('should not add it to the listeners', () => {
        const sharedStateAPI = new SharedStateAPI({
          getEditorState: jest.fn(),
        });

        const pluginName = 'some-plugin';
        const fakePluginSharedState = sharedStateAPI.createAPI({
          name: pluginName,
        } as any);

        fakePluginSharedState.onChange(foo);
        fakePluginSharedState.onChange(foo);

        // Private property accessing
        // @ts-ignore
        expect(sharedStateAPI.listeners.get(pluginName).size).toEqual(1);
      });
    });

    describe('when the unsubscribe callback is called', () => {
      it('should remove the listener from the listeners set', () => {
        const sharedStateAPI = new SharedStateAPI({
          getEditorState: jest.fn(),
        });

        const pluginName = 'some-plugin';
        const fakePluginSharedState = sharedStateAPI.createAPI({
          name: pluginName,
        } as any);

        fakePluginSharedState.onChange(foo);
        const unsubscribe = fakePluginSharedState.onChange(bar);

        unsubscribe();

        // @ts-ignore
        expect(sharedStateAPI.listeners.get(pluginName).size).toEqual(1);
      });
    });
  });

  describe('notifyListeners', () => {
    it('should call the onChange by order', () => {
      const plugin1: NextEditorPlugin<'one', { sharedState: number }> = ({
        api,
      }) => {
        return {
          name: 'one',
          getSharedState: (fakeEditorState) => {
            return fakeEditorState as any;
          },
        };
      };

      const api = coreAPI.api() as ExtractInjectionAPI<typeof plugin1>;
      coreAPI.onEditorPluginInitialized(plugin1({ api, config: undefined }));

      const onChangeFn = jest.fn();
      api?.one?.sharedState.onChange(onChangeFn);

      const noUpdate: any = {
        oldEditorState: 1,
        newEditorState: 1,
      };
      coreAPI.onEditorViewUpdated(noUpdate);
      const firstUpdate = {
        oldEditorState: 3,
        newEditorState: 4,
      } as any;
      coreAPI.onEditorViewUpdated(firstUpdate);
      const secondUpdate = {
        oldEditorState: 4,
        newEditorState: 5,
      } as any;
      coreAPI.onEditorViewUpdated(secondUpdate);

      expect(onChangeFn).toHaveBeenCalledTimes(2);
      expect(onChangeFn).toHaveBeenNthCalledWith(1, {
        prevSharedState: 3,
        nextSharedState: 4,
      });
      expect(onChangeFn).toHaveBeenNthCalledWith(2, {
        prevSharedState: 4,
        nextSharedState: 5,
      });
    });
  });

  describe('core.actions.execute', () => {
    it('shouldnt dispatch a transaction if no command passed', () => {
      const api = coreAPI.api();
      expect(api.core?.actions?.execute(undefined)).toBe(false);
    });

    it('shouldnt dispatch a transaction if the EditorCommand returns null', () => {
      const api = coreAPI.api();
      expect(api.core?.actions?.execute(() => null)).toBe(false);
    });

    it('should dispatch a transaction if the EditorCommand returns a transaction', () => {
      const api = coreAPI.api();
      expect(api.core?.actions?.execute(({ tr }: { tr: any }) => tr)).toBe(
        true,
      );
      expect(fakeDispatch).toHaveBeenCalledWith(fakeTr);
    });

    it('should dispatch a plugin command', () => {
      const plugin1: NextEditorPlugin<
        'one',
        { commands: { updateTransaction: EditorCommand } }
      > = ({ api }) => {
        return {
          name: 'one',
          commands: {
            updateTransaction: ({ tr }) => {
              return tr.insertText('hello');
            },
          },
        };
      };
      const api: ExtractInjectionAPI<typeof plugin1> =
        coreAPI.api() as ExtractInjectionAPI<typeof plugin1>;

      coreAPI.onEditorPluginInitialized(plugin1({ api, config: undefined }));

      api.core.actions.execute(api?.one?.commands?.updateTransaction);
      expect(fakeTr.insertText).toHaveBeenCalledWith('hello');
      expect(fakeDispatch).toHaveBeenCalledWith(42);
    });

    it('should dispatch a plugin command with metadata', () => {
      const plugin1: NextEditorPlugin<
        'one',
        { commands: { updateTransaction: (meta: string) => EditorCommand } }
      > = ({ api }) => {
        return {
          name: 'one',
          commands: {
            updateTransaction:
              (meta) =>
              ({ tr }) => {
                return tr.insertText(meta);
              },
          },
        };
      };
      const api: ExtractInjectionAPI<typeof plugin1> =
        coreAPI.api() as ExtractInjectionAPI<typeof plugin1>;

      coreAPI.onEditorPluginInitialized(plugin1({ api, config: undefined }));

      api.core?.actions?.execute(api?.one?.commands?.updateTransaction('yo'));
      expect(fakeTr.insertText).toHaveBeenCalledWith('yo');
      expect(fakeDispatch).toHaveBeenCalledWith(42);
    });
  });
});
