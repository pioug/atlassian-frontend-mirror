import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import Flag, { FlagGroup } from '@atlaskit/flag';
import { type AppearanceTypes } from '@atlaskit/flag/types';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import StatusInformationIcon from '@atlaskit/icon/core/status-information';
import StatusSuccessIcon from '@atlaskit/icon/core/status-success';
import StatusWarningIcon from '@atlaskit/icon/core/status-warning';
import { token } from '@atlaskit/tokens';

const actions = [
	{ content: 'Understood', onClick: noop },
	{ content: 'Dismiss', onClick: noop },
];

export function SingleFlag(): React.JSX.Element {
	return (
		<FlagGroup onDismissed={noop}>
			<Flag
				id="single"
				icon={<StatusInformationIcon label="" color={token('color.icon.information')} />}
				title="Your changes were saved"
				description="All your data has been successfully updated."
				actions={actions}
				testId="flag-single"
			/>
		</FlagGroup>
	);
}

export function MultipleFlags(): React.JSX.Element {
	return (
		<FlagGroup onDismissed={noop}>
			<Flag
				id="first"
				icon={<StatusSuccessIcon label="" color={token('color.icon.success')} />}
				title="1: Most recent flag"
				description="This flag is on top of the stack."
				actions={actions}
				testId="flag-first"
			/>
			<Flag
				id="second"
				icon={<StatusWarningIcon label="" color={token('color.icon.warning')} />}
				title="2: Second flag"
				description="This flag peeks behind the first."
				testId="flag-second"
			/>
			<Flag
				id="third"
				icon={<StatusErrorIcon label="" color={token('color.icon.danger')} />}
				title="3: Third flag"
				description="This flag should be hidden."
				testId="flag-third"
			/>
		</FlagGroup>
	);
}

const appearances: Array<{
	type: AppearanceTypes;
	icon: React.ReactElement;
	title: string;
	description: string;
}> = [
	{
		type: 'normal',
		icon: <StatusInformationIcon label="" />,
		title: 'Normal appearance',
		description: 'We got fun and games.',
	},
	{
		type: 'error',
		icon: <StatusErrorIcon label="" />,
		title: 'Error appearance',
		description: 'Something has gone terribly wrong!',
	},
	{
		type: 'info',
		icon: <StatusInformationIcon label="" />,
		title: 'Info appearance',
		description: "This alert needs your attention, but it's not super important.",
	},
	{
		type: 'success',
		icon: <StatusSuccessIcon label="" />,
		title: 'Success appearance',
		description: 'Nothing to worry about, everything is going great!',
	},
	{
		type: 'warning',
		icon: <StatusWarningIcon label="" />,
		title: 'Warning appearance',
		description: 'Pay attention to me, things are not going according to plan.',
	},
];

export function AppearanceFlags(): React.JSX.Element {
	return (
		<FlagGroup onDismissed={noop}>
			{appearances.map(({ type, icon, title, description }) => (
				<Flag
					key={type}
					id={type}
					appearance={type}
					icon={icon}
					title={title}
					description={description}
					actions={actions}
					testId={`flag-${type}`}
				/>
			))}
		</FlagGroup>
	);
}

export default function FlagGroupTopLayerExample(): React.JSX.Element {
	return <SingleFlag />;
}
