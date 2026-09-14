import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';

/**
 * Use `label=""` to mark an avatar as decorative (purely visual, no semantic meaning).
 * This suppresses the `aria-labelledby` attribute so screen readers skip the avatar image.
 * Use this when the avatar is accompanied by a visible text label that already identifies the user.
 */
export default (): React.JSX.Element => (
	<Avatar
		src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6Skh_400x400.jpg"
		size="medium"
		label=""
		testId="avatar"
	/>
);
