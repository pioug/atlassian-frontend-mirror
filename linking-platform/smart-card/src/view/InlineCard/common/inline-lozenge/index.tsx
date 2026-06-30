/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Lozenge, { type LozengeProps, type NewLozengeProps } from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

const wrapperStylesOld = css({
	display: 'inline-block',
	// Align the label with the text
	verticalAlign: '1px',
	marginTop: 0,
	marginRight: token('space.050'),
	marginBottom: 0,
	marginLeft: token('space.025'),

	// Set max width to prevent Lozenge to overflow on top of other element in smaller space, e.g. inside table cell
	maxWidth: '100%',
});

const wrapperStylesNew = css({
	display: 'inline-block',
	// Align the label with the text without causing a layout shift (top & position)
	top: '-1px',
	position: 'relative',
	marginTop: 0,
	marginRight: token('space.050'),
	marginBottom: 0,
	marginLeft: token('space.025'),

	// Set max width to prevent Lozenge to overflow on top of other element in smaller space, e.g. inside table cell
	maxWidth: '100%',
});

const wrapperStylesNewLozenge = css({
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginRight: '1px',
});

type InlineLozengeProps = LozengeProps | NewLozengeProps;
const InlineLozenge = (props: InlineLozengeProps): JSX.Element => {
	if (fg('jfp-magma-platform-lozenge-jump-fix')) {
		return (
			<span
				css={[
					wrapperStylesNew,
					fg('platform-dst-lozenge-tag-badge-visual-uplifts') ? wrapperStylesNewLozenge : undefined,
				]}
				data-inline-card-lozenge
			>
				<Lozenge {...props} />
			</span>
		);
	}

	return (
		<span
			css={[
				wrapperStylesOld,
				fg('platform-dst-lozenge-tag-badge-visual-uplifts') ? wrapperStylesNewLozenge : undefined,
			]}
			data-inline-card-lozenge
		>
			<Lozenge {...props} />
		</span>
	);
};

export default InlineLozenge;
