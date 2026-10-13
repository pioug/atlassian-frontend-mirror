/* eslint-disable no-console */

import React from 'react';

import type { Avatar } from '@atlaskit/media-avatar-picker/avatar-list';
import AvatarPickerDialog from '@atlaskit/media-avatar-picker/avatar-picker-dialog-loader';

import { generateAvatars } from '../example-helpers';

const avatars: Array<Avatar> = generateAvatars(30);

export default (): React.JSX.Element => (
	<AvatarPickerDialog
		avatars={avatars}
		onImagePicked={() => console.log('onImagePicked')}
		onAvatarPicked={() => console.log('onAvatarPicked')}
		onCancel={() => console.log('onCancel')}
	/>
);
