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
	},
});

/**
 * Focus-contract fixture for the top-layer migration.
 *
 * - "before" button above the Select to anchor outgoing Shift+Tab tests.
 * - The Select uses `menuPortalTarget={document.body}` so it always enters
 *   `MenuPortal` (top-layer when the flag is on).
 * - "after" button below to anchor outgoing Tab tests.
 *
 * The combobox carve-out means DOM focus stays on the combobox input while
 * the menu is open - react-select uses `aria-activedescendant` for virtual
 * focus on options.
 */
export default function TopLayerFocusFixture(): React.ReactNode {
	return (
		<div css={styles.root}>
			<button type="button" data-testid="before-button">
				before
			</button>
			<div>
				<Label htmlFor="top-layer-focus-select">City</Label>
				<Select
					inputId="top-layer-focus-select"
					testId="react-select"
					options={options}
					menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
				/>
			</div>
			<button type="button" data-testid="after-button">
				after
			</button>
		</div>
	);
}
