import {
	getUfoExperienceKey,
	getUfoExperienceKeyHeader,
	mergeUfoExperienceKeyHeaders,
} from '../index';

// Mock @atlaskit/react-ufo/interaction-metrics
jest.mock('@atlaskit/react-ufo/interaction-metrics', () => ({
	getActiveInteraction: jest.fn(),
}));

import { getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';

const mockGetActiveInteraction = getActiveInteraction as jest.MockedFunction<
	typeof getActiveInteraction
>;

describe('getUfoExperienceKey', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('with active interaction', () => {
		test('should return experience key with page-load load type for page_load interaction', () => {
			mockGetActiveInteraction.mockReturnValue({
				ufoName: 'issueView',
				type: 'page_load',
			} as any);

			const result = getUfoExperienceKey('jira');

			expect(result).toBe('jira.fe.page-load.issueView');
		});

		test('should return experience key with page-load load type for transition interaction', () => {
			mockGetActiveInteraction.mockReturnValue({
				ufoName: 'dashboardView',
				type: 'transition',
			} as any);

			const result = getUfoExperienceKey('confluence');

			expect(result).toBe('confluence.fe.page-load.dashboardView');
		});

		test('should return experience key with page-segment-load load type for segment interaction', () => {
			mockGetActiveInteraction.mockReturnValue({
				ufoName: 'pageEditor',
				type: 'segment',
			} as any);

			const result = getUfoExperienceKey('mercury');

			expect(result).toBe('mercury.fe.page-segment-load.pageEditor');
		});

		test('should return experience key with inline-result load type for unknown interaction type', () => {
			mockGetActiveInteraction.mockReturnValue({
				ufoName: 'customComponent',
				type: 'unknown_type',
			} as any);

			const result = getUfoExperienceKey('jira');

			expect(result).toBe('jira.fe.inline-result.customComponent');
		});

		test('should handle different product names', () => {
			mockGetActiveInteraction.mockReturnValue({
				ufoName: 'testFeature',
				type: 'page_load',
			} as any);

			expect(getUfoExperienceKey('jira')).toBe('jira.fe.page-load.testFeature');
			expect(getUfoExperienceKey('confluence')).toBe('confluence.fe.page-load.testFeature');
			expect(getUfoExperienceKey('mercury')).toBe('mercury.fe.page-load.testFeature');
		});
	});

	describe('without active interaction', () => {
		test('should return fallback experience key when activeInteraction is null', () => {
			mockGetActiveInteraction.mockReturnValue(undefined);

			const result = getUfoExperienceKey('jira');

			expect(result).toBe('jira.fe.feature-type-absent.feature-name-absent');
		});

		test('should return fallback experience key when activeInteraction is undefined', () => {
			mockGetActiveInteraction.mockReturnValue(undefined);

			const result = getUfoExperienceKey('confluence');

			expect(result).toBe('confluence.fe.feature-type-absent.feature-name-absent');
		});

		test('should return fallback experience key when ufoName is missing', () => {
			mockGetActiveInteraction.mockReturnValue({
				ufoName: undefined,
				type: 'page_load',
			} as any);

			const result = getUfoExperienceKey('mercury');

			expect(result).toBe('mercury.fe.feature-type-absent.feature-name-absent');
		});

		test('should return fallback experience key when ufoName is empty string', () => {
			mockGetActiveInteraction.mockReturnValue({
				ufoName: '',
				type: 'page_load',
			} as any);

			const result = getUfoExperienceKey('jira');

			expect(result).toBe('jira.fe.feature-type-absent.feature-name-absent');
		});
	});

	describe('always returns a string', () => {
		test('should never return undefined', () => {
			mockGetActiveInteraction.mockReturnValue(undefined);

			const result = getUfoExperienceKey('jira');

			expect(result).toBeDefined();
			expect(typeof result).toBe('string');
		});

		test('should never return null', () => {
			mockGetActiveInteraction.mockReturnValue(undefined);

			const result = getUfoExperienceKey('confluence');

			expect(result).not.toBeNull();
			expect(typeof result).toBe('string');
		});
	});
});

describe('getUfoExperienceKeyHeader', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should return experience-key header when active interaction exists with ufoName', () => {
		mockGetActiveInteraction.mockReturnValue({
			ufoName: 'issueView',
			type: 'page_load',
		} as any);

		const result = getUfoExperienceKeyHeader('jira');

		expect(result).toEqual({
			'atl-paas-cnsmr-ctx-experience-key': 'jira.fe.page-load.issueView',
		});
	});

	test('should return missing-experience-key-product header when active interaction exists but no ufoName', () => {
		mockGetActiveInteraction.mockReturnValue({
			ufoName: undefined,
			type: 'page_load',
		} as any);

		const result = getUfoExperienceKeyHeader('mercury');

		expect(result).toEqual({
			'atl-paas-missing-experience-key-product': 'mercury',
		});
	});

	test('should have correct header key name', () => {
		mockGetActiveInteraction.mockReturnValue({
			ufoName: 'testFeature',
			type: 'page_load',
		} as any);

		const result = getUfoExperienceKeyHeader('jira');

		expect(result).toHaveProperty('atl-paas-cnsmr-ctx-experience-key');
	});

	test('should return missing-experience-key-product header when no active interaction', () => {
		mockGetActiveInteraction.mockReturnValue(undefined);

		const result = getUfoExperienceKeyHeader('confluence');

		expect(result).toEqual({
			'atl-paas-missing-experience-key-product': 'confluence',
		});
	});

	test('should always return a value (never undefined)', () => {
		mockGetActiveInteraction.mockReturnValue(undefined);

		const result = getUfoExperienceKeyHeader('mercury');

		expect(result).toBeDefined();
		expect(typeof result).toBe('object');
	});

	test('should be spreadable in object', () => {
		mockGetActiveInteraction.mockReturnValue({
			ufoName: 'pageEditor',
			type: 'segment',
		} as any);

		const header = getUfoExperienceKeyHeader('jira');

		const headers = {
			'Content-Type': 'application/json',
			...header,
		};

		expect(headers).toEqual({
			'Content-Type': 'application/json',
			'atl-paas-cnsmr-ctx-experience-key': 'jira.fe.page-segment-load.pageEditor',
		});
	});
});

describe('mergeUfoExperienceKeyHeaders', () => {
	test('should merge UFO headers with existing headers', () => {
		mockGetActiveInteraction.mockReturnValue({
			ufoName: 'issueView',
			type: 'page_load',
		} as any);

		const existing = {
			'Content-Type': 'application/json',
			Authorization: 'Bearer token',
		};

		const merged = mergeUfoExperienceKeyHeaders('jira', existing);

		expect(merged).toEqual({
			'Content-Type': 'application/json',
			Authorization: 'Bearer token',
			'atl-paas-cnsmr-ctx-experience-key': 'jira.fe.page-load.issueView',
		});
	});

	test('should work without existing headers', () => {
		mockGetActiveInteraction.mockReturnValue({
			ufoName: 'issueView',
			type: 'page_load',
		} as any);

		const merged = mergeUfoExperienceKeyHeaders('jira');

		expect(merged).toEqual({
			'atl-paas-cnsmr-ctx-experience-key': 'jira.fe.page-load.issueView',
		});
	});

	test('should use missing experience key header when no active interaction', () => {
		mockGetActiveInteraction.mockReturnValue(undefined);

		const merged = mergeUfoExperienceKeyHeaders('jira', {
			'Content-Type': 'application/json',
		});

		expect(merged).toEqual({
			'Content-Type': 'application/json',
			'atl-paas-missing-experience-key-product': 'jira',
		});
	});
});
