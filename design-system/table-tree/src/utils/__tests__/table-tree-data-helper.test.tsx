import { internalGet as get, internalSet as set } from '../table-tree-data-helper';

const baseObject = { a: { b: 2, c: 3 } };

describe('get', () => {
	it('should get nested values', () => {
		expect(get(baseObject, 'a.b')).toBe(baseObject.a.b);
	});

	it("should not get values that don't exist", () => {
		expect(get(baseObject, 'a.b.x')).toBeUndefined();
	});
});

describe('set', () => {
	it('should not mutate values', () => {
		const _object = JSON.parse(JSON.stringify(baseObject));
		const actual = set(_object, 'a.b', 3);

		expect(baseObject).toEqual({ a: { b: 2, c: 3 } });
		expect(actual).toEqual({ a: { b: 3, c: 3 } });
	});

	it('should create new paths', () => {
		const _object = JSON.parse(JSON.stringify(baseObject));
		const actual = set(_object, 'a.d.e.f', true);

		expect(baseObject).toEqual({ a: { b: 2, c: 3 } });
		expect(actual).toEqual({ a: { b: 2, c: 3, d: { e: { f: true } } } });
	});
});
