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
 * VR fixture: NO portal config (no `menuPortalTarget`, default
 * `menuPosition="absolute"`). Legacy `MenuPortal` is bypassed entirely
 * and the menu renders inline. With the flag on the menu ALWAYS routes
 * through `MenuPortalTopLayer` - this is the new always-top-layer case.
 */
export default function MenuNoPortalConfigExample(): React.ReactNode {
	return (
		<div css={styles.root}>
			<Label htmlFor="menu-no-portal-config-select">City</Label>
			<div css={styles.select}>
				<Select
					inputId="menu-no-portal-config-select"
					testId="react-select"
					options={options}
					defaultMenuIsOpen
				/>
			</div>
		</div>
	);
}
