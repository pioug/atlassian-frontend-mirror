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
		{
			name: 'Named-import call is out of scope (rule only inspects MemberExpression)',
			code: outdent`
                import { checkGate } from '@atlaskit/feature-gate-js-client';

                checkGate('my_gate');
            `,
		},
		{
			name: 'Default: subpath imports are NOT flagged (opt-in preserves current behavior)',
			code: outdent`
                import AkFeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';

                AkFeatureGates.checkGate('my_gate');
            `,
		},
		{
			name: 'Default: subpath `getExperimentValue` is NOT flagged',
			code: outdent`
                import AkFeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';

                AkFeatureGates.getExperimentValue('my_experiment', 'is_enabled', false);
            `,
		},
		{
			name: 'includeSubpathImports=true: unrelated library still not flagged',
			options: [{ includeSubpathImports: true }],
			code: outdent`
                import FeatureGates from 'some-other-lib/feature-gates';

                FeatureGates.checkGate('my_gate');
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
						'Please do not use FeatureGates.getExperimentValue, use `isExperimentEnabled` or `expVal` from `@atlaskit/platform-feature-experiments` instead.',
				},
			],
		},
		{
			name: 'includeSubpathImports=true: `checkGate` via subpath IS flagged',
			options: [{ includeSubpathImports: true }],
			code: outdent`
                import AkFeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';

                export const Component = () => {
                    return AkFeatureGates.checkGate('my_gate') ? <HelloWorld /> : null;
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
			name: 'includeSubpathImports=true: `getExperimentValue` via subpath IS flagged',
			options: [{ includeSubpathImports: true }],
			code: outdent`
                import AkFeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';

                export const getThing = () => {
                    if (AkFeatureGates.getExperimentValue('my_experiment', 'is_enabled', false)) {
                        return newThing();
                    }

                    return oldThing();
                };
            `,
			errors: [
				{
					message:
						'Please do not use FeatureGates.getExperimentValue, use `isExperimentEnabled` or `expVal` from `@atlaskit/platform-feature-experiments` instead.',
				},
			],
		},
		{
			name: 'includeSubpathImports=true: multi-segment subpath is also flagged',
			options: [{ includeSubpathImports: true }],
			code: outdent`
                import AkFeatureGates from '@atlaskit/feature-gate-js-client/dynamic-config/experimental';

                AkFeatureGates.checkGate('my_gate');
            `,
			errors: [
				{
					message:
						'Please do not use FeatureGates.checkGate, use `fg` from `@atlaskit/platform-feature-flags` instead.',
				},
			],
		},
		{
			name: 'includeSubpathImports=true: bare imports still flagged',
			options: [{ includeSubpathImports: true }],
			code: outdent`
                import FeatureGates from '@atlaskit/feature-gate-js-client';

                FeatureGates.checkGate('my_gate');
            `,
			errors: [
				{
					message:
						'Please do not use FeatureGates.checkGate, use `fg` from `@atlaskit/platform-feature-flags` instead.',
				},
			],
		},
	],
});
