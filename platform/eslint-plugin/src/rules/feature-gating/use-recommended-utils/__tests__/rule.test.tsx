import outdent from 'outdent';
import { tester } from '../../../../__tests__/utils/_tester';
import rule from '../index';

tester.run('feature-flags/use-recommended-utils', rule, {
	valid: [
		{
			name: 'Other `FeatureGate` methods are allowed',
			code: outdent`
                import FeatureGates from '@atlaskit/feature-gate-js-client';

                FeatureGates.initialize();
            `,
		},
		{
			name: 'Use `fg` to access gates',
			code: outdent`
                import { fg } from '@atlassian/jira-feature-gating';

                export const Component = () => {
                    return fg('my_gate') ? <HelloWorld /> : null;
                };
            `,
		},
		{
			name: 'Use `expVal` to access experiments',
			code: outdent`
            import { expVal } from '@atlassian/jira-feature-experiments';

            export const getThing = () => {
                if (expVal('my_experiment', 'is_enabled', false)) {
                    return newThing();
                }

                return oldThing();
            };
            `,
		},
	],
	invalid: [
		{
			name: '`checkGate` is not allowed',
			code: outdent`
                import FeatureGates from '@atlaskit/feature-gate-js-client';

                export const Component = () => {
                    return FeatureGates.checkGate('my_gate') ? <HelloWorld /> : null;
                };
            `,
			errors: [
				{
					message:
						'Please do not use FeatureGates.checkGate, use `fg` from `@atlaskit/platform-feature-flags` instead.',
				},
			],
		},
		{
			name: '`getExperimentValue` is not allowed',
			code: outdent`
                import FeatureGates from '@atlaskit/feature-gate-js-client';

                export const getThing = () => {
                    if (FeatureGates.getExperimentValue('my_experiment', 'is_enabled', false)) {
                        return newThing();
                    }

                    return oldThing();
                };
            `,
			errors: [
				{
					message:
						'Experimentation is not suported in platform feature flags, reach out to #help-statsig-switcheroo.',
				},
			],
		},
	],
});
