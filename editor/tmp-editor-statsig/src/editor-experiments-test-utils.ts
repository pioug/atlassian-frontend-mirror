/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

// This is loosely based on the `ffTest` util from `@atlassian/feature-flags-test-utils` package.

import { type EditorExperimentOverrides, setupEditorExperiments } from './setup';
import { type EditorExperimentsConfig, editorExperimentsConfig } from './experiments-config';

type DescribeBody = Parameters<typeof describe>[1];

/**
 * This is a utility function for testing editor experiments.
 *
 * @example Boolean experiment
 * ```ts
 * eeTest('example-boolean', {
 *   true: () => {
 *     expect(editorExperiment('example-boolean', true)).toBe(true);
 *     expect(editorExperiment('example-boolean', false)).toBe(false);
 *   },
 *   false: () => {
 *     expect(editorExperiment('example-boolean', false)).toBe(true);
 *     expect(editorExperiment('example-boolean', true)).toBe(false);
 *   },
 * })
 * ```
 *
 * @example Multivariate experiment
 * ```ts
 * eeTest('example-multivariate', {
 *   one: () => {
 *     expect(editorExperiment('example-multivariate', 'one')).toBe(true);
 *     expect(editorExperiment('example-multivariate', 'two')).toBe(false);
 *   },
 *   two: () => {
 *     expect(editorExperiment('example-multivariate', 'two')).toBe(true);
 *     expect(editorExperiment('example-multivariate', 'one')).toBe(false);
 *   },
 *   three: () => {
 *     expect(editorExperiment('example-multivariate', 'three')).toBe(true);
 *     expect(editorExperiment('example-multivariate', 'one')).toBe(false);
 *   },
 * })
 * ```
 *
 * API based on Legacy ffTest API
 * - https://hello.atlassian.net/wiki/spaces/AF/pages/2569505829/Task+Testing+your+feature+flag+in+platform+and+product#Legacy-API-lEGACY
 */
function eeTest<ExperimentName extends keyof EditorExperimentsConfig>(
	experimentName: ExperimentName,
	cases: EditorExperimentsConfig[ExperimentName]['defaultValue'] extends string
		? Record<EditorExperimentsConfig[ExperimentName]['defaultValue'], DescribeBody>
		: { false: DescribeBody; true: DescribeBody },
	otherExperiments?: EditorExperimentOverrides,
) {
	setupEditorExperiments('test', {});

	describe(`eeTest: ${experimentName}`, () => {
		afterEach(() => {
			setupEditorExperiments('test', {});
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

			setupEditorExperiments('test', {
				[experimentName]: convertedValue as boolean | string,
				...otherExperiments,
			});

			const testCase = cases[testCaseKey];

			// @ts-ignore
			await Promise.resolve(testCase());
		});
	});
}

/**
 * eeTest.describe() Wrapper utility for describe() that runs a test with a editor experiment overides.
 *
 * @example
 * ```ts
 * eeTest.describe('exp-name', 'description of test').variant(true, () => {
 *   it('should do the thing', () => {
 *     expect(editorExperiment('example-boolean', true)).toBe(true);
 *   });
 * })
 * ```
 *
 * @example
 * ```ts
 * eeTest.describe('exp-name', 'description of test').each(() => {
 *   it('should do the thing', () => {
 *     expect(editorExperiment('example-boolean', true)).toBe(true);
 *   });
 * })
 * ```
 *
 * API based on next gen ffTest API
 * - https://hello.atlassian.net/wiki/spaces/AF/pages/2569505829/Task+Testing+your+feature+flag+in+platform+and+product#Next-Generation-API-%E2%9C%A8
 */
eeTest.describe = function eeTestDescribe<ExperimentName extends keyof EditorExperimentsConfig>(
	experimentName: ExperimentName,
	describeName: string,
): {
	each: (describeBody: DescribeBody) => void;
	variant: (
		value: EditorExperimentsConfig[ExperimentName]['defaultValue'],
		describeBody: DescribeBody,
	) => void;
} {
	function eeTest(
		value: EditorExperimentsConfig[ExperimentName]['defaultValue'],
		describeBody: Parameters<typeof describe>[1] = () => {},
	) {
		describe(`${describeName} [${value}]`, () => {
			beforeEach(() => {
				setupEditorExperiments('test', { [experimentName]: value });
			});
			afterEach(() => {
				setupEditorExperiments('test', {});
			});
			describeBody();
		});

		setupEditorExperiments('test', {});
	}

	function variant(
		value: EditorExperimentsConfig[ExperimentName]['defaultValue'],
		describeBody: DescribeBody,
	) {
		eeTest(value, describeBody);
	}

	function each(describeBody: DescribeBody) {
		const possibleValues: EditorExperimentsConfig[ExperimentName]['defaultValue'][] =
			// @ts-ignore
			editorExperimentsConfig[experimentName].typeGuard.values;
		if (possibleValues) {
			for (const value of possibleValues) {
				eeTest(value, describeBody);
			}
		} else {
			// if there are no possible values, it's a boolean experiment
			eeTest(true, describeBody);
			eeTest(false, describeBody);
		}
	}

	return {
		variant,
		each,
	};
};

export { eeTest };
