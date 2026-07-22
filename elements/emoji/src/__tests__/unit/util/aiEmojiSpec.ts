import { slugifyPrompt, MAX_SHORTNAME_LENGTH } from '../../../util/ai-emoji';

describe('slugifyPrompt', () => {
	it('slugifies a simple phrase and strips a leading article', () => {
		expect(slugifyPrompt('a cat wearing a hard hat')).toBe('cat_wearing_a_hard_hat');
	});

	it('strips "the" and "an" leading articles', () => {
		expect(slugifyPrompt('the happy dog')).toBe('happy_dog');
		expect(slugifyPrompt('an orange fox')).toBe('orange_fox');
	});

	it('does not strip a non-leading article', () => {
		expect(slugifyPrompt('cat in a hat')).toBe('cat_in_a_hat');
	});

	it('does not strip an article when it is the only word', () => {
		expect(slugifyPrompt('the')).toBe('the');
	});

	it('lowercases and removes special characters', () => {
		expect(slugifyPrompt('Happy Cat!!! @home')).toBe('happy_cat_home');
	});

	it('collapses repeated separators and trims underscores', () => {
		expect(slugifyPrompt('  rocket   ship  ')).toBe('rocket_ship');
	});

	it('truncates to the maximum length', () => {
		const longPrompt = 'word '.repeat(40);
		const result = slugifyPrompt(longPrompt);
		expect(result.length).toBeLessThanOrEqual(MAX_SHORTNAME_LENGTH);
	});

	it('returns an empty string for empty input', () => {
		expect(slugifyPrompt('')).toBe('');
		expect(slugifyPrompt('   ')).toBe('');
	});
});
