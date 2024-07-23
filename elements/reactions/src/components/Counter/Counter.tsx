/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useMemo, useRef } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import { SlideIn, ExitingPersistence, mediumDurationMs } from '@atlaskit/motion';
// eslint-disable-next-line @atlaskit/design-system/no-banned-imports

import { formatLargeNumber } from '../../shared/utils';

import { containerStyle, counterLabelStyle, countStyle, highlightStyle } from './styles';

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
	 * Duration in ms of how long the motion will take (defaults to "mediumDurationMs" from '@atlaskit/motion')
	 */
	animationDuration?: number;
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
	animationDuration = mediumDurationMs,
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
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={countStyle}
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
								css={[
									// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
									containerStyle,
									// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
									css({
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
										position: direction === 'exiting' ? 'absolute' : undefined,
									}),
								]}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={motion.className}
								data-testid={RENDER_COUNTER_TESTID}
							>
								<span
									data-testid={RENDER_LABEL_TESTID}
									// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
									css={highlight ? [counterLabelStyle, highlightStyle] : counterLabelStyle}
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
