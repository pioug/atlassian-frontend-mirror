import { mapToMinimal, mapToStandard, minimalToMap, standardToMap } from './index';

describe('minimal', () => {
	test('empty', () => {
		expect(minimalToMap([[], [], [], [], []])).toEqual(new Map());
		expect(mapToMinimal(new Map())).toEqual([[], [], [], [], []]);
	});

	test('boolean', () => {
		expect(minimalToMap([['foo'], [], [], [], []])).toEqual(new Map([['foo', { value: true }]]));
		expect(mapToMinimal(new Map([['foo', { value: true }]]))).toEqual([['foo'], [], [], [], []]);
	});

	test('string', () => {
		expect(minimalToMap([[], ['foo', 'bar'], [], [], []])).toEqual(
			new Map([['foo', { value: 'bar' }]]),
		);
		expect(mapToMinimal(new Map([['foo', { value: 'bar' }]]))).toEqual([
			[],
			['foo', 'bar'],
			[],
			[],
			[],
		]);
	});

	test('number', () => {
		expect(minimalToMap([[], [], ['foo', 333], [], []])).toEqual(
			new Map([['foo', { value: 333 }]]),
		);
		expect(mapToMinimal(new Map([['foo', { value: 333 }]]))).toEqual([
			[],
			[],
			['foo', 333],
			[],
			[],
		]);
	});

	test('string list', () => {
		expect(minimalToMap([[], [], [], ['foo', ['one', 'two']], []])).toEqual(
			new Map([['foo', { value: ['one', 'two'] }]]),
		);
		expect(mapToMinimal(new Map([['foo', { value: ['one', 'two'] }]]))).toEqual([
			[],
			[],
			[],
			['foo', ['one', 'two']],
			[],
		]);
	});

	test('number list', () => {
		expect(minimalToMap([[], [], [], [], ['foo', [1, 2]]])).toEqual(
			new Map([['foo', { value: [1, 2] }]]),
		);
	});
});

describe('standard', () => {
	test('empty', () => {
		expect(standardToMap({})).toEqual(new Map());
		expect(mapToStandard(new Map())).toEqual({});
	});

	test('boolean', () => {
		expect(standardToMap({ foo: { value: true } })).toEqual(new Map([['foo', { value: true }]]));
		expect(mapToStandard(new Map([['foo', { value: true }]]))).toEqual({
			foo: { value: true },
		});
	});

	test('string', () => {
		expect(standardToMap({ foo: { value: 'bar' } })).toEqual(new Map([['foo', { value: 'bar' }]]));
		expect(mapToStandard(new Map([['foo', { value: 'bar' }]]))).toEqual({
			foo: { value: 'bar' },
		});
	});

	test('number', () => {
		expect(standardToMap({ foo: { value: 333 } })).toEqual(new Map([['foo', { value: 333 }]]));
		expect(mapToStandard(new Map([['foo', { value: 333 }]]))).toEqual({
			foo: { value: 333 },
		});
	});

	test('string list', () => {
		expect(standardToMap({ foo: { value: ['one', 'two'] } })).toEqual(
			new Map([['foo', { value: ['one', 'two'] }]]),
		);
		expect(mapToStandard(new Map([['foo', { value: ['one', 'two'] }]]))).toEqual({
			foo: { value: ['one', 'two'] },
		});
	});

	test('number list', () => {
		expect(standardToMap({ foo: { value: [1, 2] } })).toEqual(
			new Map([['foo', { value: [1, 2] }]]),
		);
		expect(mapToStandard(new Map([['foo', { value: [1, 2] }]]))).toEqual({
			foo: { value: [1, 2] },
		});
	});
});
