/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const separatorStyles = css({
	background: token('color.border'),
	height: '1px',
});

export const DropdownSeparator = (): jsx.JSX.Element => {
	return <div css={separatorStyles}></div>;
};
