import { tester } from '../../__tests__/utils/_tester';
import rule, { name } from '../index';

tester.run(name, rule, {
	valid: [
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
				const snapshot = expect(value)['toMatch' + 'Snapshot'];
			`,
		},
		{
			name: 'other methods on expect are allowed',
			code: `
				expect(value)['toMatch' + 'Snapshot' + 'Helper']();
			`,
		},
	],
	invalid: [
		{
			name: 'expect().toMatchInlineSnapshot() is disallowed',
			code: `
				expect(container)['toMatch' + 'InlineSnapshot'](\`<div>test</div>\`);
			`,
			errors: [
				{
					messageId: 'avoidSnapshots',
				},
			],
		},
		{
			name: 'expect().toMatchSnapshot() without arguments',
			code: `
				expect(container)['toMatch' + 'Snapshot']();
			`,
			errors: [
				{
					messageId: 'avoidSnapshots',
				},
			],
		},
		{
			name: 'expect().toMatchSnapshot() with string argument',
			code: `
				expect(container)['toMatch' + 'Snapshot']('snapshot-name');
			`,
			errors: [
				{
					messageId: 'avoidSnapshots',
				},
			],
		},
		{
			name: 'expect().toMatchSnapshot() in test block',
			code: `
				it('should match snapshot', () => {
					expect(container)['toMatch' + 'Snapshot']();
				});
			`,
			errors: [
				{
					messageId: 'avoidSnapshots',
				},
			],
		},
		{
			name: 'expect().toMatchSnapshot() with complex expression',
			code: `
				expect(screen.getByTestId('test'))['toMatch' + 'Snapshot']();
			`,
			errors: [
				{
					messageId: 'avoidSnapshots',
				},
			],
		},
		{
			name: 'multiple toMatchSnapshot calls',
			code: `
				expect(container1)['toMatch' + 'Snapshot']();
				expect(container2)['toMatch' + 'Snapshot']();
			`,
			errors: [
				{
					messageId: 'avoidSnapshots',
				},
				{
					messageId: 'avoidSnapshots',
				},
			],
		},
	],
});
