import { toKebabCase } from '../to-kebab-case';

describe('toKebabCase', () => {
	it('converts PascalCase to kebab-case', () => {
		expect(toKebabCase('AvatarItem')).toBe('avatar-item');
	});

	it('returns empty string for empty input', () => {
		expect(toKebabCase('')).toBe('');
	});

	it('normalizes underscores', () => {
		expect(toKebabCase('UNSAFE_media')).toBe('unsafe-media');
	});
});
