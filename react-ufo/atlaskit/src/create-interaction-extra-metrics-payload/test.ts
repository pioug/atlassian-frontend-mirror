import { fg } from '@atlaskit/platform-feature-flags';

import type { InteractionMetrics } from '../common';
import type { RevisionPayload } from '../common/vc/types';

import createInteractionExtraLogPayload from './index';

jest.mock('@atlaskit/platform-feature-flags');

jest.mock('../coinflip', () => ({
	__esModule: true,
	default: () => true,
}));

jest.mock('../config', () => {
	const original = jest.requireActual('../config');
	return {
		...original,
		getConfig: () => ({
			product: 'test-product',
			region: 'test-region',
			vc: {
				enabled: true,
				enabledVCRevisions: {
					all: ['fy26.04'],
					byExperience: {},
				},
			},
		}),
		getExtraInteractionRate: () => 1,
	};
});

jest.mock('../create-payload/utils/get-page-visibility-up-to-ttai', () => ({
	__esModule: true,
	default: () => 'visible',
}));

jest.mock('../create-payload/utils/get-more-accurate-page-visibility-up-to-ttai', () => ({
	getMoreAccuratePageVisibilityUpToTTAI: () => null,
}));

jest.mock('../create-payload/utils/get-payload-size', () => ({
	__esModule: true,
	default: () => 0.5,
}));

jest.mock('../create-payload/utils/get-react-ufo-payload-version', () => ({
	getReactUFOPayloadVersion: () => '2.0.0',
}));

jest.mock('../interaction-metrics', () => ({
	interactionSpans: [],
}));

const mockGetVCMetrics = jest.fn();
jest.mock('../create-payload/utils/get-vc-metrics', () => ({
	__esModule: true,
	default: (...args: unknown[]) => mockGetVCMetrics(...args),
}));

function createMockInteraction(overrides?: Partial<InteractionMetrics>): InteractionMetrics {
	return {
		id: 'test-interaction-id',
		ufoName: 'test-experience',
		start: 100,
		end: 500,
		type: 'page_load',
		rate: 1,
		abortReason: undefined,
		routeName: 'test-route',
		previousInteractionName: null,
		isPreviousInteractionAborted: false,
		abortedByInteractionName: undefined,
		knownSegments: [],
		minorInteractions: undefined,
		errors: [],
		spans: [],
		requestInfo: [],
		customTimings: [],
		apdex: [],
		reactProfilerTimings: [],
		customData: [],
		marks: [],
		holdActive: new Map(),
		hold3pActive: new Map(),
		holdInfo: [],
		hold3pInfo: [],
		holdBySegment: new Map(),
		...overrides,
	} as InteractionMetrics;
}

function createVCRevisionPayload(
	revision: string,
	vc90: number | null,
	clean: boolean = true,
	abortReason?: string,
): RevisionPayload[number] {
	return {
		revision,
		clean,
		'metric:vc90': vc90,
		'metric:vc95': null,
		'metric:vc99': null,
		revisionVCDetails: [],
		...(abortReason !== undefined && { abortReason }),
	} as RevisionPayload[number];
}

