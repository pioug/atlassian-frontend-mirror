import outdent from 'outdent';
import { tester } from '../../../__tests__/utils/_tester';
import rule from '../index';

tester.run('feature-flags/no-alias', rule, {
	valid: [
		{
			name: '`@atlassian/jira-feature-flagging` imports are not aliased',
			code: outdent`
                import { ff, ffVal } from '@atlassian/jira-feature-flagging';
            `,
		},
		{
			name: '`@atlassian/jira-feature-flagging-utils` imports are not aliased',
			code: outdent`
                import { componentWithFF } from '@atlassian/jira-feature-flagging-utils';
            `,
		},
		{
			name: '`@atlassian/jira-feature-gating` imports are not aliased',
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';
            `,
		},
		{
			name: '`@atlassian/jira-feature-gates-test-mocks` imports are not aliased',
			code: outdent`
                import { passGate } from '@atlassian/jira-feature-gates-test-mocks';
            `,
		},
		{
			name: '`@atlassian/jira-feature-gates-storybook-mocks` imports are not aliased',
			code: outdent`
                import { withGate } from '@atlassian/jira-feature-gates-storybook-mocks';
            `,
		},
		{
			name: 'Aliases for non related imports are allowed',
			code: outdent`
                import { memo as m } from 'react';
                import * as r from 'redux';
            `,
		},
	],
	invalid: [
		{
			name: 'Do not alias utils',
			code: outdent`
                import { ff as getBoolean } from '@atlassian/jira-feature-flagging';
            `,
			errors: [{ messageId: 'noSpecifierAlias' }],
		},
		{
			name: 'Do not alias multiple utils',
			code: outdent`
                import { ff as getBoolean, ffVal as getFeatureFlagValue } from '@atlassian/jira-feature-flagging';
            `,
			errors: [{ messageId: 'noSpecifierAlias' }, { messageId: 'noSpecifierAlias' }],
		},
		{
			name: 'Do not allow namespace imports',
			code: outdent`
                import * as ffUtils from '@atlassian/jira-feature-flagging';
            `,
			errors: [{ messageId: 'noNamespaceSpecifier' }],
		},
		{
			name: 'Do not reassign utils',
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';
                const aliasedFG = fg;
            `,
			errors: [{ messageId: 'noReassignment' }],
		},
	],
});
