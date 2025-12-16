import React from 'react';

import Avatar from '@atlaskit/avatar';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';
import { AvatarTag, SimpleTag as Tag } from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<Box id="appearance" role="group" aria-label="Appearance examples">
		<Tag text="Base Tag" appearance="rounded" />
		<AvatarTag text="Avatar Before" avatar={Avatar} isRemovable={false} />
		<AvatarTag text="Avatar Before" testId="avatarTag" avatar={Avatar} removeButtonLabel="Remove" />
		<Tag text="Linked Tag" href="/components/tag" appearance="rounded" />
	</Box>
);
