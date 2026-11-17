/**
 * Catalog-side guarantee that v0.9 schemas preserve every declared prop on
 * parse. End-to-end proof lives in `a2ui-renderer-next/src/v0_9/__tests__/`.
 */

import {
	ButtonSchema,
	CardBodySchema,
	CardContentSchema,
	CardDescriptionSchema,
	CardFooterSchema,
	CardHeaderSchema,
	CardLeadingSchema,
	CardMediaSchema,
	CardPrimaryContentSchema,
	CardSchema,
	CardTitleSchema,
	CheckBoxSchema,
	CodeDiffSchema,
	ColumnSchema,
	FieldSchema,
	FormFooterSchema,
	FormHeaderSchema,
	FormSchema,
	FormSectionSchema,
	RowSchema,
	TextSchema,
} from '../schemas';

describe('v0.9 ADS catalog schemas', () => {
	it('Button schema preserves variant/disabled/loading after parse', () => {
		const input = {
			child: 'lbl',
			action: { event: { name: 'submit' } },
			variant: 'primary' as const,
			disabled: true,
			loading: false,
		};

		const parsed = ButtonSchema.parse(input);

		expect(parsed.variant).toBe('primary');
		expect(parsed.disabled).toBe(true);
		expect(parsed.loading).toBe(false);
	});

	it('Button schema accepts every ADS appearance value for `variant`', () => {
		for (const variant of [
			'default',
			'danger',
			'primary',
			'subtle',
			'warning',
			'discovery',
		] as const) {
			const parsed = ButtonSchema.parse({
				child: 'lbl',
				action: { event: { name: 'click' } },
				variant,
			});
			expect(parsed.variant).toBe(variant);
		}
	});

	it('Button schema rejects spec-only / non-ADS variant values', () => {
		// `borderless` is in the v0.9 basic-catalog spec but NOT in
		// `@atlaskit/button/new` ButtonAppearance — must reject.
		expect(() =>
			ButtonSchema.parse({
				child: 'lbl',
				action: { event: { name: 'x' } },
				variant: 'borderless',
			}),
		).toThrow();
		// Old v0.8-era values that used to be on this schema must reject.
		expect(() =>
			ButtonSchema.parse({
				child: 'lbl',
				action: { event: { name: 'x' } },
				variant: 'subtle-link',
			}),
		).toThrow();
		expect(() =>
			ButtonSchema.parse({
				child: 'lbl',
				action: { event: { name: 'x' } },
				variant: 'link',
			}),
		).toThrow();
	});

	it('Button schema rejects truly invalid input rather than silently coercing', () => {
		expect(() => ButtonSchema.parse({ child: 'lbl' })).toThrow();
	});

	it('Text/Row/Column parse with their declared shapes', () => {
		// DSP-25080: v0.9 basic catalog renames the v0.8 `usageHint` prop to
		// `variant` (same value set: h1-h5 | body | caption).
		expect(TextSchema.parse({ text: 'hello', variant: 'h2' })).toMatchObject({
			text: 'hello',
			variant: 'h2',
		});
		expect(RowSchema.parse({ children: ['a', 'b'], gap: 8 })).toMatchObject({
			children: ['a', 'b'],
			gap: 8,
		});
		expect(ColumnSchema.parse({ children: ['a', 'b'] })).toMatchObject({
			children: ['a', 'b'],
		});
	});

	it('TextSchema rejects unknown `variant` values', () => {
		expect(() => TextSchema.parse({ text: 'x', variant: 'h6' })).toThrow();
		expect(() => TextSchema.parse({ text: 'x', variant: 'strong' })).toThrow();
	});

	it('TextSchema accepts `text` with no `variant` (defaults handled by adapter)', () => {
		expect(TextSchema.parse({ text: 'just words' })).toMatchObject({ text: 'just words' });
	});

	it('TextSchema accepts a `{ path }` data-model binding for `text` to not render `[Object object]`', () => {
		expect(TextSchema.parse({ text: { path: '/inputValue' }, variant: 'body' })).toMatchObject({
			text: { path: '/inputValue' },
			variant: 'body',
		});
	});

	describe('CheckBoxSchema', () => {
		it('accepts a `{ path }` data binding for `value`', () => {
			const parsed = CheckBoxSchema.parse({
				value: { path: '/form/agreed' },
				label: 'I agree',
			});
			expect(parsed.value).toEqual({ path: '/form/agreed' });
		});

		it('accepts a literal boolean for `value` (read-only checkbox)', () => {
			expect(CheckBoxSchema.parse({ value: true })).toMatchObject({ value: true });
			expect(CheckBoxSchema.parse({ value: false })).toMatchObject({ value: false });
		});

		it('rejects missing `value`', () => {
			expect(() => CheckBoxSchema.parse({ label: 'orphan' })).toThrow();
		});

		it('preserves `disabled`/`indeterminate`/`invalid` and `onChange`', () => {
			const parsed = CheckBoxSchema.parse({
				value: false,
				disabled: true,
				indeterminate: true,
				invalid: true,
				onChange: { event: { name: 'toggled' } },
			});
			expect(parsed.disabled).toBe(true);
			expect(parsed.indeterminate).toBe(true);
			expect(parsed.invalid).toBe(true);
			expect(parsed.onChange).toEqual({ event: { name: 'toggled' } });
		});
	});

	describe('CardSchema', () => {
		it('requires a `children` array of slot ids', () => {
			expect(CardSchema.parse({ children: ['content'] })).toMatchObject({ children: ['content'] });
			expect(() => CardSchema.parse({})).toThrow();
		});

		it('accepts ADS Card appearance and spacing values', () => {
			for (const appearance of ['flat', 'raised'] as const) {
				expect(CardSchema.parse({ children: ['x'], appearance })).toMatchObject({ appearance });
			}
			for (const spacing of ['comfy', 'compact'] as const) {
				expect(CardSchema.parse({ children: ['x'], spacing })).toMatchObject({ spacing });
			}
		});

		it('preserves selected/disabled bindings and onClick action', () => {
			const parsed = CardSchema.parse({
				children: ['x'],
				isSelected: { path: '/card/selected' },
				isDisabled: false,
				onClick: { event: { name: 'card-clicked' } },
			});

			expect(parsed.isSelected).toEqual({ path: '/card/selected' });
			expect(parsed.isDisabled).toBe(false);
			expect(parsed.onClick).toEqual({ event: { name: 'card-clicked' } });
		});

		it('rejects invalid ADS Card enum values and strips old Box-style props', () => {
			expect(() => CardSchema.parse({ children: ['x'], appearance: 'subtle' })).toThrow();
			expect(() => CardSchema.parse({ children: ['x'], spacing: 'dense' })).toThrow();
			expect(CardSchema.parse({ children: ['x'], padding: 'lg' })).not.toHaveProperty('padding');
			expect(CardSchema.parse({ children: ['x'], elevation: 'high' })).not.toHaveProperty(
				'elevation',
			);
			expect(CardSchema.parse({ children: ['x'], hasFocusRing: true })).not.toHaveProperty(
				'hasFocusRing',
			);
		});
	});

	describe('Card family slot schemas', () => {
		it('CardMedia: requires child, accepts position', () => {
			expect(CardMediaSchema.parse({ child: 'm' })).toMatchObject({ child: 'm' });
			expect(() => CardMediaSchema.parse({})).toThrow();
			for (const position of ['top', 'bottom'] as const) {
				expect(CardMediaSchema.parse({ child: 'm', position })).toMatchObject({ position });
			}
			expect(() => CardMediaSchema.parse({ child: 'm', position: 'left' })).toThrow();
		});

		it('CardContent / CardPrimaryContent: require children array', () => {
			expect(CardContentSchema.parse({ children: ['a', 'b'] })).toMatchObject({
				children: ['a', 'b'],
			});
			expect(() => CardContentSchema.parse({})).toThrow();
			expect(CardPrimaryContentSchema.parse({ children: ['h'] })).toMatchObject({
				children: ['h'],
			});
			expect(() => CardPrimaryContentSchema.parse({})).toThrow();
		});

		it('CardLeading / CardBody / CardFooter: require a single child', () => {
			expect(CardLeadingSchema.parse({ child: 'avatar' })).toMatchObject({ child: 'avatar' });
			expect(CardBodySchema.parse({ child: 'body' })).toMatchObject({ child: 'body' });
			expect(CardFooterSchema.parse({ child: 'footer' })).toMatchObject({ child: 'footer' });
			expect(() => CardLeadingSchema.parse({})).toThrow();
			expect(() => CardBodySchema.parse({})).toThrow();
			expect(() => CardFooterSchema.parse({})).toThrow();
		});

		it('CardHeader: requires children, accepts optional leading id', () => {
			expect(CardHeaderSchema.parse({ children: ['t'] })).toMatchObject({ children: ['t'] });
			expect(CardHeaderSchema.parse({ children: ['t'], leading: 'avatar' })).toMatchObject({
				leading: 'avatar',
			});
			expect(() => CardHeaderSchema.parse({})).toThrow();
		});

		it('CardTitle: requires text, accepts `as`', () => {
			expect(CardTitleSchema.parse({ text: 'Title' })).toMatchObject({ text: 'Title' });
			for (const as of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'] as const) {
				expect(CardTitleSchema.parse({ text: 'T', as })).toMatchObject({ as });
			}
			expect(() => CardTitleSchema.parse({ text: 'T', as: 'h7' })).toThrow();
			expect(() => CardTitleSchema.parse({})).toThrow();
		});

		it('CardDescription: requires text', () => {
			expect(CardDescriptionSchema.parse({ text: 'Desc' })).toMatchObject({ text: 'Desc' });
			expect(() => CardDescriptionSchema.parse({})).toThrow();
		});
	});

	describe('CodeDiffSchema', () => {
		const baseCodeDiff = {
			files: [
				{
					path: 'jira/plans/src/board-card.tsx',
					changeType: 'modified' as const,
					patch:
						'diff --git a/jira/plans/src/board-card.tsx b/jira/plans/src/board-card.tsx\n--- a/jira/plans/src/board-card.tsx\n+++ b/jira/plans/src/board-card.tsx',
				},
			],
		};

		it('accepts full mode file controls metadata', () => {
			expect(
				CodeDiffSchema.parse({
					...baseCodeDiff,
					files: [
						{
							...baseCodeDiff.files[0],
							updatedAt: '2026-08-19T00:00:00.000Z',
						},
					],
					commits: [
						{
							id: 'commit-1',
							label: 'Commit one',
							message: 'Improve diff controls',
							sha: 'abcdef123456',
							authoredAt: '2026-08-19T01:00:00.000Z',
							filePaths: ['jira/plans/src/board-card.tsx'],
						},
					],
					annotations: {
						'jira/plans/src/board-card.tsx': [
							{
								side: 'additions',
								line: 1,
								content: 'Looks good',
								createdAt: '2026-08-20T00:00:00.000Z',
							},
						],
					},
					onSearchFiles: { event: { name: 'codeDiff.searchFiles' } },
					onSelectCommit: { event: { name: 'codeDiff.selectCommit' } },
					onChangeFileSort: { event: { name: 'codeDiff.changeFileSort' } },
				}),
			).toMatchObject({
				commits: [{ id: 'commit-1', filePaths: ['jira/plans/src/board-card.tsx'] }],
			});
		});

		it('requires annotation lines to be 1-based', () => {
			expect(
				CodeDiffSchema.parse({
					...baseCodeDiff,
					annotations: {
						'jira/plans/src/board-card.tsx': [
							{ side: 'additions', line: 1, content: 'Looks good' },
						],
					},
				}),
			).toMatchObject({
				annotations: {
					'jira/plans/src/board-card.tsx': [{ line: 1 }],
				},
			});

			expect(() =>
				CodeDiffSchema.parse({
					...baseCodeDiff,
					annotations: {
						'jira/plans/src/board-card.tsx': [
							{ side: 'additions', line: 0, content: 'Invalid line' },
						],
					},
				}),
			).toThrow();
		});
	});

	// ── Form-family schemas (generated from schema.test.ts.tmpl) ──────

	describe('FormSchema', () => {
		it('parses a minimal valid instance', () => {
			expect(FormSchema.parse({ children: ['a'] })).toMatchObject({ children: ['a'] });
		});

		// Density was removed 2026-06-01 — AK Form has no equivalent.
		// See registry.md log entry. Do NOT reintroduce.

		it('accepts an aria-label via `label`', () => {
			expect(FormSchema.parse({ children: ['a'], label: 'My form' })).toMatchObject({
				label: 'My form',
			});
		});

		it('rejects missing required fields', () => {
			expect(() => FormSchema.parse({})).toThrow();
		});

		it('rejects invalid density values (density removed 2026-06-01 — extra keys fail strict-parse only; we are passthrough so this just doc-tests that "density" is now ignored)', () => {
			// Passthrough schema: unknown keys aren't rejected, just dropped.
			const parsed = FormSchema.parse({ children: ['a'], density: 'huge' } as unknown as Parameters<
				typeof FormSchema.parse
			>[0]);
			expect(parsed).not.toHaveProperty('density');
		});
	});

	describe('FieldSchema', () => {
		it('parses a minimal valid instance', () => {
			expect(FieldSchema.parse({ child: 'in' })).toMatchObject({ child: 'in' });
		});

		it('preserves label / helpText / errorMessage / validMessage / required', () => {
			const parsed = FieldSchema.parse({
				child: 'in',
				label: 'Email',
				helpText: 'We never share.',
				errorMessage: 'Invalid email',
				validMessage: 'Looks good',
				required: true,
			});
			expect(parsed.label).toBe('Email');
			expect(parsed.helpText).toBe('We never share.');
			expect(parsed.errorMessage).toBe('Invalid email');
			expect(parsed.validMessage).toBe('Looks good');
			expect(parsed.required).toBe(true);
		});

		it('accepts `{ path }` bindings for dynamic strings', () => {
			const parsed = FieldSchema.parse({
				child: 'in',
				label: { path: '/labels/email' },
				errorMessage: { path: '/errors/email' },
			});
			expect(parsed.label).toEqual({ path: '/labels/email' });
			expect(parsed.errorMessage).toEqual({ path: '/errors/email' });
		});

		it('rejects missing required fields', () => {
			expect(() => FieldSchema.parse({})).toThrow();
		});
	});

	describe('FormSectionSchema', () => {
		it('parses a minimal valid instance', () => {
			expect(FormSectionSchema.parse({ children: ['a'] })).toMatchObject({ children: ['a'] });
		});

		it('preserves title / description', () => {
			const parsed = FormSectionSchema.parse({
				children: ['a', 'b'],
				title: 'About you',
				description: 'Tell us more',
			});
			expect(parsed.title).toBe('About you');
			expect(parsed.description).toBe('Tell us more');
		});

		it('rejects missing required fields', () => {
			expect(() => FormSectionSchema.parse({})).toThrow();
		});
	});

	describe('FormHeaderSchema', () => {
		it('parses a minimal valid instance (all fields optional)', () => {
			expect(FormHeaderSchema.parse({})).toMatchObject({});
		});

		it('preserves title / description / children', () => {
			const parsed = FormHeaderSchema.parse({
				title: 'Sign up',
				description: 'Create your account',
				children: ['banner'],
			});
			expect(parsed.title).toBe('Sign up');
			expect(parsed.description).toBe('Create your account');
			expect(parsed.children).toEqual(['banner']);
		});
	});

	describe('FormFooterSchema', () => {
		it('parses a minimal valid instance', () => {
			expect(FormFooterSchema.parse({ children: ['submit'] })).toMatchObject({
				children: ['submit'],
			});
		});

		it('accepts every align value', () => {
			for (const align of ['start', 'end'] as const) {
				expect(FormFooterSchema.parse({ children: ['x'], align })).toMatchObject({ align });
			}
		});

		it('rejects missing required fields', () => {
			expect(() => FormFooterSchema.parse({})).toThrow();
		});

		it('rejects invalid align values', () => {
			expect(() => FormFooterSchema.parse({ children: ['x'], align: 'center' })).toThrow();
		});
	});
});
