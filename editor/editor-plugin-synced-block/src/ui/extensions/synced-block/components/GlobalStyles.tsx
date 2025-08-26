/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @atlaskit/ui-styling-standard/no-global-styles
import { css, Global, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const extensionStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'[extensionkey="synced-block:reference"] .ak-renderer-wrapper > div:last-of-type': {
		padding: token('space.250', '20px'),
		paddingRight: token('space.250', '20px'),
	},
});

export const GlobalStylesWrapper = () => {
	return <Global styles={[extensionStyles]} />;
};
