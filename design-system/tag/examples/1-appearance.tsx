import React from 'react';

import Avatar from '@atlaskit/avatar';
import { Box } from '@atlaskit/primitives/compiled';
import { AvatarTag, SimpleTag as Tag } from '@atlaskit/tag';
import TeamAvatar from '@atlaskit/teams-avatar';

export default (): React.JSX.Element => (
	<Box id="appearance" role="group" aria-label="Appearance examples">
		<Tag text="Base Tag" appearance="rounded" />
		<AvatarTag type="user" text="Avatar Before" avatar={Avatar} isRemovable={false} />
		<AvatarTag
			type="user"
			text="Avatar Before"
			testId="avatarTag"
			avatar={Avatar}
			removeButtonLabel="Remove"
		/>
		<AvatarTag type="other" text="Team Avatar" avatar={TeamAvatar} isRemovable={false} />
		<Tag text="Linked Tag" href="/components/tag" appearance="rounded" />
	</Box>
);
