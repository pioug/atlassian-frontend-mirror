import React from 'react';

import { IconTile } from '@atlaskit/icon';
import GlobeIcon from '@atlaskit/icon/core/globe';
import { Inline } from '@atlaskit/primitives/compiled';

const IconSizeExample = (): React.JSX.Element => {
	return (
		<Inline space="space.200">
			<IconTile icon={GlobeIcon} label="" appearance="blue" shape="square" size="medium" />
			<IconTile icon={GlobeIcon} label="" appearance="blue" shape="circle" size="medium" />
		</Inline>
	);
};

export default IconSizeExample;
