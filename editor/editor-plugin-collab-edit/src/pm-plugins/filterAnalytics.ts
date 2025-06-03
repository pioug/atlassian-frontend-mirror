import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import { Rebaseable } from '@atlaskit/prosemirror-collab';

/**
 * Filter out AnalyticsStep from the steps.
 *
 * @param steps Rebaseable steps
 * @returns Rebaseable steps
 * @example
 */
export function filterAnalyticsSteps(steps: Rebaseable[]): Rebaseable[] {
	const filteredSteps = steps.reduce((acc, rebaseable) => {
		if (!(rebaseable.step instanceof AnalyticsStep)) {
			acc.push(new Rebaseable(rebaseable.step, rebaseable.inverted, rebaseable.origin));
		}
		return acc;
	}, [] as Rebaseable[]);
	return filteredSteps;
}
