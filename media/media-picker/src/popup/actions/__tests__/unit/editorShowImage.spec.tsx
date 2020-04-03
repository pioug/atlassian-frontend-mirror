import { editorShowImage, EDITOR_SHOW_IMAGE } from '../../editorShowImage';

describe('editorShowImage action creator', () => {
  const imageUrl = 'some-image-url';
  const originalFile = {
    id: 'some-id',
    name: 'some-name',
  };

  it('should create action with both imageUrl and originalFile if all parameters specified', () => {
    const action = editorShowImage(imageUrl, originalFile);
    expect(action).toEqual({
      type: EDITOR_SHOW_IMAGE,
      imageUrl,
      originalFile,
    });
  });
});
