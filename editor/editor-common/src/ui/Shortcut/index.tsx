/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css as cssUnbounded } from '@compiled/react';

import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const shortcutStyle = css({
	alignSelf: 'flex-end',
	paddingTop: token('space.050', '4px'),
	paddingBottom: token('space.050', '4px'),
	paddingLeft: token('space.050', '4px'),
	paddingRight: token('space.050', '4px'),
	color: token('color.text.subtle'),
	backgroundColor: token('color.background.neutral'),
	borderRadius: token('border.radius', '3px'),
	'@media (max-width: 0px)': {
		display: 'none',
	},
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- This rule thinks this isn't a `css()` call due to the name mapping
const shortcutStyleUnbounded = cssUnbounded({
	// TODO why it's using rem here, can it be replaced with 12px? https://product-fabric.atlassian.net/browse/EDF-2517
	/**
	 * original fontSize declaration is:
	 * ```js
	 * import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles/consts';
	 * fontSize: relativeFontSizeToBase16(11.67),
	 * ```
	 * but it caused post office build to fail, so I replaced it with a constant value
	 * see thread https://atlassian.slack.com/archives/C017XR8K1RB/p1740374276040639
	 */
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: `${11.67 / 16}rem`,
});

export function Shortcut({ children }: { children?: React.ReactNode }) {
	return <div css={[shortcutStyle, shortcutStyleUnbounded]}>{children}</div>;
}
