/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { Label } from '@atlaskit/form/label/default';
import Select from '@atlaskit/react-select/state-manager';
import { token } from '@atlaskit/tokens';

const options = Array.from({ length: 20 }, (_, index) => ({
	label: `City ${index + 1}`,
	value: `city-${index + 1}`,
}));

const styles = cssMap({
	root: {
		position: 'relative',
		minBlockSize: '100vh',
	},
	field: {
		position: 'absolute',
		insetBlockEnd: token('space.200'),
		insetInlineStart: token('space.200'),
		width: '240px',
	},
});

export default function MenuPortalViewportEdgeExample(): React.JSX.Element {
	return (
		<div css={styles.root}>
			<div css={styles.field}>
				<Label htmlFor="menu-portal-viewport-edge-example">City</Label>
				<Select
					inputId="menu-portal-viewport-edge-example"
					options={options}
					menuPortalTarget={typeof document === 'undefined' ? undefined : document.body}
				/>
			</div>
		</div>
	);
}
