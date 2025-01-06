/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { R500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const requiredIndicatorStyles = css({
	color: token('color.text.danger', R500),
	paddingInlineStart: token('space.025', '2px'),
});

export default function RequiredIndicator() {
	return (
		// eslint-disable-next-line @atlaskit/design-system/use-primitives-text
		<span css={requiredIndicatorStyles} aria-hidden>
			*
		</span>
	);
}
