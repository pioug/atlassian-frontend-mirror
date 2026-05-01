import { isValidUuid } from '../../utils/isValidUuid';

describe('isValidUuid', () => {
	it('accepts valid v1 and v2 UUIDs regardless of variant nibble', () => {
		expect(isValidUuid('123e4567-e89b-12d3-0123-426614174000')).toBe(true);
		expect(isValidUuid('123e4567-e89b-22d3-f123-426614174000')).toBe(true);
	});

	it('accepts valid v3, v4 and v5 UUIDs with valid variant nibbles (8/9/a/b)', () => {
		['8', '9', 'a', 'b'].forEach((variant) => {
			expect(isValidUuid(`123e4567-e89b-32d3-${variant}123-426614174000`)).toBe(true);
			expect(isValidUuid(`123e4567-e89b-42d3-${variant}123-426614174000`)).toBe(true);
			expect(isValidUuid(`123e4567-e89b-52d3-${variant}123-426614174000`)).toBe(true);
		});
	});

	it('rejects v3, v4 and v5 UUIDs with invalid variant nibbles', () => {
		['0', '7'].forEach((variant) => {
			expect(isValidUuid(`123e4567-e89b-32d3-${variant}123-426614174000`)).toBe(false);
			expect(isValidUuid(`123e4567-e89b-42d3-${variant}123-426614174000`)).toBe(false);
			expect(isValidUuid(`123e4567-e89b-52d3-${variant}123-426614174000`)).toBe(false);
		});
	});

	it('accepts uppercase UUIDs (case-insensitive)', () => {
		expect(isValidUuid('123E4567-E89B-42D3-A123-426614174000')).toBe(true);
	});

	it('rejects unsupported UUID versions', () => {
		expect(isValidUuid('123e4567-e89b-62d3-8123-426614174000')).toBe(false);
	});

	it('rejects non-UUID and partial strings', () => {
		expect(isValidUuid('not-a-uuid')).toBe(false);
		expect(isValidUuid('123e4567-e89b-42d3-a123')).toBe(false);
	});

	it('rejects non-string inputs', () => {
		expect(isValidUuid(123)).toBe(false);
		expect(isValidUuid(null)).toBe(false);
		expect(isValidUuid(undefined)).toBe(false);
	});
});
