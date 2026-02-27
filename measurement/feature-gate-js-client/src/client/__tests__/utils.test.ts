import { deepAssign } from '../utils';

describe('deepAssign', () => {
	test('should return target when no sources provided', () => {
		const target = { a: 1 };
		const result = deepAssign(target, undefined);
		expect(result).toBe(target);
		expect(result).toEqual({ a: 1 });
	});

	test('should merge single source into target', () => {
		const target = { a: 1 };
		const source = { b: 2 };
		const result = deepAssign(target, source);
		expect(result).toEqual({ a: 1, b: 2 });
	});

	test('should merge multiple sources into target', () => {
		const target = { a: 1 };
		const source1 = { b: 2 };
		const source2 = { c: 3 };
		const result = deepAssign(target, source1, source2);
		expect(result).toEqual({ a: 1, b: 2, c: 3 });
	});

	test('should override properties from left to right', () => {
		const target = { a: 1 };
		const source1 = { a: 2 };
		const source2 = { a: 3 };
		const result = deepAssign(target, source1, source2);
		expect(result).toEqual({ a: 3 });
	});

	test('should deeply merge nested objects', () => {
		const target = { a: { x: 1, y: 2 } };
		const source = { a: { y: 3, z: 4 } };
		const result = deepAssign(target, source);
		expect(result).toEqual({ a: { x: 1, y: 3, z: 4 } });
	});

	test('should deeply merge multiple levels of nesting', () => {
		const target = { a: { b: { c: 1, d: 2 } } };
		const source = { a: { b: { d: 3, e: 4 } } };
		const result = deepAssign(target, source);
		expect(result).toEqual({ a: { b: { c: 1, d: 3, e: 4 } } });
	});

	test('should replace arrays instead of merging them', () => {
		const target = { a: [1, 2, 3] };
		const source = { a: [4, 5] };
		const result = deepAssign(target, source);
		expect(result).toEqual({ a: [4, 5] });
	});

	test('should handle null source by skipping it', () => {
		const target = { a: 1 };
		const result = deepAssign(target, null, { b: 2 });
		expect(result).toEqual({ a: 1, b: 2 });
	});

	test('should handle undefined source by skipping it', () => {
		const target = { a: 1 };
		const result = deepAssign(target, undefined, { b: 2 });
		expect(result).toEqual({ a: 1, b: 2 });
	});

	test('should handle null values in source properties', () => {
		const target = { a: 1 };
		const source = { b: null };
		const result = deepAssign(target, source);
		expect(result).toEqual({ a: 1, b: null });
	});

	test('should replace object with primitive', () => {
		const target = { a: { x: 1 } };
		const source = { a: 'string' };
		const result = deepAssign(target, source);
		expect(result).toEqual({ a: 'string' });
	});

	test('should replace primitive with object', () => {
		const target = { a: 'string' };
		const source = { a: { x: 1 } };
		const result = deepAssign(target, source);
		expect(result).toEqual({ a: { x: 1 } });
	});

	test('should handle empty objects', () => {
		const target = {};
		const source = { a: 1 };
		const result = deepAssign(target, source);
		expect(result).toEqual({ a: 1 });
	});

	test('should merge into empty target from multiple sources', () => {
		const result = deepAssign({}, { a: 1 }, { b: 2 }, { c: 3 });
		expect(result).toEqual({ a: 1, b: 2, c: 3 });
	});

	test('should not mutate source objects during deep merge', () => {
		const target = { a: { x: 1 } };
		const source = { a: { y: 2 } };
		const sourceCopy = JSON.parse(JSON.stringify(source));
		deepAssign(target, source);
		expect(source).toEqual(sourceCopy);
	});

	test('should handle complex nested structures', () => {
		const target = {
			user: {
				customIDs: { id1: 'value1' },
				custom: { attr1: 'old' },
			},
		};
		const source = {
			user: {
				customIDs: { id2: 'value2' },
				custom: { attr2: 'new' },
			},
		};
		const result = deepAssign(target, source);
		expect(result).toEqual({
			user: {
				customIDs: { id1: 'value1', id2: 'value2' },
				custom: { attr1: 'old', attr2: 'new' },
			},
		});
	});

	test('should work with the user merge use case from Client.ts', () => {
		const initializeValuesUser = {
			userID: 'user-123',
			customIDs: { tenantId: 'tenant-1' },
			custom: { plan: 'free' },
		};
		const currentUser = {
			customIDs: { atlassianAccountId: 'aaid-456' },
			custom: { role: 'admin' },
		};

		const result = deepAssign({}, initializeValuesUser, currentUser);

		expect(result).toEqual({
			userID: 'user-123',
			customIDs: { tenantId: 'tenant-1', atlassianAccountId: 'aaid-456' },
			custom: { plan: 'free', role: 'admin' },
		});
	});

	test('should handle objects with symbol properties by ignoring them', () => {
		const sym = Symbol('test');
		const target = { a: 1, [sym]: 'symbol-value' };
		const source = { b: 2 };
		const result = deepAssign(target, source);
		// Object.entries doesn't iterate over symbol properties
		expect(result).toEqual({ a: 1, b: 2, [sym]: 'symbol-value' });
	});

	test('should handle nested arrays without deep merging', () => {
		const target = { a: { arr: [1, 2] } };
		const source = { a: { arr: [3] } };
		const result = deepAssign(target, source);
		expect(result).toEqual({ a: { arr: [3] } });
	});
});
