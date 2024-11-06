import outdent from 'outdent';
import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../index';

const options = ['ssOnly'];

tester.run('feature-flags/inline-usage', rule, {
	valid: [
		{
			name: 'Valid API usage',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';
                import { fg } from '@atlassian/jira-feature-gating';
                import { expVal, expValEquals } from '@atlassian/jira-feature-experiments';

                export const FFComponent = () => ff('is.enabled') && <>Valid</>;
                export const FGComponent = () => fg('is.enabled') && <>Valid</>;

                export const ExpValComponent = function() {
                    return expVal('is.enabled', 'on', false) && <>Valid</>;
                };

                export function ExpValEqualsComponent() {
                    expValEquals('is.enabled', 'on', true) && <>Valid</>;
                }

                const valid1 = () => {
                    console.log('valid');
                };

                const valid2 = () => 'valid';
            `,
		},
		{
			name: 'When using ssOnly option, ff() can avoid inline-usage',
			options,
			code: outdent`
            import { ff } from '@atlassian/jira-feature-flagging';
            import { fg } from '@atlassian/jira-feature-gating';

            const invalidFF = () => ff('is.enabled');
            export const FGComponent = () => fg('is.enabled') && <>Valid</>;
        `,
		},
		{
			name: 'Edge cases',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';

                function edgeCase1() {
                    console.log('workAround');
                    return ff('is.enabled');
                }

                const edgeCase2 = function() {
                    console.log('workAround');
                    return ff('is.enabled');
                };

                const edgeCase3 = () => {
                    console.log('workAround');
                    return ff('is.enabled');
                };

                const edgeCase4 = () => {
                    ff('is.enabled');
                };
            `,
		},
	],
	invalid: [
		{
			name: 'Invalid API usage',
			code: outdent`
                import { ff } from '@atlassian/jira-feature-flagging';
                import { fg } from '@atlassian/jira-feature-gating';
                import { expVal, expValEquals, UNSAFE_noExposureExp } from '@atlassian/jira-feature-experiments';

                const invalidFF = () => ff('is.enabled');
                const invalidFG = () => fg('is.enabled');
                const invalidExpVal = () => expVal('is.enabled', 'on', false);
                const invalidExpValBinary = () => expVal('is.enabled', 'cohort', null) === 'variation';
                const invalidExpValBinary2 = () => expVal('is.enabled', 'count', 0) >= 0;

                const invalidExpValEquals = function() {
                    return expValEquals('is.enabled', 'on', true);
                };

                function invalidUnsafe() {
                    return UNSAFE_noExposureExp('is.enabled');
                }
            `,
			errors: Array.from(Array(7), () => ({ messageId: 'inlineUsage' })),
		},
		{
			name: 'When using ssOnly option, Statsig functions should be inlined',
			options,
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                const invalidFG = () => fg('is.enabled');
            `,
			errors: [{ messageId: 'inlineUsage' }],
		},
	],
});
