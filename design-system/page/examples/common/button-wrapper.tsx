/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { PropsWithChildren } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const buttonWrapperStyles = css({
	display: 'flex',
	padding: token('space.050', '4px'),
	gap: token('space.100', '8px'),
	flexWrap: 'wrap',
});

export const ButtonWrapper = ({ children }: PropsWithChildren<{}>) => (
	<div css={buttonWrapperStyles}>{children}</div>
);
