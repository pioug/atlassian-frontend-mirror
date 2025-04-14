/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

// Assistive text to describe visual elements. Hidden for sighted users.
const styles = css({
	width: 1,
	height: 1,
	padding: 0,
	position: 'absolute',
	zIndex: 9999,
	border: 0,
	clip: 'rect(1px, 1px, 1px, 1px)',
	label: 'a11yText',
	overflow: 'hidden',
	userSelect: 'none', // while hidden text is sitting in the DOM, it should not be selectable
	whiteSpace: 'nowrap',
});
const A11yText = (props: JSX.IntrinsicElements['span']) => (
	<span
		css={styles}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);

export default A11yText;
