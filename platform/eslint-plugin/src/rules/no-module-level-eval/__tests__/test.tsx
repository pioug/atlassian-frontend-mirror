import outdent from 'outdent';
import { tester } from '../../../__tests__/utils/_tester';
import rule from '../index';

tester.run('feature-flags/no-module-level-eval', rule, {
	valid: [
		{
			name: 'Variable declaration within arrow function',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';

                const Component = () => {
                    const ff1 = ff('flag');
                }
            `,
		},
		{
			name: 'Boolean within arrow function',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';

                const someFunction = () => {
                    if(ff('flag')) {
                        return true;
                    }
                }
            `,
		},
		{
			name: 'Immediate call within a function',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';

                function someFunction() {
                    return ff('flag');
                }
            `,
		},

		{
			name: 'Does not affect other function calls in global scope',
			code: outdent`
                import { foo } from 'foo-lib'
                import { ff } from '@atlassian/jira-feature-flagging';

                foo();
            `,
		},
		{
			name: 'Variable declaration within an arrow function with different import source',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging-using-meta';

                const Component = () => {
                    const ff1 = ff('flag');
                }
            `,
		},
		{
			name: 'Class field',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';

                export class Component {
                    value = ff('flag') ? 'newValue' : 'oldValue';
                }
            `,
		},
	],
	invalid: [
		{
			name: 'Immediate call',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';

                ff('flag');
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		{
			name: 'Module level storage into a variable',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';

                const flag = ff('flag');
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		{
			name: 'Module level collection',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';

                const collection = [ff('flag') ? 0 : 1];
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		{
			name: 'Module level object',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';

                const object = {
                    isEnabled: ff('flag')
                }
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		{
			name: 'Module level with boolean',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';
                import { NewComp } from 'new';
                import { OldComp } from 'old';

                export const Component = ff('flag') ? NewComp : OldComp;
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		// This test fails unsure what the environment difference is between Jira + Platform.
		// {
		// 	name: 'Static class field',
		// 	code: outdent`
		//             import { ff } from '@atlassian/jira-feature-flagging';

		//             export class Component {
		//                 static value = ff('flag') ? 'newValue' : 'oldValue';
		//             }
		//         `,
		// 	errors: [{ messageId: 'noModuleLevelEval' }],
		// },
	],
});
