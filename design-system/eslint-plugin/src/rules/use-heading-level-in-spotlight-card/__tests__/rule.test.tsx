// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule, { headingLevelRequiredSuggestionText } from '../index';

ruleTester.run('use-heading-level-in-spotlight-card', rule, {
  valid: [
    `
import { SpotlightCard } from '@atlaskit/onboarding';
<SpotlightCard>Content.</SpotlightCard>
  `,
    `
import { SpotlightCard } from '@atlaskit/onboarding';
<SpotlightCard heading="Switch it up" headingLevel={2}>
  Content.
</SpotlightCard>
  `,
    // Should understand named imports
    `
import { SpotlightCard as AkSpotlightCard } from '@atlaskit/onboarding';
<AkSpotlightCard>Content.</AkSpotlightCard>
  `,
    `
import { SpotlightCard as AkSpotlightCard } from '@atlaskit/onboarding';
<AkSpotlightCard heading="Switch it up" headingLevel={2}>
  Content.
</AkSpotlightCard>
  `,
    // Should only trip on onboarding package
    `
import { SpotlightCard } from 'a-different-package';
<SpotlightCard heading="Hello there!">Content.</SpotlightCard>
  `,
  ],
  invalid: [
    // Missing headingLevel
    {
      code: `
import { SpotlightCard } from '@atlaskit/onboarding';
<SpotlightCard heading="Switch it up">
  Content.
</SpotlightCard>
    `,
      errors: [
        {
          message: headingLevelRequiredSuggestionText,
        },
      ],
    },
    // Should handle named imports
    {
      code: `
import { SpotlightCard as AkSpotlightCard } from '@atlaskit/onboarding';
<AkSpotlightCard heading="Switch it up">
  Content.
</AkSpotlightCard>
        `,
      errors: [
        {
          message: headingLevelRequiredSuggestionText,
        },
      ],
    },
  ],
});
