import React, { type ComponentType, useState } from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';
import { B400, N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import CheckboxIcon from '../glyph/checkbox';
import RadioIcon from '../glyph/radio';

type IconPair = [string, ComponentType<any>][];

const toggleableIcons: IconPair = [
	['checkbox', CheckboxIcon],
	['radio', RadioIcon],
];

const styles = {
	iconChecked: {
		color: token('color.icon.selected', B400),
	},
	iconUnchecked: {
		color: token('color.icon.inverse', N0),
	},
};

const ToggleIcons = (): React.JSX.Element => {
	const [isColorToggled, setIsColorToggled] = useState(false);
	const [isFillToggled, setIsFillToggled] = useState(false);

	return (
		<Box>
			<Heading size="large" as="h2" id="toggle-label">
				Toggle icons
			</Heading>
			<Box as="p" id="selected-heading">
				Activate these icons wrapped by a button to toggle between their selected and unselected
				states
			</Box>
			<Box role="group" aria-labelledby="toggle-label" aria-describedby="selected-heading">
				<Box>
					{toggleableIcons.map(([id, Icon]) => (
						<Button onClick={() => setIsColorToggled((old) => !old)} key={id}>
							<Icon
								key={id}
								label="Icon which toggles between their selected and unselected states"
								primaryColor={styles.iconChecked.color}
								secondaryColor={
									isColorToggled ? styles.iconUnchecked.color : styles.iconChecked.color
								}
							/>
						</Button>
					))}
				</Box>
			</Box>
			<Box as="p" id="checked-heading">
				Activate these icons wrapped by a button to see them reverse themselves while staying
				checked
			</Box>
			<Box role="group" aria-labelledby="toggle-label" aria-describedby="checked-heading">
				<Box>
					{toggleableIcons.map(([id, Icon]) => (
						<Button onClick={() => setIsFillToggled((old) => !old)} key={id}>
							<Icon
								key={id}
								label="Icon which toggles between their checked and unchecked states"
								primaryColor={isFillToggled ? styles.iconChecked.color : 'inherit'}
							/>
						</Button>
					))}
				</Box>
			</Box>
		</Box>
	);
};

export default ToggleIcons;
