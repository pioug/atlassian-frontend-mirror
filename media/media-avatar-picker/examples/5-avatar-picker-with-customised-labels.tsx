/* eslint-disable no-console */
import React from 'react';
import { type Avatar, AvatarPickerDialog } from '../src';
import { generateAvatars } from '../example-helpers';

const avatars: Array<Avatar> = generateAvatars(30);

export default () => (
	<AvatarPickerDialog
		avatars={avatars}
		defaultSelectedAvatar={avatars[5]}
		onImagePicked={() => console.log('onImagePicked')}
		onAvatarPicked={() => console.log('onAvatarPicked')}
		onCancel={() => console.log('onCancel')}
		title="Custom title!"
		primaryButtonText="This one!"
		selectAvatarLabel="Custom select default avatar!"
		showMoreAvatarsButtonLabel="Custom show more avatars!"
	/>
);
