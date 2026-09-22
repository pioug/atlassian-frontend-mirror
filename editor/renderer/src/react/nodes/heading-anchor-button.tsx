/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ButtonHTMLAttributes, JSX } from 'react';

import { css, jsx } from '@atlaskit/css';

const buttonStyles = css({
	display: 'inline-flex',
	boxSizing: 'border-box',
	alignItems: 'center',
	justifyContent: 'center',
	width: '24px',
	height: '24px',
	paddingTop: 0,
	paddingRight: 0,
	paddingBottom: 0,
	paddingLeft: 0,
	verticalAlign: 'middle',
	outline: 'none',
	backgroundColor: 'transparent',
	borderStyle: 'none',
	cursor: 'pointer',
});

/** Heading link button with a minimum 24px pointer target. */
export default function HeadingAnchorButton(
	props: ButtonHTMLAttributes<HTMLButtonElement>,
): JSX.Element {
	// eslint-disable-next-line react/jsx-props-no-spreading -- Forward the existing heading anchor's accessibility and event props.
	return <button {...props} type="button" css={buttonStyles} />;
}
