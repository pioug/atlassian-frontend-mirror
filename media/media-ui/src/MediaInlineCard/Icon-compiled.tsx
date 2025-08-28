/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';

// TODO: Figure out a more scalable/responsive solution
// for vertical alignment.
// Current rationale: vertically positioned at the top of
// the smart card container (when set to 0). Offset this
// to position it with appropriate whitespace from the top.
const iconStyles = css({
	height: '14px',
	width: '14px',
	marginRight: token('space.050', '4px'),
	borderRadius: token('radius.xsmall'),
	userSelect: 'none',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
});

export const Icon = ({
	alt,
	...props
}: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => (
	<img css={iconStyles} alt={alt || 'icon'} {...props} />
);

// Used for 'untrue' icons which claim to be 16x16 but
// are less than that in height/width.
// TODO: Replace this override with proper AtlasKit solution.
const akIconWrapperStyles = css({
	marginRight: token('space.negative.025', '-2px'),
});

export const AKIconWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
	<span css={akIconWrapperStyles} {...props}>
		{children}
	</span>
);
