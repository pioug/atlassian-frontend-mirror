import React from 'react';

import { IconTile } from '@atlaskit/icon';
import AddIcon from '@atlaskit/icon/core/add';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline } from '@atlaskit/primitives';

const IconSizeExample = () => {
	return (
		<Inline space="space.200">
			<IconTile icon={AddIcon} label="" appearance="blue" shape="square" size="24" />
			<IconTile icon={AddIcon} label="" appearance="blue" shape="circle" size="24" />
		</Inline>
	);
};

export default IconSizeExample;
