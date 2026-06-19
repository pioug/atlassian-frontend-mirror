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
		width: 320,
		height: 100,
		overflow: 'hidden',
		borderColor: 'currentColor',
		borderStyle: 'solid',
		borderWidth: 1,
		padding: 12,
	},
});

/**
 * Playwright fixture: Select nested inside an `overflow: hidden` scroll
 * container. Used to verify the top-layer path escapes the clip when the
 * flag is on.
 */
export default function MenuPortalOverflowFixture(): React.ReactNode {
	return (
		<div data-testid="clip-container" css={styles.root}>
			<Label htmlFor="menu-portal-overflow-select">City</Label>
			<Select
				inputId="menu-portal-overflow-select"
				testId="react-select"
				options={options}
				menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
			/>
		</div>
	);
}
