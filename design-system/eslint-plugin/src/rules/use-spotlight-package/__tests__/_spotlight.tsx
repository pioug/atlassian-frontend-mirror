import outdent from 'outdent';

import type { Tests } from '../../__tests__/utils/_types';

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
	outdent`
    // ignores non-spotlight imports from @atlaskit/onboarding
    import { OnboardingModal } from '@atlaskit/onboarding';
  `,
	outdent`
    // ignores default imports from @atlaskit/onboarding
    import Onboarding from '@atlaskit/onboarding';
  `,
	outdent`
    // ignores namespace imports from @atlaskit/onboarding
    import * as Onboarding from '@atlaskit/onboarding';
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
      // it raises a violation for SpotlightCard imported from @atlaskit/onboarding
      import { SpotlightCard } from '@atlaskit/onboarding';
    `,
		errors: [error],
	},

	{
		code: outdent`
      // it raises a violation for SpotlightManager imported from @atlaskit/onboarding
      import { SpotlightManager } from '@atlaskit/onboarding';
    `,
		errors: [error],
	},

	{
		code: outdent`
      // it raises a violation for SpotlightTarget imported from @atlaskit/onboarding
      import { SpotlightTarget } from '@atlaskit/onboarding';
    `,
		errors: [error],
	},

	{
		code: outdent`
      // it raises a violation for SpotlightTransition imported from @atlaskit/onboarding
      import { SpotlightTransition } from '@atlaskit/onboarding';
    `,
		errors: [error],
	},

	{
		code: outdent`
      // it raises a violation for spotlightButtonTheme imported from @atlaskit/onboarding
      import { spotlightButtonTheme } from '@atlaskit/onboarding';
    `,
		errors: [error],
	},

	{
		code: outdent`
      // it raises a violation for useSpotlight imported from @atlaskit/onboarding
      import { useSpotlight } from '@atlaskit/onboarding';
    `,
		errors: [error],
	},

	{
		code: outdent`
      // it raises a violation for SpotlightPulse imported from @atlaskit/onboarding
      import { SpotlightPulse } from '@atlaskit/onboarding';
    `,
		errors: [error],
	},

	{
		code: outdent`
      // it raises a violation for multiple Spotlight-related imports from @atlaskit/onboarding
      import { Spotlight, SpotlightCard, SpotlightManager } from '@atlaskit/onboarding';
    `,
		errors: [error],
	},

	{
		code: outdent`
      // it raises violations even when mixed with non-spotlight imports
      import { Spotlight, OnboardingModal } from '@atlaskit/onboarding';
    `,
		errors: [error],
	},
];

export const tests: Tests = {
	valid,
	invalid,
};
