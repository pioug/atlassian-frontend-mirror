/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import Textfield from '../../src';

const bigFontStyles = css({
	// container style
	padding: token('space.075', '6px'),
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > [data-ds--text-field--input]': {
		// input style
		fontSize: 20,
	},
});

export default function TextFieldCustomizationExample() {
	return <Textfield aria-label="customized text field" css={bigFontStyles} />;
}
