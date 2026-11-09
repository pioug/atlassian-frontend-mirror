import { token } from '../..';
import spacingTokens from '../../artifacts/tokens-raw/atlassian-spacing';

describe('experimental inset spacing', () => {
	it.each([
		['xxsmall', '025', '2px'],
		['xsmall', '050', '4px'],
		['small', '075', '6px'],
		['medium', '100', '8px'],
		['large', '150', '12px'],
		['xlarge', '200', '16px'],
		['xxlarge', '250', '20px'],
		['3xlarge', '300', '24px'],
		['4xlarge', '400', '32px'],
		['5xlarge', '600', '48px'],
	] as const)('makes %s available with its numeric equivalent', (size, numericSize, value) => {
		const name = `space.inset.${size}` as const;
		const generatedToken = spacingTokens.find((spacingToken) => spacingToken.name === name);

		expect(token(name)).toBe(`var(--ds-space-inset-${size})`);
		expect(generatedToken?.value).toBe(value);
		expect(generatedToken?.attributes.state).toBe('experimental');
		expect(generatedToken?.attributes.replacement).toBe(`space.${numericSize}`);
	});

	it('provides exactly the ten proposed sizes', () => {
		expect(spacingTokens.filter(({ name }) => name.startsWith('space.inset.'))).toHaveLength(10);
	});
});
