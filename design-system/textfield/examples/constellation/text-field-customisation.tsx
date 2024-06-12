/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import Textfield from '../../src';

const bigFontStyles = css({
	// container style
	padding: token('space.075', '6px'),
	// eslint-disable-next-line @atlaskit/design-system/no-nested-styles
	'& > [data-ds--text-field--input]': {
		// input style
		fontSize: 20,
	},
});

export default function TextFieldCustomizationExample() {
	return <Textfield aria-label="customized text field" css={bigFontStyles} />;
}
