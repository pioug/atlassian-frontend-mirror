// This is loosely based on the `ffTest` util from `@atlassian/feature-flags-test-utils` package.

import { type EditorExperimentOverrides, setupEditorExperiments } from './experiments';
import { type EditorExperimentsConfig, editorExperimentsConfig } from './experiments-config';

/**
 * This is a utility function for testing editor experiments.
 *
 * @example Boolean experiment
 * ```ts
 * eeTest('example-boolean', {
 *   true: () => {
 * 	   expect(editorExperiment('example-boolean', true)).toBe(true);
 * 		 expect(editorExperiment('example-boolean', false)).toBe(false);
 *   },
 *   false: () => {
 *	   expect(editorExperiment('example-boolean', false)).toBe(true);
 *     expect(editorExperiment('example-boolean', true)).toBe(false);
 *   },
 * })
 * ```
 *
 * @example Multivariate experiment
 * ```ts
 * eeTest('example-multivariate', {
 *   one: () => {
 * 	   expect(editorExperiment('example-multivariate', 'one')).toBe(true);
 * 		 expect(editorExperiment('example-multivariate', 'two')).toBe(false);
 *   },
 *   two: () => {
 * 	   expect(editorExperiment('example-multivariate', 'two')).toBe(true);
 * 		 expect(editorExperiment('example-multivariate', 'one')).toBe(false);
 *   },
 *   three: () => {
 * 	   expect(editorExperiment('example-multivariate', 'three')).toBe(true);
 * 		 expect(editorExperiment('example-multivariate', 'one')).toBe(false);
 *   },
 * })
 * ```
 */
export function eeTest<ExperimentName extends keyof EditorExperimentsConfig>(
	experimentName: ExperimentName,
	cases: EditorExperimentsConfig[ExperimentName] extends string
		? Record<EditorExperimentsConfig[ExperimentName], () => void | Promise<void>>
		: { true: () => void | Promise<void>; false: () => void | Promise<void> },
	otherExperiments?: EditorExperimentOverrides,
) {
	setupEditorExperiments('test', {});

	describe(`eeTest: ${experimentName}`, () => {
		afterEach(() => {
			setupEditorExperiments('test', otherExperiments ?? {});
		});

		const isBooleanExperiment =
			typeof editorExperimentsConfig[experimentName].defaultValue === 'boolean';

		if (isBooleanExperiment && Object.keys(cases).length !== 2) {
			throw new Error(
				`Expected exactly 2 cases for boolean experiment ${experimentName}, got ${Object.keys(cases).length}`,
			);
		}

		test.each(Object.keys(cases))(`${experimentName}: %s`, async (value) => {
			const testCaseKey = value as keyof typeof cases;

			// For boolean experiments, we need to convert the 'on' and 'off' cases to boolean `true` and `false` values.
			const convertedValue = isBooleanExperiment
				? testCaseKey === 'true'
					? true
					: false
				: testCaseKey;

			setupEditorExperiments('test', { [experimentName]: convertedValue });

			const testCase = cases[testCaseKey];

			// @ts-ignore
			await Promise.resolve(testCase());
		});
	});
}
