import outdent from 'outdent';
import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../index';

tester.run('feature-flags/no-preconditioning', rule, {
	valid: [
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                if (preCheck && fg('gate')) {}
            `,
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                if (preCheck1 && preCheck2 && fg('gate')) {}
            `,
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                const value = fg('gate') && 'value';
            `,
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                const value = preCheck && fg('gate') ? 'value' : '';
            `,
		},
		{
			code: outdent`
                import { expVal } from '@atlassian/jira-feature-experiments';

                if (expVal('one') && expVal('two') ) {}
            `,
		},
		{
			code: outdent`
                import { expVal, expValEquals } from '@atlassian/jira-feature-experiments';

                if (expVal('one') && expValEquals('two', 'value') ) {}
            `,
		},
		{
			code: outdent`
                import { expVal } from '@atlassian/jira-feature-experiments';

                if (expVal('one') || expVal('two') ) {}
            `,
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                if (preGate && fg('one') || preGate && fg('two') ) {}
            `,
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                if (count > 0 && fg('my_gate') ) {}
            `,
		},
	],
	invalid: [
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                if (fg('one') && fg('two')) {}
            `,
			errors: [{ messageId: 'useConfig' }],
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';
                import { expVal } from '@atlassian/jira-feature-experiments';

                if (expVal('one') && fg('two')) {}
            `,
			errors: [{ messageId: 'useConfig' }],
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';
                import { expVal } from '@atlassian/jira-feature-experiments';

                if (fg('one') && fg('two') && expVal('three')) {}
            `,
			errors: [{ messageId: 'useConfig' }],
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                if (preCheck && fg('one') && fg('two')) {}
            `,
			errors: [{ messageId: 'useConfig' }],
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';
                import { expVal } from '@atlassian/jira-feature-experiments';

                if (fg('my_gate') && expVal('my_exp', 'cohort', 'not-enrolled') === 'variation') {}
            `,
			errors: [{ messageId: 'useConfig' }],
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                const value = fg('one') && preCheck && fg('two') ? 'value' : '';
            `,
			errors: [{ messageId: 'incorrectExposure' }],
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                if (fg('gate') && isAdmin) {}
            `,
			errors: [{ messageId: 'incorrectExposure' }],
		},
		{
			code: outdent`
                import { expVal } from '@atlassian/jira-feature-experiments';

                if (expVal('exp') && isAdmin) {}
            `,
			errors: [{ messageId: 'incorrectExposure' }],
		},
		{
			code: outdent`
                import { expValEquals } from '@atlassian/jira-feature-experiments';

                if (expValEquals('exp', 'value') && isAdmin) {}
            `,
			errors: [{ messageId: 'incorrectExposure' }],
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                if (fg('one') && fg('two') && isAdmin) {}
            `,
			errors: [{ messageId: 'incorrectExposure' }, { messageId: 'useConfig' }],
		},
		{
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                if (preGate && fg('one') || fg('two') && preGate ) {}
            `,
			errors: [{ messageId: 'incorrectExposure' }],
		},
	],
});
