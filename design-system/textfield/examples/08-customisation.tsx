/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { Label } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const overrideStyles = css({
	padding: token('space.075', '6px'),

	border: '2px solid orange',
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-ds--text-field--input]': {
		border: '2px solid green',
		fontSize: 20,
		lineHeight: 1.5,
	},
});

export default function OverrideStyleExample() {
	return (
		<div>
			<Label htmlFor="custom">Customized textfield</Label>
			<TextField
				id="custom"
				testId="testOverride"
				width="large"
				css={overrideStyles}
				defaultValue="CSS overrides via data-attributes"
			/>
		</div>
	);
}
