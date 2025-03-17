import React, { type ReactElement, type ReactNode, useRef, useState } from 'react';

import Button from '@atlaskit/button/new';
import Flag, { FlagGroup } from '@atlaskit/flag';
import Tick from '@atlaskit/icon/glyph/check-circle';
import Error from '@atlaskit/icon/glyph/error';
import Info from '@atlaskit/icon/glyph/info';
import Warning from '@atlaskit/icon/glyph/warning';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

type flagData = {
	created: number;
	description: string;
	icon: ReactNode;
	id: number;
	key: number;
	title: string;
	testId: string;
};

const getRandomIcon = (): ReactNode => {
	const icons = iconMap() as { [key: string]: ReactNode };
	const iconArray = Object.keys(icons).map((i) => icons[i]);
	return iconArray[Math.floor(Math.random() * iconArray.length)];
};

const iconMap = (key?: string, color?: string) => {
	const icons: { [key: string]: ReactElement } = {
		info: <Info label="Info" primaryColor={color || token('color.icon.information')} />,
		success: <Tick label="Success" primaryColor={color || token('color.icon.success')} />,
		warning: <Warning label="Warning" primaryColor={color || token('color.icon.warning')} />,
		error: <Error label="Error" primaryColor={color || token('color.icon.danger')} />,
	};

	return key ? icons[key] : icons;
};

const getFlagData = (index: number, timeOffset: number = 0): flagData => {
	return {
		created: Date.now() - timeOffset * 1000,
		description: 'I am a flag',
		icon: getRandomIcon(),
		id: index,
		key: index,
		title: `${index + 1}: Whoa a new flag!`,
		testId: `MyFlagTestId--${index + 1}`,
	};
};

const FlagGroupExample = () => {
	const [flags, setFlags] = useState<Array<flagData>>([]);
	let flagCount = useRef(0);

	const addFlag = () => {
		const newFlags = flags.slice();
		newFlags.unshift(getFlagData(flagCount.current++));
		setFlags(newFlags);
	};

	const dismissFlag = () => {
		setFlags(flags.slice(1));
		flagCount.current--;
	};

	const actions = [
		{
			content: 'Nice one!',
			onClick: () => alert('Flag has been clicked!'),
			testId: 'MyFlagAction',
		},
		{ content: 'Not right now thanks', onClick: dismissFlag },
	];

	return (
		<Box>
			<FlagGroup onDismissed={dismissFlag}>
				{flags.map((flag) => (
					<Flag actions={actions} {...flag} />
				))}
			</FlagGroup>
			<Button onClick={addFlag} testId="AddFlag">
				Add Flag
			</Button>
		</Box>
	);
};

export default FlagGroupExample;
