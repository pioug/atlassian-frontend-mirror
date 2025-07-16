import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import MoreIcon from '@atlaskit/icon/core/migration/show-more-horizontal--more';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives';

const IconButtonSpacingExample = () => {
	return (
		<Inline space="space.200">
			<IconButton icon={MoreIcon} appearance="primary" label="More actions" />
			<IconButton icon={MoreIcon} appearance="primary" spacing="compact" label="More actions" />
		</Inline>
	);
};

export default IconButtonSpacingExample;
