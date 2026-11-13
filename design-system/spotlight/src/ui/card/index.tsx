/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode, useContext, useEffect, useRef } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { SpotlightContext } from '../../controllers/context';
import type { Placement } from '../../types';
import { getResolvedPositionArea } from '../../utils/get-resolved-position-area';
import { Caret } from './caret';

export interface SpotlightCardProps {
	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;

	/**
	 * The position in relation to the target the content should be shown at. Overrides `PopoverContent.placement`
	 */
	placement?: Placement;

	/**
	 * Elements to be rendered inside the `SpotlightCard`.
	 */
	children?: ReactNode;
}

const styles = cssMap({
	root: {
		position: 'relative',
		width: 'fit-content',
	},
	card: {
		width: '295px',
		borderRadius: token('radius.large'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.150'),
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		boxShadow: token('elevation.shadow.overflow'),
	},
	'start span-start': { paddingBlockEnd: token('space.075') },
	'block-start': { paddingBlockEnd: token('space.075') },
	'start span-end': { paddingBlockEnd: token('space.075') },
	'end span-start': { paddingBlockStart: token('space.075') },
	'block-end': { paddingBlockStart: token('space.075') },
	'end span-end': { paddingBlockStart: token('space.075') },
	'inline-start': { paddingInlineEnd: token('space.075') },
	'inline-end': { paddingInlineStart: token('space.075') },
	'span-start end': { paddingInlineStart: token('space.075') },
	'span-end end': { paddingInlineStart: token('space.075') },
	'span-start start': { paddingInlineEnd: token('space.075') },
	'span-end start': { paddingInlineEnd: token('space.075') },
});

/**
 * __Spotlight__
 *
 * The base UI card that wraps composable spotlight components.
 */
export const SpotlightCard: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SpotlightCardProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, SpotlightCardProps>(
	({ children, placement, testId }: SpotlightCardProps, ref) => {
		const { card, popoverContent } = useContext(SpotlightContext);
		const cardRef = useRef<HTMLDivElement>(null);
		const positionArea = getResolvedPositionArea(
			placement || card.placement,
			popoverContent.positionArea,
		);

		useEffect(() => {
			card.setRef(cardRef);
		}, [card]);

		const content = (
			<div css={[styles.root, styles[positionArea]]} data-testid={testId} ref={ref}>
				<Caret placement={placement} />
				<Box ref={cardRef} backgroundColor="color.background.neutral.bold" xcss={styles.card}>
					{children}
				</Box>
			</div>
		);

		if (fg('platform-dst-motion-uplift-spotlight')) {
			const Motion = card.motion;
			if (Motion) {
				return <Motion>{content}</Motion>;
			}
		}

		return content;
	},
);
