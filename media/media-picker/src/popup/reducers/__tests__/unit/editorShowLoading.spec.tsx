import editorShowLoading from '../../editorShowLoading';
import { EDITOR_SHOW_LOADING } from '../../../actions/editorShowLoading';

describe('editorShowLoading() reducer', () => {
  const stateBase: any = {
    a: 12,
    b: 'some-line',
  };
  const oldOriginalFile = {
    id: 'old-id',
    name: 'old-name',
  };
  const newOriginalFile = {
    id: 'new-id',
    name: 'new-name',
  };

  it('returns same state if action has different type', () => {
    const oldState = { ...stateBase };
    const newState = editorShowLoading(oldState, { type: 'SOME_OTHER_TYPE' });
    expect(newState).toEqual(stateBase);
  });

  it('sets the originalFile to the state', () => {
    const oldState = { ...stateBase };

    const newState = editorShowLoading(oldState, {
      type: EDITOR_SHOW_LOADING,
      originalFile: newOriginalFile,
    });

    expect(newState).toEqual({
      ...stateBase,
      editorData: {
        originalFile: newOriginalFile,
      },
    });
  });

  it('replaces the original file with the new', () => {
    const oldState = {
      ...stateBase,
      editorData: { originalFile: oldOriginalFile },
    };

    const newState = editorShowLoading(oldState, {
      type: EDITOR_SHOW_LOADING,
      originalFile: newOriginalFile,
    });

    expect(newState).toEqual({
      ...stateBase,
      editorData: { originalFile: newOriginalFile },
    });
  });
});
