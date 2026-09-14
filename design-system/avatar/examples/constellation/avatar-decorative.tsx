import React from 'react';

import Avatar from '@atlaskit/avatar/avatar';

/**
 * Use `label=""` to mark an avatar as decorative (purely visual, no semantic meaning).
 * Screen readers will skip the avatar image when accompanied by visible text that already identifies the user.
 */
export default (): React.JSX.Element => (
	<Avatar
		src="https://pbs.twimg.com/profile_images/803832195970433027/aaoG6Skh_400x400.jpg"
		name="John Smith"
		label=""
		size="medium"
		testId="avatar"
	/>
);
