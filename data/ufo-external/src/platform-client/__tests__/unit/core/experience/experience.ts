import { UFOExperience } from '../../../../core/experience/experience';
import { UFOExperienceState } from '../../../../core/experience/experience-state';
import {
	ExperiencePerformanceTypes,
	ExperienceTypes,
} from '../../../../core/experience/experience-types';

describe('Experience tests', () => {
	test('experience instantiates without error', () => {
		const experience = new UFOExperience('test', {
			performanceType: ExperiencePerformanceTypes.Custom,
			type: ExperienceTypes.Operation,
		});
		expect(experience).not.toBe(null);
	});

	test('experience transitions to from not started should stay in that state', async () => {
		const experience = new UFOExperience('test', {
			category: 'PRODUCT',
			performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			type: ExperienceTypes.Load,
		});
		expect(experience.state).toBe(UFOExperienceState.NOT_STARTED);
		await experience.success();
		expect(experience.state).toBe(UFOExperienceState.NOT_STARTED);
		await experience.failure();
		expect(experience.state).toBe(UFOExperienceState.NOT_STARTED);
		await experience.abort();
		expect(experience.state).toBe(UFOExperienceState.NOT_STARTED);
	});

	test('experience transitions to started state', async () => {
		const experience = new UFOExperience('test', {
			category: 'PRODUCT',
			performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			type: ExperienceTypes.Load,
		});
		expect(experience.state).toBe(UFOExperienceState.NOT_STARTED);
		await experience.start();
		expect(experience.state).toBe(UFOExperienceState.STARTED);
	});

	test('experience transitions to failed state', async () => {
		const experience = new UFOExperience('test', {
			category: 'PRODUCT',
			performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			type: ExperienceTypes.Load,
		});
		expect(experience.state).toBe(UFOExperienceState.NOT_STARTED);
		await experience.start();
		expect(experience.state).toBe(UFOExperienceState.STARTED);
		await experience.failure();
		expect(experience.state).toBe(UFOExperienceState.FAILED);
	});

	test('experience transitions to success state', async () => {
		const experience = new UFOExperience('test', {
			category: 'PRODUCT',
			performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			type: ExperienceTypes.Load,
		});
		expect(experience.state).toBe(UFOExperienceState.NOT_STARTED);
		await experience.start();
		expect(experience.state).toBe(UFOExperienceState.STARTED);
		await experience.success();
		expect(experience.state).toBe(UFOExperienceState.SUCCEEDED);
	});

	test('experience transitions to success state', async () => {
		const experience = new UFOExperience('test', {
			category: 'PRODUCT',
			performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			type: ExperienceTypes.Load,
		});
		expect(experience.state).toBe(UFOExperienceState.NOT_STARTED);
		await experience.start();
		expect(experience.state).toBe(UFOExperienceState.STARTED);
		await experience.abort();
		expect(experience.state).toBe(UFOExperienceState.ABORTED);
	});

	test('experience export data', async () => {
		const experience = new UFOExperience('test', {
			category: 'PRODUCT',
			performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			type: ExperienceTypes.Experience,
		});
		const data = await experience.exportData();
		expect(data).not.toBe(null);
	});
});
