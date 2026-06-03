import outdent from 'outdent';
import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../index';

tester.run('feature-gating/no-unsafe-no-exposure', rule, {
	valid: [
		{
			name: 'expVal from @adminhub/feature-experimenting is allowed',
			code: outdent`
				import { expVal } from '@adminhub/feature-experimenting';

				const value = expVal('my_experiment', 'variant', 'control');
			`,
		},
		{
			name: 'expValEquals from @adminhub/feature-experimenting is allowed',
			code: outdent`
				import { expValEquals } from '@adminhub/feature-experimenting';

				const isEnabled = expValEquals('my_experiment', 'variant', 'enabled');
			`,
		},
		{
			name: 'UNSAFE_noExposureExp from an unrecognised source is not flagged',
			code: outdent`
				import { UNSAFE_noExposureExp } from 'some-other-library';

				const value = UNSAFE_noExposureExp('my_experiment', 'variant', 'control');
			`,
		},
		{
			name: 'expVal from @atlassian/jira-feature-experiments is allowed',
			code: outdent`
				import { expVal } from '@atlassian/jira-feature-experiments';

				const value = expVal('my_experiment', 'variant', 'control');
			`,
		},
	],
	invalid: [
		{
			name: 'UNSAFE_noExposureExp from @adminhub/feature-experimenting is warned',
			code: outdent`
				import { UNSAFE_noExposureExp } from '@adminhub/feature-experimenting';

				const value = UNSAFE_noExposureExp('my_experiment', 'variant', 'control');
			`,
			errors: [{ messageId: 'unsafeUsage' }],
		},
		{
			name: 'UNSAFE_noExposureExp from @atlassian/jira-feature-experiments is warned',
			code: outdent`
				import { UNSAFE_noExposureExp } from '@atlassian/jira-feature-experiments';

				const value = UNSAFE_noExposureExp('my_experiment', 'variant', 'control');
			`,
			errors: [{ messageId: 'unsafeUsage' }],
		},
	],
});
