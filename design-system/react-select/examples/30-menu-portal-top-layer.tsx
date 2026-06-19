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
		// Ensure the screenshot bounds include the drop-down menu region.
		// Without this, the top-layer popover is hoisted to `<body>` and the
		// `@af/visual-regression` capture, which is sized to the example
		// wrapper, crops the menu out.
		minHeight: 320,
	},
	select: {
		width: 320,
	},
});

/**
 * VR fixture: a plain Select with `menuPortalTarget={document.body}` and the
 * menu pre-opened. Used to verify visual parity between the legacy createPortal
 * path and the top-layer path.
 */
export default function MenuPortalTopLayerExample(): React.ReactNode {
	return (
		<div css={styles.root}>
			<Label htmlFor="menu-portal-top-layer-example">City</Label>
			<div css={styles.select}>
				<Select
					inputId="menu-portal-top-layer-example"
					testId="react-select"
					options={options}
					menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
					defaultMenuIsOpen
				/>
			</div>
		</div>
	);
}
