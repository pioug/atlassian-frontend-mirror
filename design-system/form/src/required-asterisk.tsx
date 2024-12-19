/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const requiredIndicatorStyles = cssMap({
	root: {
		color: token('color.text.danger', '#DE350B'),
		fontFamily: token('font.family.body'),
		paddingInlineStart: token('space.025'),
	},
});

export default function RequiredAsterisk() {
	return (
		<span css={requiredIndicatorStyles.root} aria-hidden="true" title="required">
			*
		</span>
	);
}
