import { AvatarPropTypes } from '@atlaskit/avatar';

import { composeAUniqueKey } from '../../utils';

describe('composeAUniqueKey', () => {
  it('fallback to index when avatar object is empty', () => {
    const avatar: AvatarPropTypes = {};

    const key = composeAUniqueKey(avatar, 0);
    expect(key).toEqual('0');
  });

  it('use name for the unique key', () => {
    const avatar: AvatarPropTypes = {
      name: 'Juntao',
    };

    const key = composeAUniqueKey(avatar, 0);
    expect(key).toEqual('Juntao');
  });

  it('use src for the unique key', () => {
    const avatar: AvatarPropTypes = {
      src: 'http://some-image-host',
    };

    const key = composeAUniqueKey(avatar, 0);
    expect(key).toEqual('http://some-image-host');
  });

  it('use name and src for the unique key', () => {
    const avatar: AvatarPropTypes = {
      name: 'Juntao',
      src: 'http://some-image-host',
    };

    const key = composeAUniqueKey(avatar, 0);
    expect(key).toEqual('Juntao-http://some-image-host');
  });

  it('cut off the src if it is too long', () => {
    const avatar: AvatarPropTypes = {
      name: 'Juntao',
      src:
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAZABkAAD/wDs8LeNGkcF/wAVlg3mPe1Nlp0rhgP1J//Z',
    };

    const key = composeAUniqueKey(avatar, 0);
    expect(key).toEqual('Juntao-8LeNGkcF/wAVlg3mPe1Nlp0rhgP1J//Z');
  });
});
