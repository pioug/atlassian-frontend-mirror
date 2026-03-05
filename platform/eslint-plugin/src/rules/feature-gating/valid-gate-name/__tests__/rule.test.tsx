import outdent from 'outdent';
import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../index';

const errors = [{ messageId: 'invalidGateName' }];

tester.run('feature-gating/valid-gate-name', rule, {
	valid: [
		{
			name: 'lowercase with underscores',
			code: outdent`
				import { fg } from '@atlassian/jira-feature-gating';

				const isEnabled = fg('my_feature_gate');
			`,
		},
		{
			name: 'lowercase with numbers',
			code: outdent`
				import { fg } from '@atlassian/jira-feature-gating';

				const isEnabled = fg('feature123');
			`,
		},
		{
			name: 'numbers and underscores',
			code: outdent`
				import { fg } from '@atlassian/jira-feature-gating';

				const isEnabled = fg('gate_v2_enabled');
			`,
		},
		{
			name: 'single word lowercase',
			code: outdent`
				import { fg } from '@atlassian/jira-feature-gating';

				const isEnabled = fg('enabled');
			`,
		},
		{
			name: 'ff function with valid name',
			code: outdent`
				import { ff } from '@atlassian/jira-feature-flagging';

				const isEnabled = ff('is_enabled');
			`,
		},
		{
			name: 'non-feature-flag function is ignored',
			code: outdent`
				import { someFunction } from 'some-library';

				const result = someFunction('My.Invalid.Name');
			`,
		},
		{
			name: 'fg from non-feature-flag library is ignored',
			code: outdent`
				import { fg } from 'some-other-library';

				const isEnabled = fg('My.Invalid.Name');
			`,
		},
		{
			name: 'non-string literal argument is ignored',
			code: outdent`
				import { fg } from '@atlassian/jira-feature-gating';

				const isEnabled = fg(123);
			`,
		},
		{
			name: 'expVal with valid name',
			code: outdent`
				import { expVal } from '@atlassian/jira-feature-experiments';

				const value = expVal('my_experiment', 'param', 'default');
			`,
		},
		{
			name: 'componentWithFG with valid name',
			code: outdent`
				import { componentWithFG } from '@atlassian/jira-feature-gate-component';

				const Component = componentWithFG('my_gate', NewComponent, OldComponent);
			`,
		},
		{
			name: 'hyphens in gate name',
			code: outdent`
				import { fg } from '@atlassian/jira-feature-gating';

				const isEnabled = fg('my-feature-gate');
			`,
		},
		{
			name: 'mixed underscores and hyphens',
			code: outdent`
				import { fg } from '@atlassian/jira-feature-gating';

				const isEnabled = fg('my_feature-gate_v2');
			`,
		},
		{
			name: 'platform feature flags with dot-separated names',
			code: outdent`
				import { fg } from '@atlaskit/platform-feature-flags';

				const isEnabled = fg('platform.design-system-team.avatar-item-font-size_830x6');
			`,
		},
		{
			name: 'dots in gate name',
			code: outdent`
				import { fg } from '@atlassian/jira-feature-gating';

				const isEnabled = fg('my.feature.gate');
			`,
		},
	],
	invalid: [
		{
			name: 'capital letters in gate name',
			code: outdent`
				import { fg } from '@atlassian/jira-feature-gating';

				const isEnabled = fg('MyFeatureGate');
			`,
			errors,
		},
		{
			name: 'spaces in gate name',
			code: outdent`
				import { fg } from '@atlassian/jira-feature-gating';

				const isEnabled = fg('my feature gate');
			`,
			errors,
		},
		{
			name: 'all uppercase gate name',
			code: outdent`
				import { fg } from '@atlassian/jira-feature-gating';

				const isEnabled = fg('MY_FEATURE_GATE');
			`,
			errors,
		},
		{
			name: 'mixed invalid characters',
			code: outdent`
				import { fg } from '@atlassian/jira-feature-gating';

				const isEnabled = fg('My.Feature-Gate v2');
			`,
			errors,
		},
		{
			name: 'ff function with invalid name',
			code: outdent`
				import { ff } from '@atlassian/jira-feature-flagging';

				const isEnabled = ff('Is.Enabled');
			`,
			errors,
		},
		{
			name: 'expVal with invalid name',
			code: outdent`
				import { expVal } from '@atlassian/jira-feature-experiments';

				const value = expVal('My-Experiment', 'param', 'default');
			`,
			errors,
		},
		{
			name: 'platform feature flags import with invalid name',
			code: outdent`
				import { fg } from '@atlaskit/platform-feature-flags';

				const isEnabled = fg('My-Gate');
			`,
			errors,
		},
		{
			name: 'componentWithFG with invalid name from utility library',
			code: outdent`
				import { componentWithFG } from '@atlassian/jira-feature-gate-component';

				const Component = componentWithFG('My Gate', NewComponent, OldComponent);
			`,
			errors,
		},
	],
});
