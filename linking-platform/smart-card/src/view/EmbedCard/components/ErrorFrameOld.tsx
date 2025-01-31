/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { B200, N20A, N30A, N40A, N50A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { br, gs, mq } from '../../common/utils';

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

export const FrameOld = (
	props: FrameProps = {
		isSelected: false,
		isHoverable: false,
		isFluidHeight: false,
	},
) => (props.compact ? <CompactFrameOld {...props} /> : <ExpandedFrameOld {...props} />);

const sharedBaseFrameStyles = css({
	width: '100%',
	display: 'flex',
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
const sharedFrameStyles = {
	maxWidth: gs(95),
	backgroundColor: token('elevation.surface.raised', 'white'),
};

export const ExpandedFrameOld = ({
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
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				mq({
					'&:hover': isHoverable
						? {
								// TODO: https://product-fabric.atlassian.net/browse/DSP-4064
								backgroundColor: token('color.background.neutral.subtle.hovered', N20A),
								cursor: 'pointer',
							}
						: undefined,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					minHeight: isFluidHeight ? 0 : [gs(21), gs(15)],
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					borderRadius: isSelected ? br() : br(0.5),
					border: `2px solid ${isSelected ? token('color.border.selected', B200) : 'transparent'}`,
					justifyContent: 'space-between',
					overflow: 'hidden',
					boxShadow: token('elevation.shadow.raised', `0 1px 1px ${N50A}, 0 0 1px 1px ${N40A}`),
				}),
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

export const CompactFrameOld = ({
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
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				mq({
					'&:hover': isHoverable
						? {
								backgroundColor: token('color.background.neutral.hovered', N30A),
							}
						: undefined,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					borderRadius: isSelected ? br() : br(0.5),
					border: isSelected ? `2px solid ${token('color.border.selected', B200)}` : '',
					justifyContent: 'center',
					alignItems: 'center',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					height: inheritDimensions ? '100%' : gs(5),
					backgroundColor: token('color.background.neutral', N20A),
					width: ['calc(100% - 16px)', '100%'],
					// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					padding: [`0px ${gs(1)}`, '0'],
				}),
			]}
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
		>
			{children}
		</div>
	);
};
