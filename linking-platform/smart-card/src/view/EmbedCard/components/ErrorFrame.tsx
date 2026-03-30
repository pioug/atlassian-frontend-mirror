/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

export interface FrameProps {
	children?: React.ReactNode;
	className?: string;
	/* Set spacing and what elements are rendered. Compact is for loading and error views */
	compact?: boolean;
	inheritDimensions?: boolean;
	/* Set whether the height is fixed or auto (according to content) */
	isFluidHeight?: boolean;
	/* Set whether the frame has a hover state. Note that this should only be true in the `editor` view */
	isHoverable?: boolean;
	/* Set whether it is selected. NB: The card is only selectable in the `editor` view, and will be provided by the editor */
	isSelected?: boolean;
	testId?: string;
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
	backgroundColor: token('elevation.surface.raised'),
});

const expandedFrameHoverStyles = css({
	'&:hover': {
		// TODO: https://product-fabric.atlassian.net/browse/DSP-4064
		backgroundColor: token('color.background.neutral.subtle.hovered'),
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
	borderRadius: token('radius.small', '3px'),
	borderColor: token('color.border.selected'),
	borderStyle: 'solid',
	borderWidth: token('border.width.selected'),
});

const expandedFrameNotSelectedStyles = css({
	borderRadius: token('radius.xsmall'),
	borderColor: 'transparent',
	borderStyle: 'solid',
	borderWidth: token('border.width.selected'),
});

const expandedFrameStyles = css({
	justifyContent: 'space-between',
	overflow: 'hidden',
	boxShadow: token('elevation.shadow.raised'),
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
		backgroundColor: token('color.background.neutral.hovered'),
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
	backgroundColor: token('color.background.neutral'),
});

const compactFrameStyles = css({
	width: '100%',
	padding: '0',
});

const compactFrameNotSelectedStyles = css({
	borderRadius: token('radius.xsmall'),
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
