import React from 'react';

import { IconTile, type IconTileProps } from '@atlaskit/icon';
import GlobeIcon from '@atlaskit/icon/core/globe';
import { Inline, Stack } from '@atlaskit/primitives/compiled';

const sizes: IconTileProps['size'][] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

const IconSizeExample = (): React.JSX.Element => {
	return (
		<Stack space="space.200">
			<Inline space="space.200" shouldWrap={true} alignBlock="end">
				{sizes.map((size) => (
					<IconTile key={size} icon={GlobeIcon} label="" appearance="purple" size={size} />
				))}
			</Inline>
		</Stack>
	);
};

export default IconSizeExample;
