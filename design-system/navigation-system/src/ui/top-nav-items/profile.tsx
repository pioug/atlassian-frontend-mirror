import React, { forwardRef, useCallback } from 'react';

import Avatar from '@atlaskit/avatar';

import { EndItem, type EndItemProps } from './end-item';

interface ProfileProps extends Omit<EndItemProps, 'icon'> {
	/**
	 * The URL of the image to display in the avatar.
	 */
	src?: string;
}

/**
 * __Profile__
 *
 * The Profile button for the top navigation.
 */
export const Profile = forwardRef<HTMLButtonElement, ProfileProps>(({ src, ...props }, ref) => {
	const ProfileAvatar = useCallback(
		() => <Avatar appearance="circle" src={src} size="small" />,
		[src],
	);

	return <EndItem {...props} ref={ref} icon={ProfileAvatar} />;
});
