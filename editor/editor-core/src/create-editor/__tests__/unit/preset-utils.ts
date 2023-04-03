import type { EditorProps } from '../../../types';
import { shouldRecreatePreset } from '../../preset-utils';

describe('shouldRecreatePreset', () => {
  const props: EditorProps = {
    appearance: 'full-width',
  };

  it('should return TRUE when appearance changed', () => {
    const nextProps: EditorProps = {
      ...props,
      appearance: 'full-page',
    };

    const actual = shouldRecreatePreset(props, nextProps);

    expect(actual).toBe(true);
  });

  it('should return TRUE when allowUndoRedoButtons is changed', () => {
    const nextProps: EditorProps = {
      ...props,
      allowUndoRedoButtons: true,
    };

    const actual = shouldRecreatePreset(props, nextProps);

    expect(actual).toBe(true);
  });

  it('should return TRUE when persistScrollGutter changed', () => {
    const nextProps: EditorProps = {
      ...props,
      persistScrollGutter: true,
    };

    const actual = shouldRecreatePreset(props, nextProps);

    expect(actual).toBe(true);
  });

  it('should return FALSE when relevant properties is not changed', () => {
    const nextProps = {
      ...props,
      inputSamplingLimit: 5,
    };

    const actual = shouldRecreatePreset(props, nextProps);

    expect(actual).toBe(false);
  });
});
