/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Lozenge, { type LozengeProps } from '@atlaskit/lozenge';
import { token } from '@atlaskit/tokens';

const wrapperStyles = css({
	display: 'inline-block',
	verticalAlign: '1px',
	marginTop: 0,
	marginRight: token('space.050', '4px'),
	marginBottom: 0,
	marginLeft: token('space.025', '2px'),

	// Set max width to prevent Lozenge to overflow on top of other element in smaller space, e.g. inside table cell
	maxWidth: '100%',
});

type InlineLozengeProps = LozengeProps;
const InlineLozenge = (props: InlineLozengeProps) => (
	<span css={wrapperStyles}>
		<Lozenge {...props} />
	</span>
);
export default InlineLozenge;
