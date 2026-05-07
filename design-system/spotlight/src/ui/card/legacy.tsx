/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode, useContext, useEffect, useRef } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { SpotlightContext } from '../../controllers/context';
import type { Placement } from '../../types';

import { Caret } from './caret';

const styles = cssMap({
	root: {
		width: 'fit-content',
	},
	container: {
		position: 'relative',
	},
	card: {
		position: 'absolute',
		width: '295px',
		borderRadius: token('radius.large'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.150'),
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.100'),
		boxShadow: token('elevation.shadow.overflow'),
	},
});

const placementStyles = cssMap({
	'top-start': {
		insetBlockEnd: token('space.075'),
		insetInlineEnd: token('space.negative.250'),
	},
	'top-center': {
		insetBlockEnd: token('space.075'),
		/**
		 * To center the card in relation to the caret, we need to pull it to the left
		 * by half the card with (295px) and offset by half the caret width (15px). So:
		 * (295 / 2) - (15 / 2) = 140
		 */
		// @ts-expect-error See comment
		insetInlineStart: '-140px',
	},
	'top-end': {
		insetBlockEnd: token('space.075'),
		insetInlineStart: token('space.negative.250'),
	},
	'right-start': {
		insetInlineStart: token('space.075'),
		insetBlockEnd: token('space.negative.200'),
	},
	'right-end': {
		insetInlineStart: token('space.075'),
		insetBlockStart: token('space.negative.200'),
	},
	'bottom-start': {
		insetBlockStart: token('space.075'),
		insetInlineEnd: token('space.negative.250'),
	},
	'bottom-center': {
		insetBlockStart: token('space.075'),
		/**
		 * To center the card in relation to the caret, we need to pull it to the left
		 * by half the card with (295px) and offset by half the caret width (15px). So:
		 * (295 / 2) - (15 / 2) = 140
		 */
		// @ts-expect-error See comment
		insetInlineStart: '-140px',
	},
	'bottom-end': {
		insetBlockStart: token('space.075'),
		insetInlineStart: token('space.negative.250'),
	},
	'left-start': {
		insetInlineEnd: token('space.075'),
		insetBlockEnd: token('space.negative.200'),
	},
	'left-end': {
		insetInlineEnd: token('space.075'),
		insetBlockStart: token('space.negative.200'),
	},
});

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

/**
 * __Spotlight__
 *
 * The base UI card that wraps composable spotlight components.
 *
 */
export const SpotlightCard: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<SpotlightCardProps> & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, SpotlightCardProps>(
	({ children, placement, testId }: SpotlightCardProps, ref) => {
		const { card } = useContext(SpotlightContext);
		const cardRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			card.setRef(cardRef);
		}, [card]);

		const content = fg('platform_spotlight_card_fit_content_anchor') ? (
			<div css={styles.root} data-testid={testId} ref={ref}>
				<div css={styles.container}>
					<Caret placement={placement || card.placement} />
					<Box
						ref={cardRef}
						backgroundColor="color.background.neutral.bold"
						xcss={cx(styles.card, placementStyles[placement || card.placement])}
					>
						{children}
					</Box>
				</div>
			</div>
		) : (
			<div css={styles.container} data-testid={testId} ref={ref}>
				<Caret placement={placement || card.placement} />
				<Box
					ref={cardRef}
					backgroundColor="color.background.neutral.bold"
					xcss={cx(styles.card, placementStyles[placement || card.placement])}
				>
					{children}
				</Box>
			</div>
		);

		if (fg('platform-dst-motion-uplift')) {
			const Motion = card.motion;
			if (Motion) {
				return <Motion>{content}</Motion>;
			} else {
				return content;
			}
		}

		return content;
	},
);
