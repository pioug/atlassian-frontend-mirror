import React from 'react';

import { Inline, Stack } from '@atlaskit/primitives';

import AddIcon from '../../core/add';
import { IconTile } from '../../src';

const appearances = [
	'blue',
	'green',
	'lime',
	'magenta',
	'orange',
	'purple',
	'red',
	'teal',
	'yellow',
	'gray',
] as const;

const boldAppearances = [
	'blueBold',
	'greenBold',
	'limeBold',
	'magentaBold',
	'orangeBold',
	'purpleBold',
	'redBold',
	'tealBold',
	'yellowBold',
	'grayBold',
] as const;

const IconSizeExample = () => {
	return (
		<Stack space="space.100">
			{[appearances, boldAppearances].map((appearance) => (
				<Inline space="space.200" shouldWrap={true}>
					{appearance.map((appearance) => (
						<IconTile
							key={appearance}
							icon={AddIcon}
							label=""
							appearance={appearance}
							shape="square"
							size="24"
						/>
					))}
				</Inline>
			))}
		</Stack>
	);
};

export default IconSizeExample;
