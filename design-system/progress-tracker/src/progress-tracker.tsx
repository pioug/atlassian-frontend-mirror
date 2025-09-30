/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import Link from './internal/link';
import Stage from './internal/stage';
import type { LinkComponentProps, ProgressTrackerStageRenderProp, Spacing, Stages } from './types';

const containerStyles = css({
	display: 'grid',
	width: '100%',
	margin: '0 auto',
	gap: `var(--ds--pt--sp)`,
	listStyleType: 'none',
	paddingBlockEnd: token('space.0', '0px'),
	paddingBlockStart: token('space.0', '0px'),
	paddingInlineEnd: token('space.0', '0px'),
	paddingInlineStart: token('space.0', '0px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/design-system/no-nested-styles -- Ignored via go/DSP-18766
	'&&': {
		marginBlockStart: token('space.500', '40px'),
	},
});

const spacingOptions = {
	comfortable: token('space.500', '40px'),
	cozy: token('space.200', '16px'),
	// @deprecated left for backwards compatibility
	cosy: token('space.200', '16px'),
	compact: token('space.050', '4px'),
};

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
	 * @deprecated
	 *
	 * Render prop to specify custom implementations of components.
	 *
	 * Note this is deprecated and will be removed in a future version.
	 * Links inside progress tracker can be configured using [App Provider](https://atlassian.design/components/app-provider) instead.
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
const ProgressTracker = ({
	items = [],
	spacing = 'cozy',
	render = {
		link: ({ item }: LinkComponentProps) => (
			// Anchor content is coming from another location
			// eslint-disable-next-line @atlassian/a11y/anchor-has-content
			<Link {...item} />
		),
	},
	animated = true,
	testId,
	label = 'Progress',
}: ProgressTrackerProps) => {
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
		const transitionEasing = progressChanges > 1 ? 'linear' : 'cubic-bezier(0.15,1,0.3,1)';
		if (animated) {
			transitionSpeed = progressChanges > 1 ? 50 : 300;
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
		['--ds--pt--sp']: spacingOptions[spacing],
		maxWidth: 8 * 10 * items.length * 2,
	};

	return (
		<ol data-testid={testId} style={listInlineStyles} css={containerStyles} aria-label={label}>
			{progressItems}
		</ol>
	);
};

export default ProgressTracker;
