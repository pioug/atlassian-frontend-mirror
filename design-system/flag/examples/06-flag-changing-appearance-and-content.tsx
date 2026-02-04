/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactElement, type SyntheticEvent, useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import noop from '@atlaskit/ds-lib/noop';
import Flag, { FlagGroup } from '@atlaskit/flag';
import { AppearanceArray, type AppearanceTypes } from '@atlaskit/flag/types';
import Error from '@atlaskit/icon/core/status-error';
import Tick from '@atlaskit/icon/core/status-success';
import Warning from '@atlaskit/icon/core/status-warning';
import { Box, Text } from '@atlaskit/primitives/compiled';
import { RadioGroup } from '@atlaskit/radio';
import Spinner from '@atlaskit/spinner';
import { token } from '@atlaskit/tokens';

type Appearances<Keys extends AppearanceTypes> = {
	[K in Keys]: { description?: string; title: string; actions?: any[] };
};

const styles = cssMap({
	infoWrapper: {
		width: '2rem',
		height: '2rem',
	},
});

const appearances: Appearances<AppearanceTypes> = {
	normal: {
		description: 'We cannot log in at the moment, please try again soon.',
		title: 'Welcome to the jungle',
	},
	error: {
		description: 'You need to take action, something has gone terribly wrong!',
		title: 'We are having issues',
	},
	info: {
		title: 'Connecting...',
	},
	success: {
		title: 'Connected',
	},
	warning: {
		title: 'Trying again...',
		actions: [{ content: 'Good luck!', onClick: noop }],
	},
};

const appearanceTypes = AppearanceArray;

const appearanceOptions = appearanceTypes.map((appearance) => {
	return {
		label: appearance,
		name: appearance,
		value: appearance,
	};
});

const iconMap = (key: string) => {
	const icons: { [key: string]: ReactElement } = {
		normal: <Tick spacing="spacious" label="Success" color={token('color.icon.success')} />,
		info: (
			<Box xcss={styles.infoWrapper}>
				<Spinner size="small" appearance="invert" />
			</Box>
		),
		success: <Tick spacing="spacious" label="Success"  />,
		warning: <Warning spacing="spacious" label="Warning"  />,
		error: <Error spacing="spacious" label="Error"  />,
	};

	return key ? icons[key] : icons;
};

const getIcon = (key: string) => {
	return iconMap(key) as ReactElement;
};

const ConnectionDemo = (): JSX.Element => {
	const [appearance, setAppearance] = useState<AppearanceTypes>(appearanceTypes[0]);

	return (
		<Box>
			<FlagGroup>
				<Flag
					appearance={appearance}
					icon={getIcon(appearance)}
					title={appearances[appearance].title}
					description={appearances[appearance].description}
					actions={appearances[appearance].actions}
					id="fake-flag"
				/>
			</FlagGroup>
			<Text as="p">This story shows the transition between various flag appearances.</Text>
			<RadioGroup
				options={appearanceOptions}
				onChange={(e: SyntheticEvent<HTMLInputElement>) => {
					setAppearance(e.currentTarget.value as AppearanceTypes);
				}}
				defaultValue={appearanceTypes[0]}
			/>
		</Box>
	);
};

export default ConnectionDemo;
