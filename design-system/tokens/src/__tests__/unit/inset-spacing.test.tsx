import { token } from '../..';
import spacingTokens from '../../artifacts/tokens-raw/atlassian-spacing';

describe('experimental inset spacing', () => {
	it.each([
		['xxsmall', '050', '4px'],
		['xsmall', '100', '8px'],
		['small', '150', '12px'],
		['medium', '200', '16px'],
		['large', '250', '20px'],
		['xlarge', '300', '24px'],
		['xxlarge', '400', '32px'],
		['3xlarge', '600', '48px'],
	] as const)('makes %s available with its numeric equivalent', (size, numericSize, value) => {
		const name = `space.inset.${size}` as const;
		const generatedToken = spacingTokens.find((spacingToken) => spacingToken.name === name);

		expect(token(name)).toBe(`var(--ds-space-inset-${size})`);
		expect(generatedToken?.value).toBe(value);
		expect(generatedToken?.attributes.state).toBe('experimental');
		expect(generatedToken?.attributes.replacement).toBe(`space.${numericSize}`);
	});

	it('provides exactly the eight proposed sizes', () => {
		expect(spacingTokens.filter(({ name }) => name.startsWith('space.inset.'))).toHaveLength(8);
	});
});
