/** @jsx jsx */
import type { PropsWithChildren } from 'react';

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
