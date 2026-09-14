import { isKebabCasePath } from '../is-kebab-case-path';

describe('isKebabCasePath', () => {
	it('accepts kebab-case leaves', () => {
		expect(isKebabCasePath('/avatar-item')).toBe(true);
	});

	it('rejects PascalCase leaves', () => {
		expect(isKebabCasePath('/Avatar')).toBe(false);
	});
});
