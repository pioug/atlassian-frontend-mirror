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
import type { Placement } from '../../types';

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
	caret: {
		position: 'absolute',
	},
});

const rootPlacementStyles = cssMap({
	'top-start': { paddingBlockEnd: token('space.075') },
	'top-center': { paddingBlockEnd: token('space.075') },
	'top-end': { paddingBlockEnd: token('space.075') },
	'bottom-start': { paddingBlockStart: token('space.075') },
	'bottom-center': { paddingBlockStart: token('space.075') },
	'bottom-end': { paddingBlockStart: token('space.075') },
	'right-start': { paddingInlineStart: token('space.075') },
	'right-end': { paddingInlineStart: token('space.075') },
	'left-start': { paddingInlineEnd: token('space.075') },
	'left-end': { paddingInlineEnd: token('space.075') },
});

const caretPlacementStyles = cssMap({
	'top-start': {
		insetBlockEnd: 0,
		insetInlineEnd: token('space.250'),
	},
	'top-center': {
		insetBlockEnd: 0,
		insetInlineStart: '50%',
		transform: 'translateX(-50%)',
	},
	'top-end': {
		insetBlockEnd: 0,
		insetInlineStart: token('space.250'),
	},
	'bottom-start': {
		insetBlockStart: 0,
		insetInlineEnd: token('space.250'),
	},
	'bottom-center': {
		insetBlockStart: 0,
		insetInlineStart: '50%',
		transform: 'translateX(-50%)',
	},
	'bottom-end': {
		insetBlockStart: 0,
		insetInlineStart: token('space.250'),
	},
	'right-start': {
		insetInlineStart: 0,
		insetBlockEnd: token('space.200'),
	},
	'right-end': {
		insetInlineStart: 0,
		insetBlockStart: token('space.200'),
	},
	'left-start': {
		insetInlineEnd: 0,
		insetBlockEnd: token('space.200'),
	},
	'left-end': {
		insetInlineEnd: 0,
		insetBlockStart: token('space.200'),
	},
});

const getPlacement = (placement: Placement | undefined, contextPlacement: Placement): Placement =>
	placement || contextPlacement;

/**
 * __Spotlight__
 *
 * The base UI card that wraps composable spotlight components.
 */
export const SpotlightCard: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SpotlightCardProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, SpotlightCardProps>(
	({ children, placement, testId }: SpotlightCardProps, ref) => {
		const { card } = useContext(SpotlightContext);
		const cardRef = useRef<HTMLDivElement>(null);
		const currentPlacement = getPlacement(placement, card.placement);

		useEffect(() => {
			card.setRef(cardRef);
		}, [card]);

		const content = (
			<div
				css={[styles.root, rootPlacementStyles[currentPlacement]]}
				data-testid={testId}
				ref={ref}
			>
				<div css={[styles.caret, caretPlacementStyles[currentPlacement]]}>
					<Caret placement={currentPlacement} />
				</div>
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
