/* eslint-disable @atlaskit/design-system/no-nested-styles */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { spacing as spacingOptions } from './constants';
import {
	ANIMATION_EASE_OUT,
	LINEAR_TRANSITION_SPEED,
	TRANSITION_SPEED,
	varSpacing,
} from './internal/constants';
import Link from './internal/link';
import Stage from './internal/stage';
import type { LinkComponentProps, ProgressTrackerStageRenderProp, Spacing, Stages } from './types';

const containerStyles = css({
	display: 'grid',
	width: '100%',
	margin: '0 auto',
	padding: token('space.0', '0px'),
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	gap: `var(${varSpacing})`,
	listStyleType: 'none',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&&': {
		marginBlockStart: token('space.500', '40px'),
	},
});

export interface ProgressTrackerProps {
	/**
	 * Ordered list of stage data.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	items: Stages;
	/**
	 * Sets the amount of spacing between the steps.
	 */
	spacing?: Spacing;
	/**
	 * Render prop to specify custom implementations of components.
	 */
	render?: ProgressTrackerStageRenderProp;
	/**
	 * Turns off transition animations if set to false.
	 */
	// eslint-disable-next-line
	animated?: boolean;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Use this to provide an aria-label for the overall progress tracker, so that people who use assistive technology get an overview of the tracker's purpose. For example, "Sign up progress".
	 */
	label?: string;
}

/**
 * __Progress tracker__
 *
 * A progress tracker displays the steps and progress through a journey.
 *
 * - [Examples](https://atlassian.design/components/progress-tracker/examples)
 * - [Code](https://atlassian.design/components/progress-tracker/code)
 * - [Usage](https://atlassian.design/components/progress-tracker/usage)
 */
const ProgressTracker: FC<ProgressTrackerProps> = ({
	items = [],
	spacing = 'cosy',
	render = {
		// Anchor content is coming from another location
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		link: ({ item }: LinkComponentProps) => <Link {...item} />,
	},
	animated = true,
	testId,
	label = 'Progress',
}) => {
	const prevItems = useRef<Stages>(items.map((stage) => ({ ...stage, percentageComplete: 0 })));

	const previousStages = items.map((stage) => {
		const oldStage = prevItems.current?.find((st) => st.id === stage.id);
		return !!oldStage ? oldStage : stage;
	});

	useEffect(() => {
		prevItems.current = items;
	}, [items]);

	const progressChanges = items.filter(
		(stage, index) => stage.percentageComplete !== previousStages[index].percentageComplete,
	).length;

	const totalStepsForward = items.filter(
		(stage, index) => stage.percentageComplete > previousStages[index].percentageComplete,
	).length;

	const totalStepsBack = items.filter(
		(stage, index) => stage.percentageComplete < previousStages[index].percentageComplete,
	).length;

	let stepsForward = totalStepsForward;
	let stepsBack = totalStepsBack;

	const progressItems = items.map((stage, index) => {
		let transitionSpeed = 0;
		let transitionDelay = 0;
		const transitionEasing = progressChanges > 1 ? 'linear' : ANIMATION_EASE_OUT;
		if (animated) {
			transitionSpeed = progressChanges > 1 ? LINEAR_TRANSITION_SPEED : TRANSITION_SPEED;
			if (stage.percentageComplete < previousStages[index].percentageComplete) {
				/**
				 * Load each transition sequentially in reverse.
				 */
				transitionDelay = (stepsBack - 1) * transitionSpeed;
				stepsBack -= 1;
			} else if (stage.percentageComplete > previousStages[index].percentageComplete) {
				/**
				 * Load each transition sequentially.
				 */
				transitionDelay = (totalStepsForward - stepsForward) * transitionSpeed;
				stepsForward -= 1;
			}
		}

		return (
			<Stage
				transitionSpeed={transitionSpeed}
				transitionDelay={transitionDelay}
				transitionEasing={transitionEasing}
				key={stage.id}
				item={stage}
				render={render}
			/>
		);
	});

	const listInlineStyles = {
		gridTemplateColumns: `repeat(${items.length}, 1fr)`,
		[varSpacing]: spacingOptions[spacing],
		maxWidth: 8 * 10 * items.length * 2,
	};

	return (
		<ul
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={listInlineStyles}
			css={containerStyles}
			aria-label={label}
		>
			{progressItems}
		</ul>
	);
};

export default ProgressTracker;
