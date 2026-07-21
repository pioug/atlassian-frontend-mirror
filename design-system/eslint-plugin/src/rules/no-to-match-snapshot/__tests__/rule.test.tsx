import { tester } from '../../__tests__/utils/_tester';
import rule, { name } from '../index';

tester.run(name, rule, {
	valid: [
		{
			name: 'toMatchInlineSnapshot is allowed',
			code: `
				expect(container).toMatchInlineSnapshot(\`<div>test</div>\`);
			`,
		},
		{
			name: 'other expect matchers are allowed',
			code: `
				expect(value).toBe(true);
				expect(value).toEqual({});
				expect(value).toHaveBeenCalled();
			`,
		},
		{
			name: 'toMatchSnapshot property access without call is ignored',
			code: `
				const snapshot = expect(value).toMatchSnapshot;
			`,
		},
		{
			name: 'other methods on expect are allowed',
			code: `
				expect(value).toMatchSnapshotHelper();
			`,
		},
	],
	invalid: [
		{
			name: 'expect().toMatchSnapshot() without arguments',
			code: `
				expect(container).toMatchSnapshot();
			`,
			errors: [
				{
					messageId: 'useInlineSnapshot',
				},
			],
		},
		{
			name: 'expect().toMatchSnapshot() with string argument',
			code: `
				expect(container).toMatchSnapshot('snapshot-name');
			`,
			errors: [
				{
					messageId: 'useInlineSnapshot',
				},
			],
		},
		{
			name: 'expect().toMatchSnapshot() in test block',
			code: `
				it('should match snapshot', () => {
					expect(container).toMatchSnapshot();
				});
			`,
			errors: [
				{
					messageId: 'useInlineSnapshot',
				},
			],
		},
		{
			name: 'expect().toMatchSnapshot() with complex expression',
			code: `
				expect(screen.getByTestId('test')).toMatchSnapshot();
			`,
			errors: [
				{
					messageId: 'useInlineSnapshot',
				},
			],
		},
		{
			name: 'multiple toMatchSnapshot calls',
			code: `
				expect(container1).toMatchSnapshot();
				expect(container2).toMatchSnapshot();
			`,
			errors: [
				{
					messageId: 'useInlineSnapshot',
				},
				{
					messageId: 'useInlineSnapshot',
				},
			],
		},
	],
});
