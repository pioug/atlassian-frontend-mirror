import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';

import { editorExperiment } from '../editor-experiment';
import { setupEditorExperiments } from '../setup';

const mockCheckGate = jest.spyOn(FeatureGates, 'checkGate');
const mockInitializeCompleted = jest.spyOn(FeatureGates, 'initializeCompleted');
const mockGetExperimentValue = jest.spyOn(FeatureGates, 'getExperimentValue');

const OTHER_APPS_KILL_SWITCH = 'platform_editor_controls_other_apps_ks';

const isVariant1 = () => editorExperiment('platform_editor_controls', 'variant1');
const isControl = () => editorExperiment('platform_editor_controls', 'control');

describe('platform_editor_controls fallback', () => {
	beforeEach(() => {
		mockInitializeCompleted.mockReturnValue(true);
		mockGetExperimentValue.mockReturnValue(false);
	});

	afterEach(() => {
		// @ts-ignore - reset to "no product"
		setupEditorExperiments(undefined, {});
		mockCheckGate.mockReset();
		mockInitializeCompleted.mockReset();
		mockGetExperimentValue.mockReset();
	});

	describe.each(['confluence', 'jira'] as const)('in %s', (product) => {
		test('always returns variant1 without reading the kill switch or the experiment', () => {
			setupEditorExperiments(product);
			mockCheckGate.mockReturnValue(true);

			expect(isVariant1()).toBe(true);
			expect(isControl()).toBe(false);
			expect(mockCheckGate).not.toHaveBeenCalled();
			expect(mockGetExperimentValue).not.toHaveBeenCalledWith(
				expect.stringMatching(/^platform_editor_controls/u),
				expect.anything(),
				expect.anything(),
				expect.anything(),
			);
		});
	});

	describe.each([
		['no product', undefined],
		['bitbucket', 'bitbucket'],
	] as const)('with %s', (_label, product) => {
		beforeEach(() => {
			// @ts-ignore - undefined simulates a product that never set up editor experiments
			setupEditorExperiments(product, {});
		});

		test('returns variant1 when the kill switch is off (default)', () => {
			mockCheckGate.mockReturnValue(false);

			expect(isVariant1()).toBe(true);
			expect(isControl()).toBe(false);
			expect(mockCheckGate).toHaveBeenCalledWith(OTHER_APPS_KILL_SWITCH, {
				fireGateExposure: true,
			});
		});

		test('returns control when the kill switch is on', () => {
			mockCheckGate.mockReturnValue(true);

			expect(isVariant1()).toBe(false);
			expect(isControl()).toBe(true);
		});

		test('returns the default (control) without reading the kill switch when the client is not initialised', () => {
			mockInitializeCompleted.mockReturnValue(false);
			mockCheckGate.mockReturnValue(false);

			expect(isVariant1()).toBe(false);
			expect(isControl()).toBe(true);
			expect(mockCheckGate).not.toHaveBeenCalled();
		});
	});

	test('the test product keeps the default value', () => {
		setupEditorExperiments('test', {}, {}, { disableTestOverrides: true });
		mockCheckGate.mockReturnValue(true);

		expect(isControl()).toBe(true);
		expect(mockCheckGate).not.toHaveBeenCalled();
	});

	test('test overrides take precedence over the fallback', () => {
		setupEditorExperiments('confluence', { platform_editor_controls: 'control' });

		expect(isControl()).toBe(true);
		expect(isVariant1()).toBe(false);
	});
});
