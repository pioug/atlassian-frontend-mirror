import { resolveColors } from '../../../components/DateLozenge';

describe('resolveColors', () => {
	it('return default colors', () => {
		expect(resolveColors()).toEqual([
			'var(--ds-background-neutral, #091E420F)',
			'var(--ds-text, #172B4D)',
			'var(--ds-background-neutral-hovered, #091E4224)',
		]);
	});

	it('return grey colors', () => {
		expect(resolveColors('grey')).toEqual([
			'var(--ds-background-neutral, #091E420F)',
			'var(--ds-text, #172B4D)',
			'var(--ds-background-neutral-hovered, #091E4224)',
		]);
	});

	it('return red colors', () => {
		expect(resolveColors('red')).toEqual([
			'var(--ds-background-accent-red-subtlest, #FFECEB)',
			'var(--ds-text-accent-red, #AE2E24)',
			'var(--ds-background-accent-red-subtler, #FFD5D2)',
		]);
	});

	it('return blue colors', () => {
		expect(resolveColors('blue')).toEqual([
			'var(--ds-background-accent-blue-subtlest, #E9F2FF)',
			'var(--ds-text-accent-blue, #0055CC)',
			'var(--ds-background-accent-blue-subtler, #CCE0FF)',
		]);
	});

	it('return green colors', () => {
		expect(resolveColors('green')).toEqual([
			'var(--ds-background-accent-green-subtlest, #DCFFF1)',
			'var(--ds-text-accent-green, #216E4E)',
			'var(--ds-background-accent-green-subtler, #BAF3DB)',
		]);
	});

	it('return purple colors', () => {
		expect(resolveColors('purple')).toEqual([
			'var(--ds-background-accent-purple-subtlest, #F3F0FF)',
			'var(--ds-text-accent-purple, #5E4DB2)',
			'var(--ds-background-accent-purple-subtler, #DFD8FD)',
		]);
	});

	it('return yellow colors', () => {
		expect(resolveColors('yellow')).toEqual([
			'var(--ds-background-accent-yellow-subtlest, #FFF7D6)',
			'var(--ds-text-accent-yellow, #7F5F01)',
			'var(--ds-background-accent-yellow-subtler, #F8E6A0)',
		]);
	});
});
