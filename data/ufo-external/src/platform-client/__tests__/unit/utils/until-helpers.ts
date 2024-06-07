import {
	ExperiencePerformanceTypes,
	ExperienceTypes,
	UFOExperience,
	UFOExperienceState,
} from '../../../core';
import { untilAll } from '../../../utils/until-helpers';

describe('untilAll helper', async () => {
	beforeAll(() => {});

	test('untilAll with 1 success experience', async () => {
		const experience = new UFOExperience('test', {
			type: ExperienceTypes.Load,
			performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
		});
		experience.start();
		experience.success();

		const until = untilAll([{ experience }])();
		const data = await experience.exportData();
		const res = until(data);
		expect(res.done).toBe(true);
		expect(res.state).toBe(UFOExperienceState.SUCCEEDED);
	});

	test('untilAll with 1 failed experience', async () => {
		const experience = new UFOExperience('test', {
			type: ExperienceTypes.Load,
			performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
		});
		experience.start();
		experience.failure();

		const until = untilAll([{ experience }])();
		const data = await experience.exportData();
		const res = until(data);
		expect(res.done).toBe(true);
		expect(res.state).toBe(UFOExperienceState.FAILED);
	});

	test('untilAll with 2 success experience', async () => {
		const experiences = [
			new UFOExperience('test1', {
				type: ExperienceTypes.Load,
				performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			}),
			new UFOExperience('test2', {
				type: ExperienceTypes.Load,
				performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			}),
		];
		experiences[0].start();
		experiences[1].start();
		experiences[0].success();
		experiences[1].success();

		const until = untilAll(experiences.map((experience) => ({ experience })))();
		const data1 = await experiences[0].exportData();
		const data2 = await experiences[1].exportData();
		const res1 = until(data1);
		const res2 = until(data2);
		expect(res1.done).toBe(false);
		expect(res1.state).toBe(undefined);
		expect(res2.done).toBe(true);
		expect(res2.state).toBe(UFOExperienceState.SUCCEEDED);
	});

	test('untilAll with 1 success 1 failure experience', async () => {
		const experiences = [
			new UFOExperience('test1', {
				type: ExperienceTypes.Load,
				performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			}),
			new UFOExperience('test2', {
				type: ExperienceTypes.Load,
				performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			}),
		];
		experiences[0].start();
		experiences[1].start();
		experiences[0].success();
		experiences[1].failure();

		const until = untilAll(experiences.map((experience) => ({ experience })))();
		const data1 = await experiences[0].exportData();
		const data2 = await experiences[1].exportData();
		const res1 = until(data1);
		const res2 = until(data2);
		expect(res1.done).toBe(false);
		expect(res1.state).toBe(undefined);
		expect(res2.done).toBe(true);
		expect(res2.state).toBe(UFOExperienceState.FAILED);
	});

	test('untilAll with 1 failure 1 success experience', async () => {
		const experiences = [
			new UFOExperience('test1', {
				type: ExperienceTypes.Load,
				performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			}),
			new UFOExperience('test2', {
				type: ExperienceTypes.Load,
				performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			}),
		];
		experiences[0].start();
		experiences[1].start();
		experiences[0].failure();
		experiences[1].success();

		const until = untilAll(experiences.map((experience) => ({ experience })))();
		const data1 = await experiences[0].exportData();
		const data2 = await experiences[1].exportData();
		const res1 = until(data1);
		const res2 = until(data2);
		expect(res1.done).toBe(true);
		expect(res1.state).toBe(UFOExperienceState.FAILED);
		expect(res2.done).toBe(false);
		expect(res2.state).toBe(undefined);
	});

	test('untilAll with 1 failure 1 success experience', async () => {
		const experiences = [
			new UFOExperience('test1', {
				type: ExperienceTypes.Load,
				performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			}),
			new UFOExperience('test2', {
				type: ExperienceTypes.Load,
				performanceType: ExperiencePerformanceTypes.PageSegmentLoad,
			}),
		];
		experiences[0].start();
		experiences[1].start();
		experiences[0].failure();
		experiences[1].success();

		const until = untilAll(experiences.map((experience) => ({ experience })))();
		const data1 = await experiences[0].exportData();
		const data2 = await experiences[1].exportData();
		const res1 = until(data1);
		const res2 = until(data2);
		expect(res1.done).toBe(true);
		expect(res1.state).toBe(UFOExperienceState.FAILED);
		expect(res2.done).toBe(false);
		expect(res2.state).toBe(undefined);
	});
});
