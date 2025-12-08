import outdent from 'outdent';
import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../index';

const errors = [{ messageId: 'FFLiteral' }];
const options = ['ssOnly'];

tester.run('feature-flags/static-feature-flags', rule, {
	valid: [
		{
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';

                const isEnabled = ff('is.enabled');
            `,
		},
		{
			code: outdent`
                import { getFeatureFlagClient } from '@atlassian/jira-feature-flagging';

                const FLAG_NAME = 'flag';
                const isEnabled = getFeatureFlagClient().getBooleanValue(FLAG_NAME);
            `,
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                const isEnabled = fg('fg_enabled');
            `,
		},
		{
			code: outdent`
                import { componentWithFF } from '@atlassian/jira-feature-flagging-utils';

                export const Component = componentWithFF('is_redesign', NewComponent, OldComponent);
            `,
		},
		{
			name: 'When using ssOnly option, Launch Darkly functions can avoid static usage',
			options,
			code: outdent`
            import { ff, getFeatureFlagValue } from '@atlassian/jira-feature-flagging';
            import { fg } from '@atlassian/jira-feature-gating';
            import { componentWithFF } from '@atlassian/jira-feature-flagging-utils';

            const FLAG_NAME = 'flag';

            const isEnabled = ff(FLAG_NAME);
            const FFValue = getFeatureFlagValue(FLAG_NAME, 10);
            const Component = componentWithFF(FLAG_NAME, NewComponent, OldComponent);
        `,
		},
	],
	invalid: [
		{
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';

                const FLAG_NAME = 'flag';
                const isEnabled = ff(FLAG_NAME);
            `,
			output: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';

                const FLAG_NAME = 'flag';
                const isEnabled = ff('flag');
            `,
			errors,
		},
		{
			code: outdent`
                import { FLAG_NAME } from 'names';
                import { ff } from '@atlassian/jira-feature-flagging';

                const isEnabled = ff(FLAG_NAME);
            `,
			errors,
		},
		{
			code: outdent`
                import { FLAG_NAME } from 'names';
                import { fg } from '@atlassian/jira-feature-gating';

                const isEnabled = fg(FLAG_NAME);
            `,
			errors,
		},
		{
			code: outdent`
                import { FLAG_NAME } from 'names';
                import { expVal } from '@atlassian/jira-feature-experiments';

                const isEnabled = expVal(FLAG_NAME, 'my_param', 'my_default_value');
            `,
			errors,
		},
		{
			code: outdent`
                import { FLAG_NAME } from 'names';
                import { UNSAFE_noExposureExp } from '@atlassian/jira-feature-experiments';

                const isEnabled = UNSAFE_noExposureExp(FLAG_NAME, 'my_param', 'my_default_value');
            `,
			errors,
		},
		{
			code: outdent`
                import { FLAG_NAME } from 'names';
                import { componentWithFF } from '@atlassian/jira-feature-flagging-utils';

                export const Component = componentWithFF(FLAG_NAME, NewComponent, OldComponent);
            `,
			errors,
		},
		{
			name: 'When using ssOnly option, Statsig functions should be static',
			options,
			code: outdent`
            import { fg } from '@atlassian/jira-feature-gating';

            const FLAG_NAME = 'flag';
            const isEnabled2 = fg(FLAG_NAME);
        `,
			output: outdent`
            import { fg } from '@atlassian/jira-feature-gating';

            const FLAG_NAME = 'flag';
            const isEnabled2 = fg('flag');
        `,
			errors,
		},
	],
});
