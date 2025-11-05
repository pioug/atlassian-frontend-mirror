import outdent from 'outdent';

import { type Tests } from '../../__tests__/utils/_types';

const error =
	'@atlaskit/onboarding is deprecated in favor of @atlaskit/spotlight. Please migrate your spotlight experiences accordingly.';

const valid: string[] = [
	outdent`
    // ignores Spotlight from different package
    import { Spotlight } from '@atlaskit/spotlight';
  `,
	outdent`
    // ignores Spotlight from relative import
    import { Spotlight } from '../onboarding';
  `,
];

const invalid = [
	{
		code: outdent`
      // it raises a violation for Spotlight imported from @atlaskit/onboarding
      import { Spotlight } from '@atlaskit/onboarding';
    `,
		errors: [error],
	},

	{
		code: outdent`
      // it raises a violation for multiple imports from @atlaskit/onboarding
      import { Spotlight, OnboardingModal } from '@atlaskit/onboarding';
    `,
		errors: [error],
	},
];

export const tests: Tests = {
	valid,
	invalid,
};
