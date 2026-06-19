/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useEffect, useState } from 'react';

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
		minHeight: 360,
	},
	customTarget: {
		borderColor: 'currentColor',
		borderStyle: 'dotted',
		borderWidth: 1,
		padding: 8,
		minHeight: 32,
	},
	select: {
		width: 320,
	},
});

/**
 * VR fixture: `menuPortalTarget` points at a CUSTOM element inside the
 * page (not `document.body`). With the flag on this `appendTo` is ignored
 * and the menu is hosted in the top layer. With the flag off the menu is
 * portaled into the custom element.
 */
export default function MenuPortalCustomTargetExample(): React.ReactNode {
	const [target, setTarget] = useState<HTMLElement | null>(null);
	useEffect(() => {
		setTarget(document.getElementById('react-select-custom-portal-target'));
	}, []);

	return (
		<div css={styles.root}>
			<Label htmlFor="menu-portal-custom-target-select">City</Label>
			<div css={styles.select}>
				<Select
					inputId="menu-portal-custom-target-select"
					testId="react-select"
					options={options}
					menuPortalTarget={target ?? undefined}
					defaultMenuIsOpen
				/>
			</div>
			<div id="react-select-custom-portal-target" css={styles.customTarget}>
				custom portal target
			</div>
		</div>
	);
}
