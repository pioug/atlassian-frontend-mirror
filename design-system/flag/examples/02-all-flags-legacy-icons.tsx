import React, { type ReactElement } from 'react';

import { cssMap } from '@atlaskit/css';
import noop from '@atlaskit/ds-lib/noop';
import Flag from '@atlaskit/flag';
import { type AppearanceTypes } from '@atlaskit/flag/types';
import Error from '@atlaskit/icon/core/status-error';
import Info from '@atlaskit/icon/core/status-information';
import Tick from '@atlaskit/icon/core/status-success';
import Warning from '@atlaskit/icon/core/status-warning';
import { Flex } from '@atlaskit/primitives/compiled';
import Stack from '@atlaskit/primitives/stack';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const actions = [
	{ content: 'Understood', onClick: noop },
	{ content: 'No Way!', onClick: noop },
];
const appearances: { [key: string]: { description: string; title: string } } = {
	normal: {
		description: 'We got fun and games. We got everything you want honey, we know the names.',
		title: 'Welcome to the jungle',
	},
	error: {
		description: 'You need to take action, something has gone terribly wrong!',
		title: 'Uh oh!',
	},
	info: {
		description: "This alert needs your attention, but it's not super important.",
		title: 'Hey, did you know...',
	},
	success: {
		description: 'Nothing to worry about, everything is going great!',
		title: 'Good news, everyone',
	},
	warning: {
		description: 'Pay attention to me, things are not going according to plan.',
		title: 'Heads up!',
	},
};

const iconMap = (key: string) => {
	const icons: { [key: string]: ReactElement } = {
		normal: (
			<Flex xcss={iconSpacingStyles.space050}>
				<Tick label="Normal success" color={token('color.icon.success')} />
			</Flex>
		),
		info: (
			<Flex xcss={iconSpacingStyles.space050}>
				<Info label="Info" />
			</Flex>
		),
		success: (
			<Flex xcss={iconSpacingStyles.space050}>
				<Tick label="Success" />
			</Flex>
		),
		warning: (
			<Flex xcss={iconSpacingStyles.space050}>
				<Warning label="Warning" />
			</Flex>
		),
		error: (
			<Flex xcss={iconSpacingStyles.space050}>
				<Error label="Error" />
			</Flex>
		),
	};

	return key ? icons[key] : icons;
};

const getIcon = (key: string) => {
	return iconMap(key) as ReactElement;
};

export default (): React.JSX.Element => (
	<Stack space="space.100">
		{Object.keys(appearances).map((type) => (
			<Flag
				actions={actions}
				appearance={type as AppearanceTypes}
				description={appearances[type].description}
				icon={getIcon(type)}
				id={type}
				key={type}
				title={appearances[type].title}
				testId={`flag-${type}`}
			/>
		))}
	</Stack>
);