describe('createInteractionExtraLogPayload - revision resolution', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(fg as jest.Mock).mockImplementation(() => false);
	});

	it('should produce payload when VC results contain fy26.04', async () => {
		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 300)],
		});

		const interaction = createMockInteraction();
		const lastInteraction = createMockInteraction({
			id: 'last-interaction',
			start: 0,
			end: 100,
		});
		const lastVCResult = {
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 200)],
		};

		const result = await createInteractionExtraLogPayload(
			'test-interaction-id',
			interaction,
			lastInteraction,
			lastVCResult,
		);

		// getMostRecentVCRevision() returns 'fy26.04'
		// which matches the VC results → payload is produced
		expect(result).not.toBeNull();
		expect(result?.attributes?.properties?.['vc:effective:revision']).toBe('fy26.04');
	});

	it('should return null when VC revision is unclean', async () => {
		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 300, false)],
		});

		const interaction = createMockInteraction();
		const result = await createInteractionExtraLogPayload('test-interaction-id', interaction, null);

		expect(result).toBeNull();
	});

	it('should return null when VC revision has no vc90 metric', async () => {
		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', null)],
		});

		const interaction = createMockInteraction();
		const result = await createInteractionExtraLogPayload('test-interaction-id', interaction, null);

		expect(result).toBeNull();
	});

	it('should use fy26.04 revision when both revisions available', async () => {
		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [
				createVCRevisionPayload('fy25.03', 250),
				createVCRevisionPayload('fy26.04', 300),
			],
		});

		const interaction = createMockInteraction();
		const lastInteraction = createMockInteraction({
			id: 'last-interaction',
			start: 0,
			end: 100,
		});
		const lastVCResult = {
			'ufo:vc:rev': [
				createVCRevisionPayload('fy25.03', 150),
				createVCRevisionPayload('fy26.04', 200),
			],
		};

		const result = await createInteractionExtraLogPayload(
			'test-interaction-id',
			interaction,
			lastInteraction,
			lastVCResult,
		);

		// Defaults to fy26.04
		expect(result).not.toBeNull();
		expect(result?.attributes?.properties?.['vc:effective:revision']).toBe('fy26.04');
	});

	it('should include lastInteractionFinish VC data using effective revision', async () => {
		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 300)],
		});

		const interaction = createMockInteraction();
		const lastInteraction = createMockInteraction({
			id: 'last-interaction',
			start: 0,
			end: 100,
		});

		const lastVCResult = {
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 200)],
		};

		const result = await createInteractionExtraLogPayload(
			'test-interaction-id',
			interaction,
			lastInteraction,
			lastVCResult,
		);

		expect(result).not.toBeNull();
		expect((result?.attributes?.properties as any)?.lastInteractionFinish?.vc90).toBe(200);
		expect((result?.attributes?.properties as any)?.lastInteractionFinish?.vcClean).toBe(true);
	});

	it('should return null when lastInteractionFinish VC has no matching revision', async () => {
		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 300)],
		});

		const interaction = createMockInteraction();
		const lastInteraction = createMockInteraction({
			id: 'last-interaction',
			start: 0,
			end: 100,
		});

		// lastInteractionFinish only has fy25.03 but we look for fy26.04
		const lastVCResult = {
			'ufo:vc:rev': [createVCRevisionPayload('fy25.03', 200)],
		};

		const result = await createInteractionExtraLogPayload(
			'test-interaction-id',
			interaction,
			lastInteraction,
			lastVCResult,
		);

		// lastInteractionFinish revision doesn't match fy26.04 → unclean → returns null
		expect(result).toBeNull();
	});

	it('should include vcClean field as true in payload when VC is clean', async () => {
		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 300)],
		});

		const interaction = createMockInteraction();
		const lastInteraction = createMockInteraction({
			id: 'last-interaction',
			start: 0,
			end: 100,
		});
		const lastVCResult = {
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 200)],
		};

		const result = await createInteractionExtraLogPayload(
			'test-interaction-id',
			interaction,
			lastInteraction,
			lastVCResult,
		);

		expect(result).not.toBeNull();
		const properties = result?.attributes?.properties as any;
		expect(properties?.vcClean).toBe(true);
		expect(properties?.vcAbortReason).toBeUndefined();
		expect(properties?.hasMinorInteractions).toBe(false);
		expect(properties?.hasErrors).toBe(false);
	});
});

