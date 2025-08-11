/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { B200, N20A, N30A, N40A, N50A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export interface FrameProps {
	children?: React.ReactNode;
	/* Set spacing and what elements are rendered. Compact is for loading and error views */
	compact?: boolean;
	/* Set whether it is selected. NB: The card is only selectable in the `editor` view, and will be provided by the editor */
	isSelected?: boolean;
	/* Set whether the frame has a hover state. Note that this should only be true in the `editor` view */
	isHoverable?: boolean;
	/* Set whether the height is fixed or auto (according to content) */
	isFluidHeight?: boolean;
	testId?: string;
	className?: string;
	inheritDimensions?: boolean;
}

export const Frame = (
	props: FrameProps = {
		isSelected: false,
		isHoverable: false,
		isFluidHeight: false,
	},
) => (props.compact ? <CompactFrame {...props} /> : <ExpandedFrame {...props} />);

const sharedBaseFrameStyles = css({
	width: '100%',
	display: 'flex',
});

const sharedFrameStyles = css({
	maxWidth: '760px',
	backgroundColor: token('elevation.surface.raised', 'white'),
});

const expandedFrameHoverStyles = css({
	'&:hover': {
		// TODO: https://product-fabric.atlassian.net/browse/DSP-4064
		backgroundColor: token('color.background.neutral.subtle.hovered', N20A),
		cursor: 'pointer',
	},
});

const expandedFrameFluidHeightTrueStyles = css({
	minHeight: 0,
});

const expandedFrameFluidHeightFalseStyles = css({
	minHeight: '120px',
});

const expandedFrameSelectedStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('border.radius.100', '3px'),
	borderColor: token('color.border.selected', B200),
	borderStyle: 'solid',
	borderWidth: '2px',
});

const expandedFrameNotSelectedStyles = css({
	borderRadius: '1.5px',
	borderColor: 'transparent',
	borderStyle: 'solid',
	borderWidth: '2px',
});

const expandedFrameStyles = css({
	justifyContent: 'space-between',
	overflow: 'hidden',
	boxShadow: token('elevation.shadow.raised', `0 1px 1px ${N50A}, 0 0 1px 1px ${N40A}`),
});

export const ExpandedFrame = ({
	children,
	isSelected,
	isHoverable,
	testId,
	className,
	isFluidHeight,
}: FrameProps) => {
	return (
		<div
			css={[
				sharedBaseFrameStyles,
				sharedFrameStyles,
				isHoverable && expandedFrameHoverStyles,
				isFluidHeight ? expandedFrameFluidHeightTrueStyles : expandedFrameFluidHeightFalseStyles,
				isSelected ? expandedFrameSelectedStyles : expandedFrameNotSelectedStyles,
				expandedFrameStyles,
			]}
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			data-trello-do-not-use-override={testId}
		>
			{children}
		</div>
	);
};

const compactFrameHoverStyles = css({
	'&:hover': {
		backgroundColor: token('color.background.neutral.hovered', N30A),
	},
});

const compactFrameInheritDimensionsTrueStyles = css({
	height: '100%',
});

const compactFrameInheritDimensionsFalseStyles = css({
	height: '40px',
});

const compactFrameAlignStyles = css({
	justifyContent: 'center',
	alignItems: 'center',
	backgroundColor: token('color.background.neutral', N20A),
});

const compactFrameStyles = css({
	width: '100%',
	padding: '0',
});

const compactFrameNotSelectedStyles = css({
	borderRadius: '1.5px',
});

export const CompactFrame = ({
	children,
	isHoverable,
	isSelected,
	testId,
	className,
	inheritDimensions,
}: FrameProps) => {
	return (
		<div
			css={[
				sharedBaseFrameStyles,
				sharedFrameStyles,
				isHoverable && compactFrameHoverStyles,
				isSelected && expandedFrameSelectedStyles,
				!isSelected && compactFrameNotSelectedStyles,
				compactFrameAlignStyles,
				inheritDimensions
					? compactFrameInheritDimensionsTrueStyles
					: compactFrameInheritDimensionsFalseStyles,
				compactFrameStyles,
			]}
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
		>
			{children}
		</div>
	);
};
