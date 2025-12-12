import React from 'react';

import { IconTile, type IconTileProps } from '@atlaskit/icon';
import GlobeIcon from '@atlaskit/icon/core/globe';
import { Inline, Stack } from '@atlaskit/primitives/compiled';

const appearances: IconTileProps['appearance'][] = [
	'gray',
	'red',
	'orange',
	'yellow',
	'lime',
	'green',
	'teal',
	'blue',
	'purple',
	'magenta',
];

const boldAppearances: IconTileProps['appearance'][] = [
	'grayBold',
	'redBold',
	'orangeBold',
	'yellowBold',
	'limeBold',
	'greenBold',
	'tealBold',
	'blueBold',
	'purpleBold',
	'magentaBold',
];

const IconSizeExample = (): React.JSX.Element => {
	return (
		<Stack space="space.100">
			{[appearances, boldAppearances].map((appearance) => (
				<Inline space="space.200" shouldWrap={true}>
					{appearance.map((appearance) => (
						<IconTile
							key={appearance}
							icon={GlobeIcon}
							label=""
							appearance={appearance}
							shape="square"
							size="medium"
						/>
					))}
				</Inline>
			))}
		</Stack>
	);
};

export default IconSizeExample;
