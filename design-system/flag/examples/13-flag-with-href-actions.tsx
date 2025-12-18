import React, { type ReactElement } from 'react';

import Flag, { type AppearanceTypes } from '@atlaskit/flag';
import Error from '@atlaskit/icon/core/status-error';
import Info from '@atlaskit/icon/core/status-information';
import Tick from '@atlaskit/icon/core/status-success';
import Warning from '@atlaskit/icon/core/status-warning';
import { Stack } from '@atlaskit/primitives/compiled';

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
		icon: <Error spacing="spacious" label="Error" />,
	},
	{
		appearance: 'info',
		description: "This alert needs your attention, but it's not super important.",
		title: 'info flag',
		icon: <Info spacing="spacious" label="Info" />,
	},
	{
		appearance: 'success',
		description: 'Nothing to worry about, everything is going great!',
		title: 'success flag',
		icon: <Tick spacing="spacious" label="Success" />,
	},
	{
		appearance: 'warning',
		description: 'Pay attention to me, things are not going according to plan.',
		title: 'warning flag',
		icon: <Warning spacing="spacious" label="Warning" />,
	},
	{
		appearance: 'normal',
		description: 'There is new update available',
		title: 'normal flag',
		icon: <Tick spacing="spacious" label="Success" />,
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
