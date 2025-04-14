/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import { removeProps } from '../../utils';

const dummyInputStyles = css({
	width: 1,
	padding: 0,
	position: 'relative',
	background: 0,
	border: 0,
	caretColor: 'transparent',
	color: 'transparent',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	fontSize: 'inherit',
	gridArea: '1 / 1 / 2 / 3',
	insetInlineStart: -100,
	label: 'dummyInput',
	opacity: 0,
	outline: 0,
	transform: 'scale(.01)',
});

export default function DummyInput({
	innerRef,
	...props
}: JSX.IntrinsicElements['input'] & {
	readonly innerRef: Ref<HTMLInputElement>;
}) {
	// Remove animation props not meant for HTML elements
	const filteredProps = removeProps(props, 'onExited', 'in', 'enter', 'exit', 'appear');

	return <input ref={innerRef} {...filteredProps} css={dummyInputStyles} />;
}
