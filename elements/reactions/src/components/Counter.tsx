/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useMemo, useRef } from 'react';
import { css, jsx } from '@compiled/react';
import { SlideIn, ExitingPersistence, type Durations } from '@atlaskit/motion';
import { formatLargeNumber } from '../shared/utils';

import { token } from '@atlaskit/tokens';
import { B400 } from '@atlaskit/theme/colors';

const containerStyle = css({
	display: 'flex',
	flexDirection: 'column',
});

const counterLabelStyle = css({
	fontVariantNumeric: 'tabular-nums',
});

const countStyle = css({
	font: token('font.body.small'),
	color: token('color.text.subtlest'),
	overflow: 'hidden',
	position: 'relative',
	paddingTop: token('space.050', '4px'),
	paddingRight: token('space.100', '8px'),
	paddingBottom: token('space.050', '4px'),
	paddingLeft: 0,
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
	lineHeight: '14px',
});

const highlightStyle = css({
	color: token('color.text.selected', B400),
});

const darkerFontStyle = css({
	color: token('color.text.subtle'),
});

const updatedStyles = css({
	marginTop: token('space.025'),
});

/**
 * Test id for component top level div
 */
export const RENDER_COMPONENT_WRAPPER = 'counter-wrapper';

/**
 * Test id for wrapper div of the counter inside the slider
 */
export const RENDER_COUNTER_TESTID = 'counter-container';

/**
 * Counter label value wrapper div
 */
export const RENDER_LABEL_TESTID = 'counter_label_wrapper';

export interface CounterProps {
	/**
	 * Count of emoji been selected
	 */
	value: number;
	/**
	 * Has the emoji been selected by given user (defaults to false)
	 */
	highlight?: boolean;
	/**
	 * Max threshold of selections to show before having a label (defaults to 1000)
	 */
	limit?: number;
	/**
	 * Label to show when the value surpasses the limit value (defaults to "1k+")
	 */
	overLimitLabel?: string;
	/**
	 * Optional wrapper class name
	 */
	className?: string;
	/**
	 * Duration of how long the motion will take (defaults to "medium" from '@atlaskit/motion')
	 */
	animationDuration?: Durations;
	/**
	 * Optional prop to use a darker text color for the counter
	 */
	useDarkerFont?: boolean;
	/**
	 * Optional prop to show updated styling for counter
	 */
	useUpdatedStyles?: boolean;
}

/**
 * Display reaction count next to the emoji button
 */
export const Counter = ({
	highlight = false,
	limit,
	overLimitLabel,
	className,
	value,
	animationDuration = 'medium',
	useDarkerFont,
	useUpdatedStyles,
}: CounterProps) => {
	const getLabel = (value: number) => {
		// Check if reached limit
		if (limit && overLimitLabel && value >= limit) {
			return overLimitLabel || '';
		} else if (value === 0) {
			return '';
		} else {
			return formatLargeNumber(value);
		}
	};
	const lastValue = useRef<number>();

	const label = getLabel(value);

	useEffect(() => {
		lastValue.current = value;
	}, [value]);

	const isIncreasing = useMemo(() => {
		return lastValue.current ? lastValue.current < value : false;
	}, [value]);

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
			data-testid={RENDER_COMPONENT_WRAPPER}
			css={[countStyle, useDarkerFont && darkerFontStyle, useUpdatedStyles && updatedStyles]}
		>
			<ExitingPersistence>
				<SlideIn
					enterFrom={isIncreasing ? 'top' : 'bottom'}
					exitTo={isIncreasing ? 'top' : 'bottom'}
					key={value}
					duration={animationDuration}
				>
					{(motion, direction) => {
						return (
							<div
								ref={motion.ref}
								css={containerStyle}
								style={{ position: direction === 'exiting' ? 'absolute' : undefined }}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={motion.className}
								data-testid={RENDER_COUNTER_TESTID}
							>
								<span
									data-testid={RENDER_LABEL_TESTID}
									css={[counterLabelStyle, highlight && highlightStyle]}
									key={value}
								>
									{label}
								</span>
							</div>
						);
					}}
				</SlideIn>
			</ExitingPersistence>
		</div>
	);
};
