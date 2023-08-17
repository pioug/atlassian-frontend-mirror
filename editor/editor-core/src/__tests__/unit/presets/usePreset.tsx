import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { renderHook } from '@testing-library/react-hooks';
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
});
