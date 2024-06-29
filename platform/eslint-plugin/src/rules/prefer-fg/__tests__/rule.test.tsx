import outdent from 'outdent';
import { tester } from '../../../__tests__/utils/_tester';
import rule from '../index';

const errors = [{ messageId: 'autoFixImports' }, { messageId: 'preferFG' }];

tester.run('feature-flags/prefer-fg', rule, {
	valid: [
		{
			code: outdent`
                import { getFeatureFlagValue } from '@atlassian/jira-feature-flagging';

                const ffVal = getFeatureFlagValue('get.value', '');
            `,
		},
		{
			code: outdent`
                import { getFeatureFlagValue } from '@atlassian/jira-feature-flagging';

                const ffVal = getFeatureFlagValue('get.value', {});
            `,
		},
		{
			code: outdent`
                import { getFeatureFlagValue } from '@atlassian/jira-feature-flagging-using-meta';

                const ffVal = getFeatureFlagValue('get.value', 0);
            `,
		},
		{
			code: outdent`
                import { getFeatureFlagValue } from '@atlassian/jira-feature-flagging-using-meta';

                const isEnabled = getFeatureFlagValue('is.enabled', true);
            `,
		},
		{
			code: outdent`
                import { getFeatureFlagValue, getFeatureFlagClient } from '@atlassian/jira-feature-flagging-using-meta';

                const ffVal = getFeatureFlagValue('get.value', {});
                const newVal = getFeatureFlagClient().getFlagEvaluation('get.value', {});
            `,
		},
		{
			code: outdent`
                import { getFeatureFlagValue } from 'thirdparty';

                const isEnabled = getFeatureFlagValue('is.enabled', false);
            `,
		},
	],
	invalid: [
		{
			code: outdent`
                import { getBooleanFF, fg } from '@atlaskit/platform-feature-flags';

                const isCorrect = fg('is.correct');
                const isAlsoEnabled = getBooleanFF('is.also.enabled', false);
            `,
			output: outdent`
                import { fg } from '@atlaskit/platform-feature-flags';

                const isCorrect = fg('is.correct');
                const isAlsoEnabled = fg('is.also.enabled');
            `,
			errors,
		},
		{
			code: outdent`
                import { getBooleanFF } from '@atlaskit/platform-feature-flags';

                const isEnabled = getBooleanFF('is.enabled', false);
            `,
			output: outdent`
                import { fg } from '@atlaskit/platform-feature-flags';

                const isEnabled = fg('is.enabled');
            `,
			errors: [{ messageId: 'autoFixImports' }, { messageId: 'preferFG' }],
		},
	],
});
