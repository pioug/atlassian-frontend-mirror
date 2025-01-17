/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { R400 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const requiredIndicatorStyles = css({
	color: token('color.text.danger', R400),
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
