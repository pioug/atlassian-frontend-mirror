/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Lozenge, { type LozengeProps } from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

const wrapperStylesOld = css({
	display: 'inline-block',
	// Align the label with the text
	verticalAlign: '1px',
	marginTop: 0,
	marginRight: token('space.050', '4px'),
	marginBottom: 0,
	marginLeft: token('space.025', '2px'),

	// Set max width to prevent Lozenge to overflow on top of other element in smaller space, e.g. inside table cell
	maxWidth: '100%',
});

const wrapperStylesNew = css({
	display: 'inline-block',
	// Align the label with the text without causing a layout shift (top & position)
	top: '-1px',
	position: 'relative',
	marginTop: 0,
	marginRight: token('space.050', '4px'),
	marginBottom: 0,
	marginLeft: token('space.025', '2px'),

	// Set max width to prevent Lozenge to overflow on top of other element in smaller space, e.g. inside table cell
	maxWidth: '100%',
});

type InlineLozengeProps = LozengeProps;
const InlineLozenge = (props: InlineLozengeProps) => {
	if (fg('jfp-magma-platform-lozenge-jump-fix')) {
		return (
			<span css={wrapperStylesNew}>
				<Lozenge {...props} />
			</span>
		);
	}

	return (
		<span css={wrapperStylesOld}>
			<Lozenge {...props} />
		</span>
	);
};

export default InlineLozenge;
