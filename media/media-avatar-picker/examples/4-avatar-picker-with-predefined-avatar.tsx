/* eslint-disable no-console */

import React from 'react';

import { generateAvatars } from '../example-helpers';
import { type Avatar, AvatarPickerDialog } from '../src';

const avatars: Array<Avatar> = generateAvatars(30);

export default (): React.JSX.Element => (
	<AvatarPickerDialog
		avatars={avatars}
		onImagePicked={() => console.log('onImagePicked')}
		onAvatarPicked={() => console.log('onAvatarPicked')}
		onCancel={() => console.log('onCancel')}
	/>
);
