jest.mock('@atlaskit/ufo', () => {
	const actualUfo = jest.requireActual('@atlaskit/ufo');
	return {
		...actualUfo,
		ConcurrentExperience: jest.fn(),
	};
});

import * as jestExtendedMatchers from 'jest-extended';

import { type JestFunction } from '@atlaskit/media-test-helpers';
import { ConcurrentExperience, ExperiencePerformanceTypes, ExperienceTypes } from '@atlaskit/ufo';

import type {
	addMetadataToExperience as AddMetadataToExperienceType,
	failUfoExperience as FailUfoExperienceType,
	startUfoExperience as StartUfoExperienceType,
	succeedUfoExperience as SucceedUfoExperienceType,
} from '../ufoExperiences';

expect.extend(jestExtendedMatchers);

describe('ufoExperience', () => {
	const mockConcurrentExperience: jest.MockedClass<typeof ConcurrentExperience> =
		ConcurrentExperience as jest.MockedClass<typeof ConcurrentExperience>;
	const mockGetInstance: JestFunction<ConcurrentExperience['getInstance']> = jest.fn();
	const mockStart: jest.Mock = jest.fn();
	const mockAddMetadata: jest.Mock = jest.fn();
	const mockSuccess: jest.Mock = jest.fn();
	const mockFailure: jest.Mock = jest.fn();

	const testGetInstance: jest.Mock = jest.fn();

	let startUfoExperience: typeof StartUfoExperienceType;
	let succeedUfoExperience: typeof SucceedUfoExperienceType;
	let failUfoExperience: typeof FailUfoExperienceType;
	let addMetadataToExperience: typeof AddMetadataToExperienceType;

	beforeAll(() => {
		mockGetInstance.mockReturnValue({
			start: mockStart,
			addMetadata: mockAddMetadata,
			success: mockSuccess,
			failure: mockFailure,
		} as any);

		mockConcurrentExperience.mockImplementation((experienceId, config) => {
			return {
				experienceId,
				config,
				getInstance: (instanceId) => testGetInstance(instanceId, experienceId),
				instances: {},
				release: jest.fn(),
			};
		});

		// Load the experiences only after defining mockImplementations
		const ufoExperiencesModule = require('../ufoExperiences');
		startUfoExperience = ufoExperiencesModule.startUfoExperience;
		succeedUfoExperience = ufoExperiencesModule.succeedUfoExperience;
		failUfoExperience = ufoExperiencesModule.failUfoExperience;
		addMetadataToExperience = ufoExperiencesModule.addMetadataToExperience;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	function setExpectedExperienceIdCallback(expectedExperienceId: string) {
		testGetInstance.mockImplementation((instanceId: string, experienceId: string) => {
			expect(experienceId).toBe(expectedExperienceId);
			return mockGetInstance(instanceId);
		});
	}

	describe('ufoExperiences', () => {
		it('should instantiate ConcurrentExperiences', () => {
			const inlineExperienceConfig = {
				performanceType: ExperiencePerformanceTypes.InlineResult,
				platform: {
					component: 'smart-links',
				},
				type: ExperienceTypes.Experience,
			};

			expect(mockConcurrentExperience).toHaveBeenCalledTimes(4);
			expect(mockConcurrentExperience).toHaveBeenCalledWith('smart-link-rendered', {
				performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
				platform: {
					component: 'smart-links',
				},
				type: ExperienceTypes.Load,
			});
			expect(mockConcurrentExperience).toHaveBeenCalledWith(
				'smart-link-authenticated',
				inlineExperienceConfig,
			);
			expect(mockConcurrentExperience).toHaveBeenCalledWith(
				'smart-link-action-invocation',
				inlineExperienceConfig,
			);
			expect(mockConcurrentExperience).toHaveBeenCalledWith('smart-link-ai-summary', {
				platform: { component: 'smart-links' },
				type: ExperienceTypes.Experience,
				performanceType: ExperiencePerformanceTypes.InlineResult,
			});
		});
	});

	describe('startUfoExperience', () => {
		it('should retrieve the correct UFO experience and start it with properties', () => {
			setExpectedExperienceIdCallback('smart-link-rendered');

			startUfoExperience('smart-link-rendered', 'a-test-id', {
				option1: 'Option 1 value',
				option2: 'Option 2 value',
			});

			expect(mockGetInstance).toHaveBeenCalledTimes(1);
			expect(mockGetInstance).toHaveBeenCalledWith('a-test-id');
			expect(mockAddMetadata).toHaveBeenCalledWith({
				option1: 'Option 1 value',
				option2: 'Option 2 value',
			});
			expect(mockStart).toHaveBeenCalledTimes(1);
			expect(mockStart).toHaveBeenCalledBefore(mockAddMetadata);
		});

		it('should not try adding metaData if properties are not provided', () => {
			setExpectedExperienceIdCallback('smart-link-authenticated');

			startUfoExperience('smart-link-authenticated', 'b-test-id');

			expect(mockGetInstance).toHaveBeenCalledTimes(1);
			expect(mockGetInstance).toHaveBeenCalledWith('b-test-id');
			expect(mockStart).toHaveBeenCalledTimes(1);
			expect(mockAddMetadata).not.toHaveBeenCalled();
		});
	});

	describe('succeedUfoExperience', () => {
		it('should be able to succeed an experience with provided metadata', () => {
			setExpectedExperienceIdCallback('smart-link-rendered');

			succeedUfoExperience('smart-link-rendered', 'a-test-id', {
				option1: 'Option 1 value',
				option2: 'Option 2 value',
			});

			expect(mockGetInstance).toHaveBeenCalledTimes(1);
			expect(mockGetInstance).toHaveBeenCalledWith('a-test-id');
			expect(mockSuccess).toHaveBeenCalledTimes(1);
			expect(mockSuccess).toHaveBeenCalledWith({
				metadata: {
					option1: 'Option 1 value',
					option2: 'Option 2 value',
				},
			});
		});

		it('should be able to succeed an experience without provided metadata', () => {
			setExpectedExperienceIdCallback('smart-link-authenticated');

			succeedUfoExperience('smart-link-authenticated', 'b-test-id', {});
			expect(mockGetInstance).toHaveBeenCalledTimes(1);
			expect(mockGetInstance).toHaveBeenCalledWith('b-test-id');
			expect(mockSuccess).toHaveBeenCalledTimes(1);
			expect(mockSuccess).toHaveBeenCalledWith({
				metadata: {},
			});
		});
	});

	describe('failUfoExperience', () => {
		it('should be able to fail an experience with provided metadata', () => {
			setExpectedExperienceIdCallback('smart-link-rendered');

			failUfoExperience('smart-link-rendered', 'a-test-id', {
				option1: 'Option 1 value',
				option2: 'Option 2 value',
			});

			expect(mockGetInstance).toHaveBeenCalledTimes(1);
			expect(mockGetInstance).toHaveBeenCalledWith('a-test-id');
			expect(mockFailure).toHaveBeenCalledTimes(1);
			expect(mockFailure).toHaveBeenCalledWith({
				metadata: {
					option1: 'Option 1 value',
					option2: 'Option 2 value',
				},
			});
		});

		it('should be able to fail an experience without provided metadata', () => {
			setExpectedExperienceIdCallback('smart-link-authenticated');

			failUfoExperience('smart-link-authenticated', 'b-test-id', {});

			expect(mockGetInstance).toHaveBeenCalledTimes(1);
			expect(mockGetInstance).toHaveBeenCalledWith('b-test-id');
			expect(mockFailure).toHaveBeenCalledTimes(1);
			expect(mockFailure).toHaveBeenCalledWith({
				metadata: {},
			});
		});
	});

	describe('addMetadataToExperience', () => {
		it('should add metadata to the specified experience', () => {
			setExpectedExperienceIdCallback('smart-link-rendered');

			addMetadataToExperience('smart-link-rendered', 'a-test-id', {
				option1: 'Option 1 value',
				option2: 'Option 2 value',
			});

			expect(mockGetInstance).toHaveBeenCalledTimes(1);
			expect(mockGetInstance).toHaveBeenCalledWith('a-test-id');
			expect(mockAddMetadata).toHaveBeenCalledTimes(1);
			expect(mockAddMetadata).toHaveBeenCalledWith({
				option1: 'Option 1 value',
				option2: 'Option 2 value',
			});
		});
	});
});
