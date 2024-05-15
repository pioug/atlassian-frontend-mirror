import { act, renderHook } from '@testing-library/react-hooks';

import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';

import { usePreset } from '../../../use-preset';

describe('usePreset', () => {
  it('returns an object with editorApi and preset', () => {
    const createPreset = jest.fn(() => new EditorPresetBuilder());
    const { result } = renderHook(() => usePreset(createPreset, []));

    expect(result.current).toHaveProperty('editorApi');
    expect(result.current).toHaveProperty('preset');
    expect(createPreset).toBeCalledTimes(1);
  });

  it('memoizes the preset creation', () => {
    const createPreset = jest.fn(() => new EditorPresetBuilder());
    const { result, rerender } = renderHook(() => usePreset(createPreset, []));

    rerender();

    // @ts-ignore
    expect(result.current.preset.data).toStrictEqual([]);
    expect(createPreset).toBeCalledTimes(1); // createPreset should not be called again on rerender
  });

  it('recreates the preset if a dependency changes', () => {
    const createPreset = jest.fn(() => new EditorPresetBuilder());
    const { rerender } = renderHook((dep) => usePreset(createPreset, [dep]), {
      initialProps: 'initial',
    });

    rerender('changed');

    expect(createPreset).toBeCalledTimes(2); // createPreset should be called again when dependency changes
  });

  it('updates the editor API when the promise resolves', async () => {
    const createPreset = jest.fn(() => new EditorPresetBuilder());
    const { result } = renderHook((dep) => usePreset(createPreset, [dep]), {
      initialProps: 'initial',
    });

    await act(async () => {
      result.current.preset.build({
        pluginInjectionAPI: { api: () => 'tada' } as any,
      });
    });

    expect(result.current.editorApi).toBe('tada');
  });

  it('does not update the API if the hook unmounts', async () => {
    const createPreset = jest.fn(() => new EditorPresetBuilder());
    const { result, unmount } = renderHook(
      (dep) => usePreset(createPreset, [dep]),
      {
        initialProps: 'initial',
      },
    );

    unmount();

    await act(async () => {
      result.current.preset.build({
        pluginInjectionAPI: { api: () => 'tada' } as any,
      });
    });

    expect(result.current.editorApi).toBe(undefined);
  });

  it('injects the base EditorPresetBuilder', () => {
    const { result } = renderHook(
      (dep) => usePreset((builder) => builder, [dep]),
      {
        initialProps: 'initial',
      },
    );

    // @ts-ignore
    expect(result.current.preset.data).toStrictEqual([]);
  });
});

// @ts-ignore
function Types() {
  const { editorApi } = usePreset((builder) => builder.add(basePlugin));
  // Should be typed with base plugin
  editorApi?.base?.sharedState.currentState()?.keyboardHeight;
  // Should not be typed with any other random plugin
  // @ts-expect-error
  editorApi?.analytics?.sharedState.currentState();
  return null;
}
