import { resolveColors } from '../../../components/DateLozenge';

describe('resolveColors', () => {
	it('return default colors', () => {
		expect(resolveColors()).toEqual([
			'var(--ds-background-neutral, rgba(9, 30, 66, 0.08))',
			'var(--ds-text, #172B4D)',
			'var(--ds-background-neutral-hovered, #DFE1E6)',
		]);
	});

	it('return grey colors', () => {
		expect(resolveColors('grey')).toEqual([
			'var(--ds-background-neutral, rgba(9, 30, 66, 0.08))',
			'var(--ds-text, #172B4D)',
			'var(--ds-background-neutral-hovered, #DFE1E6)',
		]);
	});

	it('return red colors', () => {
		expect(resolveColors('red')).toEqual([
			'var(--ds-background-accent-red-subtlest, #FFEBE6)',
			'var(--ds-text-accent-red, #BF2600)',
			'var(--ds-background-accent-red-subtler, #FFBDAD)',
		]);
	});

	it('return blue colors', () => {
		expect(resolveColors('blue')).toEqual([
			'var(--ds-background-accent-blue-subtlest, #DEEBFF)',
			'var(--ds-text-accent-blue, #0747A6)',
			'var(--ds-background-accent-blue-subtler, #B3D4FF)',
		]);
	});

	it('return green colors', () => {
		expect(resolveColors('green')).toEqual([
			'var(--ds-background-accent-green-subtlest, #E3FCEF)',
			'var(--ds-text-accent-green, #006644)',
			'var(--ds-background-accent-green-subtler, #ABF5D1)',
		]);
	});

	it('return purple colors', () => {
		expect(resolveColors('purple')).toEqual([
			'var(--ds-background-accent-purple-subtlest, #EAE6FF)',
			'var(--ds-text-accent-purple, #403294)',
			'var(--ds-background-accent-purple-subtler, #C0B6F2)',
		]);
	});

	it('return yellow colors', () => {
		expect(resolveColors('yellow')).toEqual([
			'var(--ds-background-accent-yellow-subtlest, #FFFAE6)',
			'var(--ds-text-accent-yellow, #FF8B00)',
			'var(--ds-background-accent-yellow-subtler, #FFF0B3)',
		]);
	});
});