describe('createInteractionExtraLogPayload - dirty VC with feature gate', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(fg as jest.Mock).mockImplementation(() => false);
	});

	it('should return null when 3P VC is dirty and feature gate is OFF', async () => {
		(fg as jest.Mock).mockImplementation((flag: string) => {
			if (flag === 'platform_ufo_send_extra_metrics_on_dirty_vc') {
				return false;
			}
			return false;
		});

		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', null, false, 'scroll')],
		});

		const interaction = createMockInteraction();
		const lastInteraction = createMockInteraction({
			id: 'last-interaction',
			start: 0,
			end: 100,
		});
		const lastVCResult = {
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 200)],
		};

		const result = await createInteractionExtraLogPayload(
			'test-interaction-id',
			interaction,
			lastInteraction,
			lastVCResult,
		);

		expect(result).toBeNull();
	});

	it('should send payload when 3P VC is dirty and feature gate is ON', async () => {
		(fg as jest.Mock).mockImplementation((flag: string) => {
			if (flag === 'platform_ufo_send_extra_metrics_on_dirty_vc') {
				return true;
			}
			return false;
		});

		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', null, false, 'scroll')],
		});

		const interaction = createMockInteraction();
		const lastInteraction = createMockInteraction({
			id: 'last-interaction',
			start: 0,
			end: 100,
		});
		const lastVCResult = {
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 200)],
		};

		const result = await createInteractionExtraLogPayload(
			'test-interaction-id',
			interaction,
			lastInteraction,
			lastVCResult,
		);

		expect(result).not.toBeNull();
		expect((result?.attributes?.properties as any)?.vcClean).toBe(false);
		expect((result?.attributes?.properties as any)?.vcAbortReason).toBe('scroll');
	});

	it('should send payload with vcClean=false and vcAbortReason=keypress when dirty due to keypress', async () => {
		(fg as jest.Mock).mockImplementation((flag: string) => {
			if (flag === 'platform_ufo_send_extra_metrics_on_dirty_vc') {
				return true;
			}
			return false;
		});

		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', null, false, 'keypress')],
		});

		const interaction = createMockInteraction();
		const lastInteraction = createMockInteraction({
			id: 'last-interaction',
			start: 0,
			end: 100,
		});
		const lastVCResult = {
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 200)],
		};

		const result = await createInteractionExtraLogPayload(
			'test-interaction-id',
			interaction,
			lastInteraction,
			lastVCResult,
		);

		expect(result).not.toBeNull();
		expect((result?.attributes?.properties as any)?.vcClean).toBe(false);
		expect((result?.attributes?.properties as any)?.vcAbortReason).toBe('keypress');
	});

	it('should still return null when feature gate is ON but TTAI is invalid', async () => {
		(fg as jest.Mock).mockImplementation((flag: string) => {
			if (flag === 'platform_ufo_send_extra_metrics_on_dirty_vc') {
				return true;
			}
			return false;
		});

		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', null, false, 'scroll')],
		});

		// interaction with no valid end time → TTAI will be invalid
		const interaction = createMockInteraction({ end: 0 });
		const result = await createInteractionExtraLogPayload('test-interaction-id', interaction, null);

		expect(result).toBeNull();
	});

	it('should send payload when interaction has errors and feature gate is ON', async () => {
		(fg as jest.Mock).mockImplementation((flag: string) => {
			if (flag === 'platform_ufo_send_extra_metrics_on_dirty_vc') {
				return true;
			}
			return false;
		});

		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 300)],
		});

		const interaction = createMockInteraction({
			errors: [{ name: 'test-error', labelStack: null, errorType: 'type', errorMessage: 'msg' }],
		});
		const lastInteraction = createMockInteraction({
			id: 'last-interaction',
			start: 0,
			end: 100,
		});
		const lastVCResult = {
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 200)],
		};

		const result = await createInteractionExtraLogPayload(
			'test-interaction-id',
			interaction,
			lastInteraction,
			lastVCResult,
		);

		expect(result).not.toBeNull();
		expect((result?.attributes?.properties as any)?.hasErrors).toBe(true);
	});

	it('should return null when interaction has errors and feature gate is OFF', async () => {
		(fg as jest.Mock).mockImplementation(() => false);

		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 300)],
		});

		const interaction = createMockInteraction({
			errors: [{ name: 'test-error', labelStack: null, errorType: 'type', errorMessage: 'msg' }],
		});
		const lastInteraction = createMockInteraction({
			id: 'last-interaction',
			start: 0,
			end: 100,
		});

		const result = await createInteractionExtraLogPayload(
			'test-interaction-id',
			interaction,
			lastInteraction,
		);

		expect(result).toBeNull();
	});

	it('should send payload when minor interactions exist and feature gate is ON', async () => {
		(fg as jest.Mock).mockImplementation((flag: string) => {
			if (flag === 'platform_ufo_send_extra_metrics_on_dirty_vc') {
				return true;
			}
			return false;
		});

		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 300)],
		});

		const interaction = createMockInteraction({
			minorInteractions: [{ name: 'tooltip-hover', startTime: 50 }],
		});
		const lastInteraction = createMockInteraction({
			id: 'last-interaction',
			start: 0,
			end: 100,
		});
		const lastVCResult = {
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 200)],
		};

		const result = await createInteractionExtraLogPayload(
			'test-interaction-id',
			interaction,
			lastInteraction,
			lastVCResult,
		);

		expect(result).not.toBeNull();
		expect((result?.attributes?.properties as any)?.hasMinorInteractions).toBe(true);
	});

	it('should return null when minor interactions exist and feature gate is OFF', async () => {
		(fg as jest.Mock).mockImplementation(() => false);

		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 300)],
		});

		const interaction = createMockInteraction({
			minorInteractions: [{ name: 'tooltip-hover', startTime: 50 }],
		});
		const lastInteraction = createMockInteraction({
			id: 'last-interaction',
			start: 0,
			end: 100,
		});

		const result = await createInteractionExtraLogPayload(
			'test-interaction-id',
			interaction,
			lastInteraction,
		);

		expect(result).toBeNull();
	});

	it('should send payload when lastInteractionFinish VC is dirty and feature gate is ON', async () => {
		(fg as jest.Mock).mockImplementation((flag: string) => {
			if (flag === 'platform_ufo_send_extra_metrics_on_dirty_vc') {
				return true;
			}
			return false;
		});

		mockGetVCMetrics.mockResolvedValue({
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', 300)],
		});

		const interaction = createMockInteraction();
		const lastInteraction = createMockInteraction({
			id: 'last-interaction',
			start: 0,
			end: 100,
		});

		// lastInteractionFinish VC is dirty
		const lastVCResult = {
			'ufo:vc:rev': [createVCRevisionPayload('fy26.04', null, false, 'resize')],
		};

		const result = await createInteractionExtraLogPayload(
			'test-interaction-id',
			interaction,
			lastInteraction,
			lastVCResult,
		);

		// With gate ON, should still produce payload
		expect(result).not.toBeNull();
		const properties = result?.attributes?.properties as any;
		// The 3P VC itself is clean
		expect(properties?.vcClean).toBe(true);
		// But lastInteractionFinish VC is dirty
		expect(properties?.lastInteractionFinish?.vcClean).toBe(false);
		expect(properties?.lastInteractionFinish?.vc90).toBeNull();
	});
});
