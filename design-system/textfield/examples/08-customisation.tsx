/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { Label } from '@atlaskit/form';
import TextField from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const overrideStyles = css({
	borderColor: 'orange',
	borderStyle: 'solid',
	borderWidth: token('border.width.selected'),
	paddingBlockEnd: token('space.075'),
	paddingBlockStart: token('space.075'),
	paddingInlineEnd: token('space.075'),
	paddingInlineStart: token('space.075'),
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors
	'& > [data-ds--text-field--input]': {
		borderColor: 'green',
		borderStyle: 'solid',
		borderWidth: token('border.width.selected'),
		fontSize: 20,
		lineHeight: 1.5,
	},
});

export default function OverrideStyleExample(): JSX.Element {
	return (
		<div>
			<Label htmlFor="custom">Customized textfield</Label>
			<TextField
				id="custom"
				testId="testOverride"
				width="large"
				// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
				css={overrideStyles}
				defaultValue="CSS overrides via data-attributes"
			/>
		</div>
	);
}
