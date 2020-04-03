import editorClose from '../../editorClose';
import { EDITOR_CLOSE } from '../../../actions/editorClose';

describe('editorClose() reducer', () => {
  const stateBase: any = {
    a: 12,
    b: 'some-line',
  };
  const editorData = {
    imageUrl: 'some-url',
  };

  it('returns same state if action has different type', () => {
    const oldState = { ...stateBase };
    const newState = editorClose(oldState, { type: 'SOME_OTHER_TYPE' });
    expect(newState).toEqual(stateBase);
  });

  it('sets editorData to null in the state', () => {
    const oldState = {
      ...stateBase,
      editorData,
    };

    const newState = editorClose(oldState, { type: EDITOR_CLOSE });

    expect(newState).toEqual({
      ...stateBase,
      editorData: undefined,
    });
  });
});
