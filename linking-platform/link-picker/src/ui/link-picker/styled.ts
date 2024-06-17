// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const rootContainerStyles = css`
	width: ${getBooleanFF('platform.linking-platform.link-picker.fixed-height-search-results')
		? undefined
		: 'var(--link-picker-width)'};
	padding-left: var(--link-picker-padding-left);
	padding-right: var(--link-picker-padding-right);
	padding-top: var(--link-picker-padding-top);
	padding-bottom: var(--link-picker-padding-bottom);
	box-sizing: border-box;
	line-height: initial;
	display: block !important;
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const formFooterMargin = css({
	marginTop: token('space.200', '16px'),
});
