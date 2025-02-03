/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import Flag, { FlagGroup, type FlagProps } from '@atlaskit/flag';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { GiveKudosLauncher } from '../src';

const styles = cssMap({
	buttonWrapper: {
		marginTop: token('space.200'),
		marginRight: token('space.200'),
		marginBottom: token('space.200'),
		marginLeft: token('space.200'),
	},
});

export default function Example() {
	const [isOpen, setIsOpen] = useState(false);
	const [flags, setFlags] = useState<Array<FlagProps>>([]);

	const addFlag = (flag: FlagProps) => {
		setFlags((current) => [flag, ...current]);
	};

	const dismissFlag = useCallback(
		(id: string | number) => {
			setFlags((current) => current.filter((flag) => flag.id !== id));
		},
		[setFlags],
	);

	const openGiveKudos = () => {
		setIsOpen(true);
	};

	const kudosClosed = () => {
		setIsOpen(false);
	};

	return (
		<div>
			<Box xcss={styles.buttonWrapper}>
				<Button onClick={openGiveKudos}>Give Kudos</Button>
			</Box>
			<GiveKudosLauncher
				testId={'giveKudosLauncher'}
				isOpen={isOpen}
				onClose={kudosClosed}
				analyticsSource={'test'}
				teamCentralBaseUrl={'http://localhost:3000'}
				cloudId={'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5'}
				addFlag={addFlag}
			/>
			<FlagGroup onDismissed={dismissFlag}>
				{flags.map((flag) => (
					<Flag {...flag} />
				))}
			</FlagGroup>
		</div>
	);
}
