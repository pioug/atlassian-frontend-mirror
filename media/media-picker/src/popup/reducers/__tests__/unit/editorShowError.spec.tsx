import editorShowError from '../../editorShowError';
import { EDITOR_SHOW_ERROR } from '../../../actions/editorShowError';

describe('editorShowError() reducer', () => {
  const stateBase: any = {
    a: 12,
    b: 'some-line',
  };
  const oldError = {
    message: 'old-message',
    retryHandler: 'old-retry-handler',
  };
  const newError = {
    message: 'new-message',
    retryHandler: 'new-retry-handler',
  };

  it('returns same state if action has different type', () => {
    const oldState = { ...stateBase };
    const newState = editorShowError(oldState, { type: 'SOME_OTHER_TYPE' });
    expect(newState).toEqual(stateBase);
  });

  it('sets the error to the state', () => {
    const oldState = { ...stateBase };

    const newState = editorShowError(oldState, {
      type: EDITOR_SHOW_ERROR,
      error: newError,
    });

    expect(newState).toEqual({
      ...stateBase,
      editorData: { error: newError },
    });
  });

  it('replaces the previous error in the state', () => {
    const oldState = {
      ...stateBase,
      editorData: { error: oldError },
    };

    const newState = editorShowError(oldState, {
      type: EDITOR_SHOW_ERROR,
      error: newError,
    });

    expect(newState).toEqual({
      ...stateBase,
      editorData: { error: newError },
    });
  });
});
