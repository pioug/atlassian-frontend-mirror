/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

interface BeforeProps {
	elemBefore?: ReactNode;
}

const beforeElementStyles = css({
	display: 'flex',
	height: '1rem',
	alignItems: 'center',
	justifyContent: 'center',
	insetBlockStart: token('space.0', '0px'),
});

const Before: ({ elemBefore }: BeforeProps) => JSX.Element | null = ({ elemBefore }: BeforeProps) =>
	elemBefore ? <span css={beforeElementStyles}>{elemBefore}</span> : null;

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Before;
