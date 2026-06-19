/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/react-select';

const options = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
	{ label: 'Canberra', value: 'canberra' },
];

const styles = cssMap({
	root: {
		padding: 16,
		display: 'flex',
		flexDirection: 'column',
		gap: 12,
		minHeight: 320,
	},
	select: {
		width: 320,
	},
});

/**
 * VR fixture: `menuPosition="fixed"` with NO `menuPortalTarget`. Legacy
 * `MenuPortal` honoured this by mounting the menu inline with
 * `position: fixed`. With the flag on the menu routes through
 * `MenuPortalTopLayer`.
 */
export default function MenuPositionFixedExample(): React.ReactNode {
	return (
		<div css={styles.root}>
			<Label htmlFor="menu-position-fixed-select">City</Label>
			<div css={styles.select}>
				<Select
					inputId="menu-position-fixed-select"
					testId="react-select"
					options={options}
					menuPosition="fixed"
					defaultMenuIsOpen
				/>
			</div>
		</div>
	);
}
