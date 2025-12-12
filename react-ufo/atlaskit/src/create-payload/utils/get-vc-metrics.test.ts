// packages/react-ufo/atlaskit/src/create-payload/utils/get-vc-metrics.test.ts

import { fg } from '@atlaskit/platform-feature-flags';

import type { InteractionMetrics } from '../../common';
import { getConfig, getMostRecentVCRevision, isVCRevisionEnabled } from '../../config';
import type { VCObserverInterface } from '../../vc/types';

import getInteractionStatus from './get-interaction-status';
import getPageVisibilityUpToTTAI from './get-page-visibility-up-to-ttai';
import getSSRDoneTimeValue from './get-ssr-done-time-value';
import getVCMetrics from './get-vc-metrics';

// Mock dependencies
jest.mock('../../config');
jest.mock('../../interaction-metrics');
jest.mock('@atlaskit/platform-feature-flags');
jest.mock('./get-interaction-status');
jest.mock('./get-page-visibility-up-to-ttai');
jest.mock('./get-ssr-done-time-value');

// Helper function to create a mock VCObserverInterface
const createMockVCObserver = (): jest.Mocked<VCObserverInterface> => ({
	start: jest.fn(),
	stop: jest.fn(),
	getVCRawData: jest.fn().mockReturnValue(null),
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
	setSSRElement: jest.fn(),
	setReactRootRenderStart: jest.fn(),
	setReactRootRenderStop: jest.fn(),
	collectSSRPlaceholders: jest.fn(),
});

describe('getVCMetrics', () => {
	// Setup common mocks
	const mockGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;
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
			vcObserver: createMockVCObserver(),
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
			vcObserver: createMockVCObserver(),
		} as unknown as InteractionMetrics;

		const result = await getVCMetrics(interaction);
		expect(result).toEqual({});
	});

	it('should return empty object when no VC observer is available', async () => {
		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
			// No vcObserver provided
		} as unknown as InteractionMetrics;

		const result = await getVCMetrics(interaction);
		expect(result).toEqual({});
	});

	it('should process press interaction correctly', async () => {
		const mockGetMostRecentVCRevision = getMostRecentVCRevision as jest.MockedFunction<
			typeof getMostRecentVCRevision
		>;
		mockGetMostRecentVCRevision.mockReturnValue('fy25.02');

		const mockVCObserver = createMockVCObserver();
		const interaction: InteractionMetrics = {
			type: 'press',
			start: 0,
			end: 100,
			ufoName: 'test',
			apdex: [{ key: 'test-apdex', stopTime: 50 }],
			vcObserver: mockVCObserver,
		} as unknown as InteractionMetrics;

		const expectedVCResult = {
			'metrics:vc': { '90': 100 },
			'ufo:vc:clean': true,
			'metric:vc90': 100,
		};

		const result = await getVCMetrics(interaction);
		expect(result).toMatchObject(expectedVCResult);
		expect(mockVCObserver.stop).toHaveBeenCalledWith('test');
	});

	it('should process page_load interaction correctly', async () => {
		const mockGetMostRecentVCRevision = getMostRecentVCRevision as jest.MockedFunction<
			typeof getMostRecentVCRevision
		>;
		mockGetMostRecentVCRevision.mockReturnValue('fy25.02');

		const mockVCObserver = createMockVCObserver();
		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
			apdex: [{ key: 'test-apdex', stopTime: 50 }],
			vcObserver: mockVCObserver,
		} as unknown as InteractionMetrics;

		const expectedVCResult = {
			'metrics:vc': { '90': 100 },
			'ufo:vc:clean': true,
			'metric:vc90': 100,
		};

		const result = await getVCMetrics(interaction);
		expect(result).toMatchObject(expectedVCResult);
		expect(mockVCObserver.stop).toHaveBeenCalledWith('test');
	});

	it('should process page_load interaction correctly when fy25.01 is disabled', async () => {
		const mockGetMostRecentVCRevision = getMostRecentVCRevision as jest.MockedFunction<
			typeof getMostRecentVCRevision
		>;
		mockGetMostRecentVCRevision.mockReturnValue('fy25.02');

		const mockVCObserver = createMockVCObserver();
		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
			apdex: [{ key: 'test-apdex', stopTime: 50 }],
			vcObserver: mockVCObserver,
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
			vcObserver: createMockVCObserver(),
		} as unknown as InteractionMetrics;

		await getVCMetrics(interaction);
		expect(getSSRDoneTimeValue).toHaveBeenCalled();
	});

	it('should stop VC observer when experimental metrics are enabled', async () => {
		mockGetConfig.mockReturnValue({
			product: 'test',
			region: 'unknown',
			vc: { enabled: true },
			experimentalInteractionMetrics: { enabled: true },
		});

		const mockVCObserver = createMockVCObserver();
		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
			vcObserver: mockVCObserver,
		} as unknown as InteractionMetrics;

		await getVCMetrics(interaction);
		expect(mockVCObserver.stop).toHaveBeenCalledWith('test');
	});

	it('should handle VC revisions by experience', async () => {
		const mockGetMostRecentVCRevision = getMostRecentVCRevision as jest.MockedFunction<
			typeof getMostRecentVCRevision
		>;
		mockGetMostRecentVCRevision.mockReturnValue('fy25.02');

		const mockVCObserver = createMockVCObserver();
		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
			vcObserver: mockVCObserver,
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

		const mockVCObserver = createMockVCObserver();
		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
			vcObserver: mockVCObserver,
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
		const mockVCObserver = createMockVCObserver();
		mockVCObserver.getVCResult.mockResolvedValue({
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
		});

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
			vcObserver: mockVCObserver,
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

	it('should use most recent VC revision from the experience key', async () => {
		const mockGetMostRecentVCRevision = getMostRecentVCRevision as jest.MockedFunction<
			typeof getMostRecentVCRevision
		>;
		mockGetMostRecentVCRevision.mockReturnValue('fy25.02');

		const mockVCObserver = createMockVCObserver();
		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
			vcObserver: mockVCObserver,
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

	it('should pass rawDataStopTime when end3p is set on interaction', async () => {
		const mockVCObserver = createMockVCObserver();
		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			end3p: 200,
			ufoName: 'test',
			vcObserver: mockVCObserver,
		} as unknown as InteractionMetrics;

		await getVCMetrics(interaction);

		expect(mockVCObserver.getVCResult).toHaveBeenCalledWith(
			expect.objectContaining({
				start: 0,
				stop: 100,
				rawDataStopTime: 200,
			}),
		);
	});

	it('should not pass rawDataStopTime when end3p is not set on interaction', async () => {
		const mockVCObserver = createMockVCObserver();
		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
			vcObserver: mockVCObserver,
		} as unknown as InteractionMetrics;

		await getVCMetrics(interaction);

		expect(mockVCObserver.getVCResult).toHaveBeenCalledWith(
			expect.objectContaining({
				start: 0,
				stop: 100,
				rawDataStopTime: undefined,
			}),
		);
	});
});
