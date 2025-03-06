import { fg } from '@atlaskit/platform-feature-flags';

import { InteractionMetrics } from '../../common';
import { getConfig } from '../../config';
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
			vc: { enabled: true },
			experimentalInteractionMetrics: { enabled: false },
		} as unknown as ReturnType<typeof getConfig>);

		mockGetVCObserver.mockReturnValue({
			getVCResult: jest.fn().mockResolvedValue({
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
		mockGetConfig.mockReturnValue({ vc: { enabled: false }, product: 'test', region: 'test' });

		const interaction: InteractionMetrics = {
			type: 'page_load',
			start: 0,
			end: 100,
			ufoName: 'test',
		} as unknown as InteractionMetrics;

		const result = await getVCMetrics(interaction);
		expect(result).toEqual({});
	});

	it('should return empty object for non-page_load and non-transition interactions', async () => {
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
		expect(result).toEqual(expectedVCResult);
	});

	it('should handle SSR configuration for page_load', async () => {
		mockGetConfig.mockReturnValue({
			vc: { enabled: true, ssrWhitelist: ['test'] },
			product: 'test',
			region: 'test',
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
			vc: { enabled: true },
			experimentalInteractionMetrics: { enabled: true },
			product: 'test',
			region: 'test',
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
});
