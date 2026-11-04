import { AnalyticsStep } from '@atlaskit/adf-schema/steps/analytics';
import { LocalOnlyStep } from '@atlaskit/editor-common/collab-local-only-step';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { Rebaseable } from '@atlaskit/prosemirror-collab';

/**
 * Filter out AnalyticsStep and local-only steps from the steps, so they are never sent or rebased.
 *
 * @param steps Rebaseable steps
 * @returns Rebaseable steps
 * @example
 */
export function filterAnalyticsSteps(steps: Rebaseable[]): Rebaseable[] {
	const filteredSteps = steps.reduce((acc, rebaseable) => {
		if (
			!(rebaseable.step instanceof AnalyticsStep) &&
			!(
				isExperimentEnabled('platform_editor_numbered_headings') &&
				rebaseable.step instanceof LocalOnlyStep
			)
		) {
			acc.push(new Rebaseable(rebaseable.step, rebaseable.inverted, rebaseable.origin));
		}
		return acc;
	}, [] as Rebaseable[]);
	return filteredSteps;
}
