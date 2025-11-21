import React, { type ReactElement, type ReactNode, useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import noop from '@atlaskit/ds-lib/noop';
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

const getRandomDescription = () => {
	const descriptions = [
		'Marzipan croissant pie. Jelly beans gingerbread caramels brownie icing.',
		'Fruitcake topping wafer pie candy dragée sesame snaps cake. Cake cake cheesecake. Pie tiramisu carrot cake tart tart dessert cookie. Lemon drops cookie tootsie roll marzipan liquorice cotton candy brownie halvah.',
	];

	return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const getFlagData = (index: number): flagData => {
	return {
		created: Date.now(),
		description: getRandomDescription(),
		icon: getRandomIcon(),
		id: index,
		key: index,
		title: `${index + 1}: Whoa a new flag!`,
	};
};

const FlagGroupExample = (): React.JSX.Element => {
	const [flags, setFlags] = useState<Array<flagData>>([]);

	const addFlag = () => {
		setFlags((current) => [getFlagData(flags.length), ...current]);
	};

	const dismissFlag = useCallback(
		(id: string | number) => {
			setFlags((current) => current.filter((flag) => flag.id !== id));
		},
		[setFlags],
	);

	return (
		<Box>
			<FlagGroup onDismissed={dismissFlag}>
				{flags.map((flag) => (
					<Flag
						actions={[
							{
								content: 'Nice one!',
								onClick: noop,
							},
							{
								content: 'Not right now thanks',
								onClick: () => dismissFlag(flag.id),
							},
						]}
						{...flag}
					/>
				))}
			</FlagGroup>
			<Button onClick={addFlag}>Add Flag</Button>
		</Box>
	);
};

export default FlagGroupExample;
