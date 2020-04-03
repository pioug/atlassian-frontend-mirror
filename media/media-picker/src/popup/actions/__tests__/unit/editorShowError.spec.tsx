import { editorShowError, EDITOR_SHOW_ERROR } from '../../editorShowError';

describe('editorShowError action creator', () => {
  const message = 'some-message';
  const retryHandler = () => {};

  it('should create error data with message and handler if both are passed', () => {
    const action = (editorShowError as any)(message, retryHandler);
    expect(action).toEqual({
      type: EDITOR_SHOW_ERROR,
      error: { message, retryHandler },
    });
  });
});
