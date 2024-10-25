import { BufferWithMaxLength } from '../utils/buffer';

import { getTBT } from './index';

const makeBuffer = (arr: Array<{ startTime: number; duration: number }>) => {
	const buffer = new BufferWithMaxLength<PerformanceEntry>();
	arr.forEach((a) => {
		buffer.push({ ...a, entryType: 'longtask', name: '', toJSON: () => a });
	});
	return buffer;
};
describe('tbt', () => {
	test('should return 0 when tasks before event', () => {
		expect(getTBT(100, 200, makeBuffer([{ startTime: 0, duration: 99 }]))).toEqual({
			total: 0,
			observed: 0,
		});
	});
	test('should return 0 when tasks after event', () => {
		expect(getTBT(100, 200, makeBuffer([{ startTime: 201, duration: 100 }]))).toEqual({
			total: 0,
			observed: 0,
		});
	});
	test('should return 0 when no tasks', () => {
		expect(getTBT(100, 200, makeBuffer([]))).toEqual({ total: 0, observed: 0 });
	});
	test('should return 0 when tasks shorter or equal 50ms', () => {
		expect(
			getTBT(
				100,
				200,
				makeBuffer([
					{ startTime: 100, duration: 50 },
					{ startTime: 150, duration: 20 },
				]),
			),
		).toEqual({ total: 0, observed: 0 });
	});
	test('should return 10ms when task longer than 60ms', () => {
		expect(
			getTBT(
				100,
				200,
				makeBuffer([
					{ startTime: 100, duration: 60 },
					{ startTime: 160, duration: 20 },
				]),
			),
		).toEqual({ total: 10, observed: 10 });
	});
	test('should return sum of tasks running longer than 50ms', () => {
		expect(
			getTBT(
				100,
				2000,
				makeBuffer([
					{ startTime: 100, duration: 60 },
					{ startTime: 160, duration: 120 },
				]),
			),
		).toEqual({ total: 80, observed: 80 });
	});

	test('should capture and report partially long task starting before start and finishing during experience', () => {
		expect(getTBT(100, 2000, makeBuffer([{ startTime: 0, duration: 160 }]))).toEqual({
			total: 60,
			observed: 110,
		});
	});

	test('should capture and report partially long task starting during experience and finishing after', () => {
		expect(getTBT(100, 2000, makeBuffer([{ startTime: 1900, duration: 200 }]))).toEqual({
			total: 50,
			observed: 150,
		});
	});

	test('should capture and report partially long task covering whole experience', () => {
		expect(getTBT(100, 2000, makeBuffer([{ startTime: 0, duration: 2300 }]))).toEqual({
			total: 1900,
			observed: 2250,
		});
	});
});
