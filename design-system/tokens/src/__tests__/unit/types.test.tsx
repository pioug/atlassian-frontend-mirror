import type { DesignTokenStyles } from '../../entry-points/css-type-schema.codegen';
import type { AttributeSchema, ValueSchema } from '../../types';

describe('schema types', () => {
	it.each([
		'xxsmall',
		'xsmall',
		'small',
		'medium',
		'large',
		'xlarge',
		'xxlarge',
		'3xlarge',
		'4xlarge',
		'5xlarge',
	] as const)('allows %s inset tokens for all padding properties', (size) => {
		const inset = `var(--ds-space-inset-${size})` as const;
		const styles: Partial<DesignTokenStyles> = {
			padding: inset,
			paddingBlock: inset,
			paddingBlockEnd: inset,
			paddingBlockStart: inset,
			paddingBottom: inset,
			paddingInline: inset,
			paddingInlineEnd: inset,
			paddingInlineStart: inset,
			paddingLeft: inset,
			paddingRight: inset,
			paddingTop: inset,
		};

		expect(Object.values(styles)).toEqual(Array(11).fill(inset));
	});

	it('limits inset tokens to padding', () => {
		const inset = 'var(--ds-space-inset-medium)' as const;
		const styles: Partial<DesignTokenStyles> = {
			padding: inset,
			// @ts-expect-error Inset tokens must not be used for gaps.
			gap: inset,
			// @ts-expect-error Inset tokens must not be used for margin.
			margin: inset,
			// @ts-expect-error Inset tokens must not be used for layout positioning.
			inset,
			// @ts-expect-error Inset tokens must not be used for dimensions.
			width: inset,
		};

		expect(styles.padding).toEqual(inset);
	});

	it.each(['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge', 'xxlarge'] as const)(
		'allows %s gap tokens for all margin properties',
		(size) => {
			const gap = `var(--ds-space-gap-${size})` as const;
			const styles: Partial<DesignTokenStyles> = {
				margin: gap,
				marginBlock: gap,
				marginBlockEnd: gap,
				marginBlockStart: gap,
				marginBottom: gap,
				marginInline: gap,
				marginInlineEnd: gap,
				marginInlineStart: gap,
				marginLeft: gap,
				marginRight: gap,
				marginTop: gap,
			};

			expect(Object.values(styles)).toEqual(Array(11).fill(gap));
		},
	);

	it('limits gap tokens to gap and margin properties', () => {
		const gap = 'var(--ds-space-gap-medium)' as const;
		const styles: Partial<DesignTokenStyles> = {
			gap,
			rowGap: gap,
			columnGap: gap,
			// @ts-expect-error Gap tokens must not be used for padding.
			padding: gap,
			margin: gap,
			// @ts-expect-error Gap tokens must not be used for insets.
			inset: gap,
			// @ts-expect-error Gap tokens must not be used for dimensions.
			width: gap,
		};

		expect(styles.gap).toEqual(gap);
	});

	it('should error when using the removed attributes property', () => {
		const obj: ValueSchema<{ value: true; attributes: true }> = {
			// @ts-expect-error
			attributes: true,
			value: true,
		};

		expect(obj).toBeDefined();
	});

	it('should error when using the removed value property', () => {
		const obj: AttributeSchema<{ foo: true; attributes: true }> = {
			attributes: true,
			// @ts-expect-error
			value: true,
		};

		expect(obj).toBeDefined();
	});
});
