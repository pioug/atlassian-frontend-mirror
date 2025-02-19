/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

const bigFontStyles = css({
	// container style
	paddingBlockEnd: token('space.075'),
	paddingBlockStart: token('space.075'),
	paddingInlineEnd: token('space.075'),
	paddingInlineStart: token('space.075'),
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-ds--text-field--input]': {
		// input style
		fontSize: 20,
	},
});

export default function TextFieldCustomizationExample() {
	return (
		<Textfield
			aria-label="customized text field"
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/no-unsafe-style-overrides
			css={bigFontStyles}
		/>
	);
}
