import editorShowImage from '../../editorShowImage';
import { EDITOR_SHOW_IMAGE } from '../../../actions/editorShowImage';

describe('editorShowImage() reducer', () => {
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
  const newImageUrl = 'new-url';

  it('returns same state if action has different type', () => {
    const oldState = { ...stateBase };
    const newState = editorShowImage(oldState, {
      type: 'SOME_OTHER_TYPE',
    } as any);
    expect(newState).toEqual(stateBase);
  });

  it('sets imageUrl and originalFile', () => {
    const oldState = { ...stateBase };

    const newState = editorShowImage(oldState, {
      type: EDITOR_SHOW_IMAGE,
      imageUrl: newImageUrl,
      originalFile: newOriginalFile,
    });

    expect(newState).toEqual({
      ...stateBase,
      editorData: {
        imageUrl: newImageUrl,
        originalFile: newOriginalFile,
      },
    });
  });

  it('sets imageUrl and replaces originalFile if both provided', () => {
    const oldState = {
      ...stateBase,
      editorData: {
        originalFile: oldOriginalFile,
      },
    };

    const newState = editorShowImage(oldState, {
      type: EDITOR_SHOW_IMAGE,
      imageUrl: newImageUrl,
      originalFile: newOriginalFile,
    });

    expect(newState).toEqual({
      ...stateBase,
      editorData: {
        imageUrl: newImageUrl,
        originalFile: newOriginalFile,
      },
    });
  });

  it('sets imageUrl and preserves originalFile if only imageUrl provided', () => {
    const oldState = {
      ...stateBase,
      editorData: {
        originalFile: oldOriginalFile,
      },
    };

    const newState = editorShowImage(oldState, {
      type: EDITOR_SHOW_IMAGE,
      imageUrl: newImageUrl,
    });

    expect(newState).toEqual({
      ...stateBase,
      editorData: {
        imageUrl: newImageUrl,
        originalFile: oldOriginalFile,
      },
    });
  });
});
