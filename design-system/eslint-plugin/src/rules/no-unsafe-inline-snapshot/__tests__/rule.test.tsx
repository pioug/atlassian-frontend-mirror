import { tester } from '../../__tests__/utils/_tester';
import rule, { name } from '../index';

tester.run(name, rule, {
	valid: [
		{
			name: 'small snapshot without internal details',
			code: `
				expect(container).toMatchInlineSnapshot(\`<div>test</div>\`);
			`,
		},
		{
			name: 'snapshot with REDACTED className',
			code: `
				expect(container).toMatchInlineSnapshot(\`<div className="REDACTED">test</div>\`);
			`,
		},
		{
			name: 'snapshot with REDACTED style',
			code: `
				expect(container).toMatchInlineSnapshot(\`<div style="REDACTED">test</div>\`);
			`,
		},
		{
			name: 'snapshot with style block containing REDACTED',
			code: `
				expect(container).toMatchInlineSnapshot(\`
					<div>
						<style>REDACTED</style>
					</div>
				\`);
			`,
		},
		{
			name: 'snapshot with multiple REDACTED values',
			code: `
				expect(container).toMatchInlineSnapshot(\`
					<div className="REDACTED" style="REDACTED">
						<span>test</span>
					</div>
				\`);
			`,
		},
		{
			name: 'snapshot under 100 lines',
			code: `
				expect(container).toMatchInlineSnapshot(\`
					${Array(50).fill('<div>line</div>').join('\n')}
				\`);
			`,
		},
		{
			name: 'other expect matchers are allowed',
			code: `
				expect(value).toBe(true);
				expect(value).toMatchSnapshot();
			`,
		},
	],
	invalid: [
		{
			name: 'snapshot exceeding 100 lines',
			code: `
				expect(container).toMatchInlineSnapshot(\`
					${Array(101).fill('<div>line</div>').join('\n')}
				\`);
			`,
			errors: [
				{
					messageId: 'exceedsMaxLines',
				},
			],
		},
		{
			name: 'snapshot with className attribute',
			code: `
				expect(container).toMatchInlineSnapshot(\`<div className="some-class">test</div>\`);
			`,
			errors: [
				{
					messageId: 'containsInternalDetails',
				},
			],
		},
		{
			name: 'snapshot with style attribute',
			code: `
				expect(container).toMatchInlineSnapshot(\`<div style="color: red">test</div>\`);
			`,
			errors: [
				{
					messageId: 'containsInternalDetails',
				},
			],
		},
		{
			name: 'snapshot with style block',
			code: `
				expect(container).toMatchInlineSnapshot(\`
					<div>
						<style>.test { color: red; }</style>
					</div>
				\`);
			`,
			errors: [
				{
					messageId: 'containsInternalDetails',
				},
			],
		},
		{
			name: 'snapshot with multiple internal details',
			code: `
				expect(container).toMatchInlineSnapshot(\`
					<div className="test-class" style="color: red">
						<span className="another-class">test</span>
					</div>
				\`);
			`,
			errors: [
				{
					messageId: 'containsInternalDetails',
				},
			],
		},
		{
			name: 'snapshot with className and style both not REDACTED',
			code: `
				expect(container).toMatchInlineSnapshot(\`
					<div className="my-class" style="display: block">test</div>
				\`);
			`,
			errors: [
				{
					messageId: 'containsInternalDetails',
				},
			],
		},
		{
			name: 'snapshot with mixed REDACTED and non-REDACTED',
			code: `
				expect(container).toMatchInlineSnapshot(\`
					<div className="REDACTED" style="color: red">test</div>
				\`);
			`,
			errors: [
				{
					messageId: 'containsInternalDetails',
				},
			],
		},
	],
});
