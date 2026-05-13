/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useContext, useEffect, useRef } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { SpotlightContext } from '../../controllers/context';
import { getResolvedPositionArea } from '../../utils/get-resolved-position-area';

import { Caret } from './caret';
import type { SpotlightCardProps } from './legacy';

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
		const positionArea = getResolvedPositionArea(placement || card.placement, popoverContent.positionArea)

		useEffect(() => {
			card.setRef(cardRef);
		}, [card]);

		const content = (
			<div
				css={[styles.root, styles[positionArea]]}
				data-testid={testId}
				ref={ref}
			>
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
