import React from 'react';

import Heading from '@atlaskit/heading';
import { IconTile, type IconTileProps } from '@atlaskit/icon';
import GlobeIcon from '@atlaskit/icon/core/globe';
import { Inline, Stack } from '@atlaskit/primitives/compiled';

const sizes: IconTileProps['size'][] = ['xsmall', 'small', 'medium', 'large', 'xlarge'];
const legacySizes: IconTileProps['size'][] = ['16', '24', '32', '40', '48'];

const IconSizeExample = () => {
	return (
		<Stack space="space.200">
			<Stack space="space.100">
				<Heading size="small">New t-shirt sizes</Heading>
				<Inline space="space.200" shouldWrap={true} alignBlock="end">
					{sizes.map((size) => (
						<IconTile
							key={size}
							icon={GlobeIcon}
							label=""
							appearance="purple"
							size={size}
							shape="square"
						/>
					))}
				</Inline>
			</Stack>
			<Stack space="space.100">
				<Heading size="small">Deprecated pixel number sizes</Heading>
				<Inline space="space.200" shouldWrap={true} alignBlock="end">
					{legacySizes.map((size) => (
						<IconTile
							key={size}
							icon={GlobeIcon}
							label=""
							appearance="yellow"
							size={size}
							shape="square"
						/>
					))}
				</Inline>
			</Stack>
		</Stack>
	);
};

export default IconSizeExample;
