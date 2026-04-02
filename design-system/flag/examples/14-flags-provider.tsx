import React, { useRef } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import noop from '@atlaskit/ds-lib/noop';
import { type CreateFlagArgs, FlagsProvider, useFlags } from '@atlaskit/flag';
import Info from '@atlaskit/icon/core/status-information';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

const actions = [
	{
		content: 'Nice one!',
		onClick: noop,
	},
];

const getFlagData = (
	description: string,
	index: number,
	useId: boolean = true,
	isAutoDismiss: boolean = false,
): CreateFlagArgs => {
	const flagData: CreateFlagArgs = {
		actions,
		description: description,
		icon: (
			<Flex xcss={iconSpacingStyles.space050}>
				<Info label="Info" color={token('color.icon.information')} />
			</Flex>
		),
		title: `${index + 1}: Whoa a new flag!`,
		isAutoDismiss: isAutoDismiss,
	};
	if (useId) {
		flagData.id = index;
	}
	return flagData;
};

const FlagGroupExample = () => {
	const flagCount = useRef(0);

	const { showFlag } = useFlags();

	const addFlag = () => {
		showFlag(getFlagData('Added from the context 🤯', flagCount.current++));
	};

	const addFlagNoId = () => {
		showFlag(getFlagData('I was not given an id 🕵️‍♀️', flagCount.current++, false));
	};

	const addAutoDismissFlag = () => {
		showFlag(
			getFlagData(
				'I will automatically dismiss after 8 seconds ⏰',
				flagCount.current++,
				false,
				true,
			),
		);
	};

	return (
		<ButtonGroup label="Сhoose a flag">
			<Button onClick={addFlag}>Add Flag</Button>
			<Button onClick={addFlagNoId}>Add Flag without id</Button>
			<Button onClick={addAutoDismissFlag}>Add AutoDismissFlag</Button>
		</ButtonGroup>
	);
};

export default (): React.JSX.Element => (
	<FlagsProvider>
		<FlagGroupExample />
	</FlagsProvider>
);
