/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const separatorStyles = css({
	background: token('color.border'),
	height: '1px',
});

export const DropdownSeparator = () => {
	return <div css={separatorStyles}></div>;
};
