import type { DesignTokenStyles } from '../../entry-points/css-type-schema.codegen';
import type { AttributeSchema, ValueSchema } from '../../types';

describe('schema types', () => {
	it('limits inset tokens to uniform padding', () => {
		const inset = 'var(--ds-space-inset-medium)' as const;
		const styles: Partial<DesignTokenStyles> = {
			padding: inset,
			// @ts-expect-error Inset tokens must not be used for directional padding.
			paddingInline: inset,
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

	it('limits gap tokens to gap, rowGap, and columnGap', () => {
		const gap = 'var(--ds-space-gap-medium)' as const;
		const styles: Partial<DesignTokenStyles> = {
			gap,
			rowGap: gap,
			columnGap: gap,
			// @ts-expect-error Gap tokens must not be used for padding.
			padding: gap,
			// @ts-expect-error Gap tokens must not be used for margin.
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
