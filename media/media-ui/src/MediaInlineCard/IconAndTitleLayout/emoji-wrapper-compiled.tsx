// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

// TODO: remove this override behaviour for @atlaskit/icon-object
const iconObjectOverrideStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > span': {
		height: '16px',
		width: '14px',
		position: 'absolute',
		top: 0,
		left: 0,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '14px',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > svg': {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		},
	},
});

// TODO: remove this override behaviour for @atlaskit/icon
const iconOverrideStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'& > * > span': {
		height: '16px',
		width: '14px',
		position: 'absolute',
		top: 0,
		left: 0,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& > svg': {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		},
	},
});

const emojiWrapperStyles = css({
	display: 'inline-block',
	marginRight: token('space.025'),
	userSelect: 'none',
});

// Wraps all emoji in Inline Links similar to icon
export const EmojiWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLSpanElement>,
	HTMLSpanElement
>): JSX.Element => (
	<span css={[emojiWrapperStyles, iconObjectOverrideStyles, iconOverrideStyles]} {...props}>
		{children}
	</span>
);
