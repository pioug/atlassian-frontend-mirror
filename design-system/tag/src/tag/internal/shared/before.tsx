/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

interface BeforeProps {
	elemBefore?: ReactNode;
}

const beforeElementStyles = css({
	display: 'flex',
	height: '16px',
	alignItems: 'center',
	justifyContent: 'center',
	insetBlockStart: token('space.0', '0px'),
});

// To be removed with platform-component-visual-refresh (BLU-2992)
const beforeElementStylesOld = css({
	display: 'flex',
	position: 'absolute',
	alignItems: 'center',
	justifyContent: 'center',
	borderRadius: 'var(--ds-br)',
	insetBlockStart: token('space.0', '0px'),
});

const Before = ({ elemBefore }: BeforeProps) =>
	elemBefore ? (
		<span
			css={[fg('platform-component-visual-refresh') ? beforeElementStyles : beforeElementStylesOld]}
		>
			{elemBefore}
		</span>
	) : null;

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Before;
