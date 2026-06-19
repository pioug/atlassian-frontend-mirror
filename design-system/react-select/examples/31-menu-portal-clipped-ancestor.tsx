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
	wrapper: {
		// Outer wrapper so the screenshot capture is tall enough to show the
		// top-layer popover, which is hoisted to `<body>` and would
		// otherwise be cropped out of the inner clipping ancestor's screenshot.
		padding: 16,
		minHeight: 360,
	},
	root: {
		width: 320,
		height: 120,
		overflow: 'hidden',
		transform: 'translateZ(0)',
		borderColor: 'currentColor',
		borderStyle: 'dashed',
		borderWidth: 1,
	},
});

/**
 * VR fixture: Select nested inside an ancestor with `transform` +
 * `overflow: hidden`. Under the legacy `createPortal(menu, body)` path the
 * menu is still clipped because the consumer-controlled ancestor establishes a
 * containing block. Under the top-layer path the menu paints in the browser
 * top layer and escapes the clip.
 */
export default function MenuPortalClippedAncestorExample(): React.ReactNode {
	return (
		<div css={styles.wrapper}>
			<div css={styles.root}>
				<Label htmlFor="menu-portal-clipped-example">City</Label>
				<Select
					inputId="menu-portal-clipped-example"
					testId="react-select"
					options={options}
					menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
					defaultMenuIsOpen
				/>
			</div>
		</div>
	);
}
