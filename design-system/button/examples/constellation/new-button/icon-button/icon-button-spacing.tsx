import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from "@atlaskit/primitives/compiled";

const IconButtonSpacingExample = (): React.JSX.Element => {
	return (
		<Inline space="space.200">
			<IconButton icon={MoreIcon} appearance="primary" label="More actions" />
			<IconButton icon={MoreIcon} appearance="primary" spacing="compact" label="More actions" />
		</Inline>
	);
};

export default IconButtonSpacingExample;
