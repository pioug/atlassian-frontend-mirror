// packages/react-ufo/atlaskit/src/create-payload/utils/get-vc-metrics.test.ts

import { fg } from '@atlaskit/platform-feature-flags';

import type { InteractionMetrics } from '../../common';
import { getConfig, getMostRecentVCRevision, isVCRevisionEnabled } from '../../config';
import { getVCObserver } from '../../vc';

import getInteractionStatus from './get-interaction-status';
import getPageVisibilityUpToTTAI from './get-page-visibility-up-to-ttai';
import getSSRDoneTimeValue from './get-ssr-done-time-value';
import getVCMetrics from './get-vc-metrics';

// Mock dependencies
jest.mock('../../config');
jest.mock('../../vc');
jest.mock('../../interaction-metrics');
jest.mock('@atlaskit/platform-feature-flags');
jest.mock('./get-interaction-status');
jest.mock('./get-page-visibility-up-to-ttai');
jest.mock('./get-ssr-done-time-value');

describe('getVCMetrics', () => {
	// Setup common mocks
	const mockGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
	const mockGetVCObserver = getVCObserver as jest.MockedFunction<typeof getVCObserver>;
	const mockFg = fg as jest.MockedFunction<typeof fg>;

	const enabledFg = new Set<string>();

	beforeEach(() => {
		jest.clearAllMocks();

		// Default mock implementations
		mockGetConfig.mockReturnValue({
			vc: {
				enabled: true,
				enabledVCRevisions: ['fy25.01', 'fy25.02'],
			},
			experimentalInteractionMetrics: { enabled: false },
		} as unknown as ReturnType<typeof getConfig>);

		mockGetVCObserver.mockReturnValue({
			getVCResult: jest.fn().mockResolvedValue({
				'ufo:vc:rev': [
					{
						clean: true,
						'metric:vc90': 100,
						revision: 'fy25.01',
					},
					{
						clean: true,
						'metric:vc90': 100,
						revision: 'fy25.02',
					},
				],
				'metrics:vc': { '90': 100 },
				'ufo:vc:clean': true,
			}),
			stop: jest.fn(),
		} as unknown as ReturnType<typeof getVCObserver>);

		(getInteractionStatus as jest.Mock).mockReturnValue({
			originalInteractionStatus: 'SUCCEEDED',
		});

		(getPageVisibilityUpToTTAI as jest.Mock).mockReturnValue('visible');

		mockFg.mockImplementation((flag: string) => enabledFg.has(flag));

		enabledFg.clear();
	});

	it('should return empty object if VC is not enabled', async () => {
		mockGetConfig.mockReturnValue({ product: 'test', region: 'unknown', vc: { enabled: false } });

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
		} as unknown as InteractionMetrics;

		const result = await getVCMetrics(interaction);
		expect(result).toEqual({});
	});

	it('should return empty object for unsupported interaction types', async () => {
		const interaction: InteractionMetrics = {
			type: 'hover',
			start: 0,
			end: 100,
			ufoName: 'test',
		} as unknown as InteractionMetrics;

		const result = await getVCMetrics(interaction);
		expect(result).toEqual({});
	});

	it('should process press interaction correctly when feature flag is enabled', async () => {
		enabledFg.add('platform_ufo_enable_vc_press_interactions');
		enabledFg.add('platform_ufo_enable_vc_observer_per_interaction');

		const mockGetMostRecentVCRevision = getMostRecentVCRevision as jest.MockedFunction<
			typeof getMostRecentVCRevision
		>;
		mockGetMostRecentVCRevision.mockReturnValue('fy25.02');

		const interaction: InteractionMetrics = {
			type: 'press',
			start: 0,
			end: 100,
			ufoName: 'test',
			apdex: [{ key: 'test-apdex', stopTime: 50 }],
		} as unknown as InteractionMetrics;

		const expectedVCResult = {
			'metrics:vc': { '90': 100 },
			'ufo:vc:clean': true,
			'metric:vc90': 100,
		};

		const result = await getVCMetrics(interaction);
		expect(result).toMatchObject(expectedVCResult);
	});

	it('should return empty object for press interaction when feature flag is disabled', async () => {
		// Feature flag is disabled by default in beforeEach

		const interaction: InteractionMetrics = {
			type: 'press',
			start: 0,
			end: 100,
			ufoName: 'test',
		} as unknown as InteractionMetrics;

		const result = await getVCMetrics(interaction);
		expect(result).toEqual({});
	});

	it('should process page_load interaction correctly', async () => {
		const mockGetMostRecentVCRevision = getMostRecentVCRevision as jest.MockedFunction<
			typeof getMostRecentVCRevision
		>;
		mockGetMostRecentVCRevision.mockReturnValue('fy25.02');

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
			apdex: [{ key: 'test-apdex', stopTime: 50 }],
		} as unknown as InteractionMetrics;

		const expectedVCResult = {
			'metrics:vc': { '90': 100 },
			'ufo:vc:clean': true,
			'metric:vc90': 100,
		};

		const result = await getVCMetrics(interaction);
		expect(result).toMatchObject(expectedVCResult);
	});

	it('should process page_load interaction correctly when fy25.01 is disabled', async () => {
		const mockGetMostRecentVCRevision = getMostRecentVCRevision as jest.MockedFunction<
			typeof getMostRecentVCRevision
		>;
		mockGetMostRecentVCRevision.mockReturnValue('fy25.02');

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
			apdex: [{ key: 'test-apdex', stopTime: 50 }],
		} as unknown as InteractionMetrics;

		const expectedVCResult = {
			'metrics:vc': { '90': 100 },
			'ufo:vc:clean': true,
			'metric:vc90': 100,
			'ufo:vc:rev': [
				{
					clean: true,
					'metric:vc90': 100,
					revision: 'fy25.01',
				},
				{
					clean: true,
					'metric:vc90': 100,
					revision: 'fy25.02',
				},
			],
		};

		const result = await getVCMetrics(interaction);
		expect(result).toEqual(expectedVCResult);
	});

	it('should handle SSR configuration for page_load', async () => {
		mockGetConfig.mockReturnValue({
			product: 'test',
			region: 'unknown',
			vc: { enabled: true, ssrWhitelist: ['test'] },
		});

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
		} as unknown as InteractionMetrics;

		await getVCMetrics(interaction);
		expect(getSSRDoneTimeValue).toHaveBeenCalled();
	});

	it.each(['FAILED', 'ABORTED'])('should handle %s interaction status', async (status) => {
		(getInteractionStatus as jest.Mock).mockReturnValue({
			originalInteractionStatus: status,
		});
		enabledFg.add('platform_ufo_no_vc_on_aborted');

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
		} as unknown as InteractionMetrics;

		const result = await getVCMetrics(interaction);
		expect(result).toEqual({});
	});

	it.each(['hidden', 'mixed'])('should handle %s page visibility', async (pageVisibility) => {
		(getPageVisibilityUpToTTAI as jest.Mock).mockReturnValue(pageVisibility);
		enabledFg.add('platform_ufo_no_vc_on_aborted');

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
		} as unknown as InteractionMetrics;

		const result = await getVCMetrics(interaction);
		expect(result).toEqual({});
	});

	it('should stop VC observer when experimental metrics are enabled', async () => {
		mockGetConfig.mockReturnValue({
			product: 'test',
			region: 'unknown',
			vc: { enabled: true },
			experimentalInteractionMetrics: { enabled: true },
		});

		const mockStop = jest.fn();
		mockGetVCObserver.mockReturnValue({
			getVCResult: jest.fn().mockResolvedValue({
				'metrics:vc': { '90': 100 },
				'ufo:vc:clean': true,
			}),
			stop: mockStop,
		} as unknown as ReturnType<typeof getVCObserver>);

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
		} as unknown as InteractionMetrics;

		await getVCMetrics(interaction);
		expect(mockStop).toHaveBeenCalled();
	});

	// New test to ensure coverage for the platform_ufo_vc_enable_revisions_by_experience flag
	it('should handle VC revisions by experience when the flag is enabled', async () => {
		enabledFg.add('platform_ufo_vc_enable_revisions_by_experience');

		const mockGetMostRecentVCRevision = getMostRecentVCRevision as jest.MockedFunction<
			typeof getMostRecentVCRevision
		>;
		mockGetMostRecentVCRevision.mockReturnValue('fy25.02');

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
		} as unknown as InteractionMetrics;

		const expectedVCResult = {
			'metrics:vc': { '90': 100 },
			'ufo:vc:clean': true,
			'metric:vc90': 100,
		};

		const result = await getVCMetrics(interaction);
		expect(result).toMatchObject(expectedVCResult);
	});

	// Ensure isVCRevisionEnabled is correctly tested for other scenarios
	it('should handle isVCRevisionEnabled correctly for fy25.01', async () => {
		const mockIsVCRevisionEnabled = isVCRevisionEnabled as jest.MockedFunction<
			typeof isVCRevisionEnabled
		>;
		mockIsVCRevisionEnabled.mockReturnValue(false);

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
		} as unknown as InteractionMetrics;

		const expectedVCResult = {
			'metrics:vc': { '90': 100 },
			'ufo:vc:clean': true,
			'metric:vc90': 100, // This should reflect the fallback to fy25.02
			'ufo:vc:rev': [
				{
					clean: true,
					'metric:vc90': 100,
					revision: 'fy25.01',
				},
				{
					clean: true,
					'metric:vc90': 100,
					revision: 'fy25.02',
				},
			],
		};

		const result = await getVCMetrics(interaction);
		expect(result).toEqual(expectedVCResult);
	});

	it('should correctly handle clean and non-clean revisions', async () => {
		mockGetVCObserver.mockReturnValue({
			getVCResult: jest.fn().mockResolvedValue({
				'ufo:vc:rev': [
					{
						clean: true,
						'metric:vc90': 90,
						revision: 'fy25.01',
					},
					{
						clean: true,
						'metric:vc90': 100,
						revision: 'fy25.02',
					},
				],
				'metrics:vc': { '90': 100 },
				'ufo:vc:clean': true,
			}),
			stop: jest.fn(),
		} as unknown as ReturnType<typeof getVCObserver>);

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
		} as unknown as InteractionMetrics;

		const expectedVCResult = {
			'metrics:vc': { '90': 100 },
			'ufo:vc:clean': true,
			'metric:vc90': 100, // The clean revision should be used
			'ufo:vc:rev': [
				{
					clean: true,
					'metric:vc90': 90,
					revision: 'fy25.01',
				},
				{
					clean: true,
					'metric:vc90': 100,
					revision: 'fy25.02',
				},
			],
		};

		const result = await getVCMetrics(interaction);
		expect(result).toEqual(expectedVCResult);
	});

	it('should not report VC metrics if interaction status is not succeeded and flag is set', async () => {
		(getInteractionStatus as jest.Mock).mockReturnValue({
			originalInteractionStatus: 'FAILED',
		});
		enabledFg.add('platform_ufo_no_vc_on_aborted');

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
		} as unknown as InteractionMetrics;

		const result = await getVCMetrics(interaction);
		expect(result).toEqual({});
	});

	it('should use most recent VC revision from the experience key', async () => {
		enabledFg.add('platform_ufo_vc_enable_revisions_by_experience');
		const mockGetMostRecentVCRevision = getMostRecentVCRevision as jest.MockedFunction<
			typeof getMostRecentVCRevision
		>;
		mockGetMostRecentVCRevision.mockReturnValue('fy25.02');

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
		} as unknown as InteractionMetrics;

		const expectedVCResult = {
			'metrics:vc': { '90': 100 },
			'ufo:vc:clean': true,
			'metric:vc90': 100, // Should match the most recent VC revision
			'ufo:vc:rev': [
				{
					clean: true,
					'metric:vc90': 100,
					revision: 'fy25.01',
				},
				{
					clean: true,
					'metric:vc90': 100,
					revision: 'fy25.02',
				},
			],
		};

		const result = await getVCMetrics(interaction);
		expect(result).toEqual(expectedVCResult);
	});
});
