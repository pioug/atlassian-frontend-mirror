/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import type { LozengeProps } from '@atlaskit/lozenge/lozenge';
import Lozenge from '@atlaskit/lozenge/new/lozenge';
import type { NewLozengeProps } from '@atlaskit/lozenge/types';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

const wrapperStyles = css({
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
	return (
		<span
			css={[
				wrapperStyles,
				fg('platform-dst-lozenge-tag-badge-visual-uplifts') ? wrapperStylesNewLozenge : undefined,
			]}
			data-inline-card-lozenge
		>
			<Lozenge {...props} />
		</span>
	);
};

export default InlineLozenge;
