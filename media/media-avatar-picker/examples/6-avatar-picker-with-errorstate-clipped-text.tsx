/* eslint-disable no-console */
import React from 'react';
import { Avatar, AvatarPickerDialog } from '../src';
import { generateAvatars } from '../example-helpers';
import { tallImage } from '@atlaskit/media-test-helpers';

const avatars: Array<Avatar> = generateAvatars(30);
const errorMessage = `(start) 1. Image size is 3264px * 2448px.
2. The maximum allowed image size is 2000px * 2000px.
3. Image size is 3264px * 2448px.
4. The maximum allowed image size is 2000px * 2000px.
5. Image size is 3264px * 2448px.
6. The maximum allowed image size is 2000px * 2000px.
7. Image size is 3264px * 2448px.
8. The maximum allowed image size is 2000px * 2000px. (end)`;

export default () => (
  <AvatarPickerDialog
    avatars={avatars}
    imageSource={tallImage}
    onImagePicked={(selectedImage, crop) => {
      console.log('onImagePicked', selectedImage, crop);
    }}
    onAvatarPicked={(selectedAvatar) =>
      console.log('onAvatarPicked', selectedAvatar)
    }
    onCancel={() => console.log('onCancel')}
    errorMessage={errorMessage}
  />
);
