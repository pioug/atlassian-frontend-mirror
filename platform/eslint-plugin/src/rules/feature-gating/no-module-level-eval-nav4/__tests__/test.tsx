import outdent from 'outdent';
import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../index';

tester.run('feature-flags/no-module-level-eval', rule, {
	valid: [
		{
			name: 'Variable declaration within arrow function',
			code: outdent`
                import { getWillShowNav4 } from '@atlassian/jira-navigation-apps-sidebar-nav4-rollout';

                const Component = () => {
                    const ff1 = getWillShowNav4();
                }
            `,
		},
		{
			name: 'Boolean within arrow function',
			code: outdent`
                import { getWillShowNav4 } from '@atlassian/jira-navigation-apps-sidebar-nav4-rollout';

                const someFunction = () => {
                    if(getWillShowNav4()) {
                        return true;
                    }
                }
            `,
		},
		{
			name: 'Immediate call within a function',
			code: outdent`
                import { getWillShowNav4 } from '@atlassian/jira-navigation-apps-sidebar-nav4-rollout';

                function someFunction() {
                    return getWillShowNav4();
                }
            `,
		},

		{
			name: 'Does not affect other function calls in global scope',
			code: outdent`
                import { foo } from 'foo-lib'
                import { getWillShowNav4 } from '@atlassian/jira-navigation-apps-sidebar-nav4-rollout';

                foo();
            `,
		},
		{
			name: 'Variable declaration within an arrow function with different import source',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging-using-meta';

                const Component = () => {
                    const ff1 = getWillShowNav4();
                }
            `,
		},
		{
			name: 'Class field',
			code: outdent`
                import { getWillShowNav4 } from '@atlassian/jira-navigation-apps-sidebar-nav4-rollout';

                export class Component {
                    value = getWillShowNav4() ? 'newValue' : 'oldValue';
                }
            `,
		},
	],
	invalid: [
		{
			name: 'Immediate call',
			code: outdent`
                import { getWillShowNav4 } from '@atlassian/jira-navigation-apps-sidebar-nav4-rollout';

                getWillShowNav4();
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		{
			name: 'Immediate call isVisualRefreshEnabled',
			code: outdent`
				import { isVisualRefreshEnabled } from '@atlassian/jira-visual-refresh-rollout/src/feature-switch';

                isVisualRefreshEnabled();
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		{
			name: 'Module level storage into a variable',
			code: outdent`
                import { getWillShowNav4 } from '@atlassian/jira-navigation-apps-sidebar-nav4-rollout';

                const flag = getWillShowNav4();
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		{
			name: 'Module level collection',
			code: outdent`
                import { getWillShowNav4 } from '@atlassian/jira-navigation-apps-sidebar-nav4-rollout';

                const collection = [getWillShowNav4() ? 0 : 1];
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		{
			name: 'Module level object',
			code: outdent`
                import { getWillShowNav4 } from '@atlassian/jira-navigation-apps-sidebar-nav4-rollout';

                const object = {
                    isEnabled: getWillShowNav4()
                }
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		{
			name: 'Module level with boolean',
			code: outdent`
                import { getWillShowNav4 } from '@atlassian/jira-navigation-apps-sidebar-nav4-rollout';
                import { NewComp } from 'new';
                import { OldComp } from 'old';

                export const Component = getWillShowNav4() ? NewComp : OldComp;
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
	],
});
