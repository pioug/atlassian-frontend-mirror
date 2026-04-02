import React, { type ReactElement } from 'react';

import { cssMap } from '@atlaskit/css';
import Flag, { type AppearanceTypes } from '@atlaskit/flag';
import Error from '@atlaskit/icon/core/status-error';
import Info from '@atlaskit/icon/core/status-information';
import Tick from '@atlaskit/icon/core/status-success';
import Warning from '@atlaskit/icon/core/status-warning';
import { Flex, Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

type FlagVariant = {
	appearance: AppearanceTypes;
	description: string;
	title: string;
	icon: ReactElement;
};

const FlagActions = [
	{
		content: 'with onClick',
		onClick: () => {
			console.log('flag action clicked');
		},
	},
	{
		content: 'with href',
		href: 'https://atlaskit.atlassian.com/',
		target: '_blank',
	},
];

const flagVariants: Array<FlagVariant> = [
	{
		appearance: 'error',
		description: 'You need to take action, something has gone terribly wrong!',
		title: 'error flag',
		icon: (
			<Flex xcss={iconSpacingStyles.space050}>
				<Error label="Error" />
			</Flex>
		),
	},
	{
		appearance: 'info',
		description: "This alert needs your attention, but it's not super important.",
		title: 'info flag',
		icon: (
			<Flex xcss={iconSpacingStyles.space050}>
				<Info label="Info" />
			</Flex>
		),
	},
	{
		appearance: 'success',
		description: 'Nothing to worry about, everything is going great!',
		title: 'success flag',
		icon: (
			<Flex xcss={iconSpacingStyles.space050}>
				<Tick label="Success" />
			</Flex>
		),
	},
	{
		appearance: 'warning',
		description: 'Pay attention to me, things are not going according to plan.',
		title: 'warning flag',
		icon: (
			<Flex xcss={iconSpacingStyles.space050}>
				<Warning label="Warning" />
			</Flex>
		),
	},
	{
		appearance: 'normal',
		description: 'There is new update available',
		title: 'normal flag',
		icon: (
			<Flex xcss={iconSpacingStyles.space050}>
				<Tick label="Success" />
			</Flex>
		),
	},
];

export default (): React.JSX.Element => (
	<Stack space="space.100">
		{flagVariants.map((flag: FlagVariant) => (
			<Flag
				appearance={flag.appearance}
				actions={FlagActions}
				description={flag.description}
				icon={flag.icon}
				id="1"
				key={flag.appearance}
				title={flag.title}
			/>
		))}
	</Stack>
);
