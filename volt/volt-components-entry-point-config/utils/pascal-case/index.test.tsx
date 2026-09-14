import { pascalCase } from '../pascal-case';

describe('pascalCase', () => {
	it('converts kebab and snake segments', () => {
		expect(pascalCase('avatar-item')).toBe('AvatarItem');
		expect(pascalCase('unsafe_media')).toBe('UnsafeMedia');
	});
});
