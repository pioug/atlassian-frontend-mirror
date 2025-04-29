import React, { useRef } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import noop from '@atlaskit/ds-lib/noop';
import { FlagsProvider, useFlags } from '@atlaskit/flag';
import InformationIcon from '@atlaskit/icon/core/migration/information--info';
import { token } from '@atlaskit/tokens';

const actions = [
	{
		content: 'Nice one!',
		onClick: noop,
	},
];

const FlagGroupExample = () => {
	const flagCount = useRef(1);

	const { showFlag } = useFlags();

	const addFlag = () => {
		const id = flagCount.current++;
		showFlag({
			actions,
			description: 'Added from the context.',
			icon: (
				<InformationIcon
					label="Info"
					LEGACY_primaryColor={token('color.icon.information')}
					color={token('color.icon.information')}
					spacing="spacious"
				/>
			),
			id: id,
			title: `${id}: Whoa a new flag!`,
		});
	};

	const addFlagNoId = () => {
		showFlag({
			actions,
			description: 'I was not given an id.',
			icon: (
				<InformationIcon
					label="Info"
					LEGACY_primaryColor={token('color.icon.information')}
					color={token('color.icon.information')}
					spacing="spacious"
				/>
			),
			title: `${flagCount.current++}: Whoa a new flag!`,
		});
	};

	const addAutoDismissFlag = () => {
		showFlag({
			actions,
			description: 'I will automatically dismiss after 8 seconds.',
			icon: (
				<InformationIcon
					label="Info"
					LEGACY_primaryColor={token('color.icon.information')}
					color={token('color.icon.information')}
					spacing="spacious"
				/>
			),
			title: `${flagCount.current++}: Whoa a new flag!`,
			isAutoDismiss: true,
		});
	};

	return (
		<ButtonGroup label="Choose a flag">
			<Button onClick={addFlag}>Add Flag</Button>
			<Button onClick={addFlagNoId}>Add Flag without id</Button>
			<Button onClick={addAutoDismissFlag}>Add AutoDismissFlag</Button>
		</ButtonGroup>
	);
};

export default () => (
	<FlagsProvider>
		<FlagGroupExample />
	</FlagsProvider>
);
