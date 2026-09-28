import { BatchAttrsStep } from '@atlaskit/adf-schema/steps/batch-attrs-step';
import { SetAttrsStep } from '@atlaskit/adf-schema/steps/set-attrs';
import {
	AddMarkStep,
	AddNodeMarkStep,
	AttrStep,
	DocAttrStep,
	RemoveMarkStep,
	RemoveNodeMarkStep,
} from '@atlaskit/editor-prosemirror/transform';
import type { Step } from '@atlaskit/editor-prosemirror/transform-override';

function groupBy<T>(array: T[], keyGetter: (item: T) => string): Record<string, T[]> {
	// Check group by exists, and that it's a function. If so, use the native browser code
	if ('groupBy' in Object && typeof Object.groupBy === 'function') {
		return Object.groupBy(array, keyGetter);
	}

	// Fallback to custom implementation
	const map: Record<string, T[]> = {};
	array.forEach((item) => {
		const key = keyGetter(item);
		if (!map[key]) {
			map[key] = [];
		}
		map[key].push(item);
	});
	return map;
}

export type SanitizedStep = {
	attr?: string;
	markType?: string;
	stepType: string;
};

/**
 * Sanitizes a given ProseMirror step by extracting its type and non-UCG relevant attributes.
 *
 * @param {Step} step - The ProseMirror step to be sanitized.
 * @returns {SanitizedStep} - The sanitized step with only necessary information.
 *
 * @example
 * ```
 * const step = new AttrStep(10, 'colwidth', [123, 451] );
 * const sanitized = sanitizeStep(step);
 *
 * // Output: { stepType: 'attr', attr: 'example' }
 * ```
 */
export const sanitizeStep = (step: Step): SanitizedStep => {
	const serializedStep = step.toJSON();
	const sanitizedStep: SanitizedStep = {
		stepType: serializedStep.stepType,
	};

	if (step instanceof AttrStep || step instanceof DocAttrStep) {
		sanitizedStep.attr = step.attr;
	} else if (step instanceof SetAttrsStep) {
		// Combines all attrs keys separated by _ to one single string
		sanitizedStep.attr = Object.keys(step.attrs).sort().join('_');
	} else if (
		step instanceof AddMarkStep ||
		step instanceof RemoveMarkStep ||
		step instanceof RemoveNodeMarkStep ||
		step instanceof AddNodeMarkStep
	) {
		sanitizedStep.markType = step.mark.type.name;
	} else if (step instanceof BatchAttrsStep) {
		const batched = step.data.map(
			({ nodeType, attrs }) => `${nodeType}_${Object.keys(attrs).sort().join('_')}`,
		);
		sanitizedStep.attr = batched.sort().join('_');
	}

	return sanitizedStep;
};

/**
 * Groups sanitized steps by their type and counts their occurrences.
 *
 * @param {SanitizedStep[]} sanitizedSteps - An array of sanitized steps.
 * @returns {Record<string, number>} - An object where keys are step types and values are their counts.
 *
 * @example
 * ```
 * const input = [
 *   { stepType: 'attr', attr: 'colwidth' },
 *   { stepType: 'mark', markType: 'bold' },
 *   { stepType: 'attr', attr: 'colwidth' }
 * ];
 *
 * const grouped = groupSteps(input);
 * // Output: { 'attr_example': 2, 'mark_bold': 1 }
 * ```
 */
export const groupSteps = (sanitizedSteps: SanitizedStep[]): Record<string, number> => {
	const grouped = groupBy(sanitizedSteps, (e) => Object.values(e).join('_'));

	return Object.entries(grouped).reduce(
		(acc, [key, value]) => {
			acc[key] = Array.isArray(value) ? value.length : 0;
			return acc;
		},
		{} as Record<string, number>,
	);
};
