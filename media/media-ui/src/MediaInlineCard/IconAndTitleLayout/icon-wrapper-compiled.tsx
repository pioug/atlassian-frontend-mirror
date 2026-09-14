// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

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

const iconWrapperStyles = css({
	userSelect: 'none',
});

// Wraps all icons represented in Inline Links. Icons have three sources/types:
// - JSON-LD: from the generator.icon property coming back from ORS.
// - @atlaskit/icon: for lock icons, unauthorized, etc.
// - @atlaskit/icon-object: for object icons, e.g. repository, branch, etc.
// NB: the first set of overrides style icons imported from @atlaskit/icon-object correctly.
// NB: the second set of overrides style icons imported from @atlaskit/icon correctly.
export const IconWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLSpanElement>,
	HTMLSpanElement
>): JSX.Element => (
	<span css={[iconWrapperStyles, iconObjectOverrideStyles, iconOverrideStyles]} {...props}>
		{children}
	</span>
);
