import { preserveListLayout } from '../preserve-list-layout';

const N = ':not(:where([popover], dialog))';

describe('preserveListLayout', () => {
	it('puts each rewritten branch back between the separators the author wrote', () => {
		const original = '& > div,\n          & > span,\n          & > [data-slot]';
		const rewritten = `& > div${N}, & > span, & > [data-slot]${N}`;

		expect(preserveListLayout({ original, rewritten })).toBe(
			`& > div${N},\n          & > span,\n          & > [data-slot]${N}`,
		);
	});

	it('does not split on an escaped comma', () => {
		const original = '& > .a\\,b,\n& > div';
		const rewritten = `& > .a\\,b, & > div${N}`;

		expect(preserveListLayout({ original, rewritten })).toBe(`& > .a\\,b,\n& > div${N}`);
	});

	it('does not split on a comma inside a comment', () => {
		const original = '& > div,\n& > /* , */ span,\n& > [data-slot]';
		const rewritten = `& > div${N}, & > /* , */ span, & > [data-slot]${N}`;

		expect(preserveListLayout({ original, rewritten })).toBe(
			`& > div${N},\n& > /* , */ span,\n& > [data-slot]${N}`,
		);
	});

	it('does not split on a comma inside a functional pseudo or an attribute', () => {
		const original = '&:has(a, b),\n& > [data-x=","]';
		const rewritten = `&:has(a${N}, b${N}), & > [data-x=","]${N}`;

		expect(preserveListLayout({ original, rewritten })).toBe(
			`&:has(a${N}, b${N}),\n& > [data-x=","]${N}`,
		);
	});

	it('returns the rewritten text as-is for a single branch', () => {
		expect(preserveListLayout({ original: '& > div', rewritten: `& > div${N}` })).toBe(
			`& > div${N}`,
		);
	});

	it('falls back to the rewritten text when the branch counts differ', () => {
		expect(preserveListLayout({ original: '& > div, & > span', rewritten: `& > div${N}` })).toBe(
			`& > div${N}`,
		);
	});

	it('falls back to the rewritten text when the original does not parse', () => {
		expect(
			preserveListLayout({ original: '& > div[, & > span', rewritten: `& > div${N}, & > span` }),
		).toBe(`& > div${N}, & > span`);
	});
});
