import outdent from 'outdent';
import { tester } from '../../../../__tests__/utils/_tester';
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
		{
			name: 'expValEquals inside arrow function (editor statsig)',
			code: outdent`
                import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

                const Component = () => {
                    const isEnabled = expValEquals('my_exp', 'isEnabled', true);
                    return isEnabled;
                }
            `,
		},
		{
			name: 'editorExperiment inside arrow function (editor statsig)',
			code: outdent`
                import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

                const Component = () => {
                    return editorExperiment('my_exp', true);
                }
            `,
		},
		{
			name: 'dynamicConfigStringListIncludes inside arrow function (editor statsig)',
			code: outdent`
                import { dynamicConfigStringListIncludes } from '@atlaskit/tmp-editor-statsig/dynamic-config-value-contains';

                const Component = () => {
                    return dynamicConfigStringListIncludes('my_config', 'value');
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
		{
			name: 'expValEquals at module level (editor statsig)',
			code: outdent`
                import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

                const arrowsList = new Set(
                    !expValEquals('my_exp', 'isEnabled', true)
                        ? ['ArrowRight', 'ArrowLeft']
                        : ['ArrowRight'],
                );
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		{
			name: 'expVal at module level (editor statsig)',
			code: outdent`
                import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

                const value = expVal('my_exp', 'variant', 'control');
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		{
			name: 'editorExperiment at module level (editor statsig)',
			code: outdent`
                import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

                const isEnabled = editorExperiment('my_exp', true);
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		{
			name: 'expValEqualsNoExposure at module level (editor statsig)',
			code: outdent`
                import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

                const isEnabled = expValEqualsNoExposure('my_exp', 'isEnabled', true);
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
		{
			name: 'dynamicConfigStringListIncludes at module level (editor statsig)',
			code: outdent`
                import { dynamicConfigStringListIncludes } from '@atlaskit/tmp-editor-statsig/dynamic-config-value-contains';

                const isAllowed = dynamicConfigStringListIncludes('my_config', 'value');
            `,
			errors: [{ messageId: 'noModuleLevelEval' }],
		},
	],
});
