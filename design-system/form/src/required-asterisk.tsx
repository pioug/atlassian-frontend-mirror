/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import { css } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const requiredIndicatorStyles = css({
	color: token('color.text.danger', '#DE350B'),
	fontFamily: token('font.family.body'),
	paddingInlineStart: token('space.025'),
});

export default function RequiredAsterisk() {
	return (
		// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
		<span css={requiredIndicatorStyles} aria-hidden="true" title="required">
			*
		</span>
	);
}
