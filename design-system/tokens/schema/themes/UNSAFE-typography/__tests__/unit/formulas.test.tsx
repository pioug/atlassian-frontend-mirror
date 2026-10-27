import { dynamicTypography } from '../../_formulas';

describe('dynamic typography line heights', () => {
	it.each([
		['body', dynamicTypography.font.body['[default]'].value],
		['large body', dynamicTypography.font.body.large.value],
		['small body', dynamicTypography.font.body.small.value],
		['metric', dynamicTypography.font.metric.large.value],
		['code', dynamicTypography.font.code['[default]'].value],
		['heading', dynamicTypography.font.heading.xxlarge.value],
	])('scales %s line height independently with a default multiplier of one', (_name, value) => {
		expect(value.lineHeight).toContain('var(--ds-dynamic-font-line-height-scale, 1)');
		expect(value.lineHeight).toContain('var(--ds-dynamic-font-scale, 1)');
		expect(value.fontSize).toContain('var(--ds-dynamic-font-scale, 1)');
		expect(value.fontSize).not.toContain('-line-height-scale');
	});

	it.each(['xxlarge', 'xlarge', 'large', 'medium', 'small', 'xsmall', 'xxsmall'] as const)(
		'applies the %s heading line-height scale only to its own line height',
		(size) => {
			const heading = dynamicTypography.font.heading[size].value;
			expect(heading.lineHeight).toContain(
				`var(--ds-dynamic-font-heading-${size}-line-height-scale, 1)`,
			);
			for (const [otherSize, otherHeading] of Object.entries(dynamicTypography.font.heading)) {
				if (otherSize !== size) {
					expect(otherHeading.value.lineHeight).not.toContain(
						`--ds-dynamic-font-heading-${size}-line-height-scale`,
					);
				}
			}
		},
	);

	it('keeps heading line-height scales out of body, metric and code text', () => {
		for (const value of [
			dynamicTypography.font.body['[default]'].value,
			dynamicTypography.font.body.large.value,
			dynamicTypography.font.body.small.value,
			dynamicTypography.font.metric.large.value,
			dynamicTypography.font.code['[default]'].value,
		]) {
			expect(value.lineHeight).not.toContain('--ds-dynamic-font-heading-');
		}
	});

	it('preserves the heading scale for both font size and line height', () => {
		const heading = dynamicTypography.font.heading.xxlarge.value;
		expect(heading.fontSize).toBe(
			'calc(2rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-xxlarge-scale, 1))',
		);
		expect(heading.lineHeight).toBe(
			'calc(2.25rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-xxlarge-scale, 1) * var(--ds-dynamic-font-line-height-scale, 1) * var(--ds-dynamic-font-heading-xxlarge-line-height-scale, 1))',
		);
	});
});
