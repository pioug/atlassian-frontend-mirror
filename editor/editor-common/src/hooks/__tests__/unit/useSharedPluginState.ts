import { useEffect } from 'react';

import { act, renderHook } from '@testing-library/react-hooks';

import {
  EditorPluginInjectionAPI,
  SharedStateAPI,
} from '../../../preset/plugin-injection-api';
import type { NextEditorPlugin } from '../../../types';
import { useSharedPluginState } from '../../useSharedPluginState';

const ultimateQuestionOfLife = 42;
const answer = 1984;

type AssertIsType<S, T> = S extends T ? true : never;

jest.mock('lodash/throttle', () => jest.fn((fn) => fn));

describe('useSharedPluginState', () => {
  afterEach(jest.clearAllMocks);

  const getEditorStateFake = jest
    .fn()
    .mockReturnValue(ultimateQuestionOfLife) as any;

  const coreAPI = new EditorPluginInjectionAPI({
    getEditorState: getEditorStateFake,
    getEditorView: () => undefined,
  });

  const pluginA: NextEditorPlugin<'pluginA', { sharedState: number }> = ({
    api,
  }) => {
    return {
      name: 'pluginA',
      getSharedState(editorView) {
        return editorView as unknown as number;
      },
    };
  };

  // @ts-ignore
  const pluginNoSharedState: NextEditorPlugin<
    'pluginNoShared',
    { dependencies: [typeof pluginA] }
  > = ({ api }) => {
    return {
      name: 'pluginNoShared',
      useHook() {
        let result = useSharedPluginState(api, ['pluginA']);

        const cond1: AssertIsType<typeof result.pluginAState, number> = true;

        // @ts-expect-error pluginNoSharedState shouldn't exist here
        const cond2: AssertIsType<typeof states.pluginNoSharedState, string> =
          true;

        // eslint-disable-next-line no-console
        console.log(cond1, cond2);
      },
    };
  };

  const pluginB: NextEditorPlugin<
    'pluginB',
    { sharedState: string; dependencies: [typeof pluginA] }
  > = ({ api }) => {
    return {
      name: 'pluginB',
      getSharedState(editorView) {
        return `${editorView}`;
      },
      useHook: () => {
        let { pluginBState, pluginAState } = useSharedPluginState(api, [
          'pluginA',
          'pluginB',
          // @ts-expect-error PluginD
          'pluginD',
        ]);

        // Following checks to confirm correct typing
        const cond1: AssertIsType<typeof pluginBState, string> = true;
        const cond2: AssertIsType<typeof pluginAState, number> = true;

        // eslint-disable-next-line no-console
        console.log(cond1, cond2);

        // Following checks to ensure the type is not `any`
        // @ts-expect-error This should not be able to be assigned to anything but a string
        pluginBState = 2;
        // @ts-expect-error This should not be able to be assigned to anything but a string
        pluginAState = {};
        // @ts-expect-error This should not be able to be assigned to anything but a number
        pluginAState = '2';
        // @ts-expect-error This should not be able to be assigned to anything but a number
        pluginAState = {};
      },
      useHookWithoutA: () => {
        let states = useSharedPluginState(api, ['pluginA']);

        // Following checks to confirm correct typing
        // @ts-expect-error pluginBState shouldn't exist here
        const cond1: AssertIsType<typeof states.pluginBState, string> = true;
        const cond2: AssertIsType<typeof states.pluginAState, number> = true;

        // eslint-disable-next-line no-console
        console.log(cond1, cond2);
      },
    };
  };

  const pluginC: NextEditorPlugin<
    'pluginC',
    { sharedState: { test: number; something: string[] } }
  > = ({ api }) => {
    return {
      name: 'pluginC',
      getSharedState(editorView) {
        return {
          test: editorView as unknown as number,
          something: [`${editorView}`],
        };
      },
    };
  };

  const api = coreAPI.api() as any;

  coreAPI.onEditorPluginInitialized(pluginA({ api, config: undefined }));
  coreAPI.onEditorPluginInitialized(pluginB({ api, config: undefined }));
  coreAPI.onEditorPluginInitialized(pluginC({ api, config: undefined }));

  it('should get the current value when using', () => {
    const { result } = renderHook(() => useSharedPluginState(api, ['pluginA']));

    expect(result.current).toStrictEqual({ pluginAState: 42 });
  });

  it('should update the current value if it changes', async () => {
    const { result } = renderHook(() => useSharedPluginState(api, ['pluginA']));

    act(() => {
      coreAPI.onEditorViewUpdated({
        // @ts-ignore
        newEditorState: answer,
        // @ts-ignore
        oldEditorState: ultimateQuestionOfLife,
      });
    });

    // @ts-expect-error
    result.current.pluginBState;
    result.current.pluginAState;

    expect(result.current).toStrictEqual({ pluginAState: 1984 });
  });

  it('should update multiple values at the same time', async () => {
    const { result } = renderHook(() =>
      useSharedPluginState(api, ['pluginA', 'pluginB', 'pluginC']),
    );

    act(() => {
      coreAPI.onEditorViewUpdated({
        // @ts-ignore
        newEditorState: answer,
        // @ts-ignore
        oldEditorState: ultimateQuestionOfLife,
      });
    });

    expect(result.current).toStrictEqual({
      pluginAState: 1984,
      pluginBState: '1984',
      pluginCState: { test: 1984, something: ['1984'] },
    });
  });

  it('should not re-rerender if the plugins update', () => {
    const numRenders = jest.fn();

    const { rerender } = renderHook(() => {
      const output = useSharedPluginState(api, ['pluginA', 'pluginB']);

      useEffect(() => {
        numRenders();
      }, [output]);

      return output;
    });

    act(() => {
      coreAPI.onEditorViewUpdated({
        // @ts-ignore
        newEditorState: answer,
        // @ts-ignore
        oldEditorState: ultimateQuestionOfLife,
      });
    });

    expect(numRenders).toHaveBeenCalledTimes(2);

    rerender({ state: { ...api } });

    expect(numRenders).toHaveBeenCalledTimes(2);

    act(() => {
      coreAPI.onEditorViewUpdated({
        // @ts-ignore
        newEditorState: answer,
        // @ts-ignore
        oldEditorState: ultimateQuestionOfLife,
      });
    });
    expect(numRenders).toHaveBeenCalledTimes(3);
  });

  it('should clean all subscriptions after unmount', () => {
    const injectionSpy = jest.spyOn(
      SharedStateAPI.prototype,
      // @ts-ignore
      'cleanupSubscription',
    );
    const { unmount } = renderHook(
      ({ state }) => {
        return useSharedPluginState(state, ['pluginA', 'pluginB']);
      },
      { initialProps: { state: api } },
    );

    unmount();

    expect(injectionSpy).toHaveBeenCalledWith('pluginA', expect.any(Function));
    expect(injectionSpy).toHaveBeenCalledWith('pluginB', expect.any(Function));
    expect(injectionSpy).not.toHaveBeenCalledWith(
      'pluginC',
      expect.any(Function),
    );
  });
});
