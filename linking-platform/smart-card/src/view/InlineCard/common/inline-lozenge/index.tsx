/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Lozenge, { type LozengeProps } from '@atlaskit/lozenge';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
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
	const shouldAddLozengeAttribute =
		expValEquals('cc_editor_ai_content_mode', 'variant', 'test') &&
		fg('platform_editor_content_mode_button_mvp');

	if (fg('jfp-magma-platform-lozenge-jump-fix')) {
		return (
			<span
				css={wrapperStylesNew}
				{...(shouldAddLozengeAttribute && { 'data-inline-card-lozenge': true })}
			>
				<Lozenge {...props} />
			</span>
		);
	}

	return (
		<span
			css={wrapperStylesOld}
			{...(shouldAddLozengeAttribute && { 'data-inline-card-lozenge': true })}
		>
			<Lozenge {...props} />
		</span>
	);
};

export default InlineLozenge;
