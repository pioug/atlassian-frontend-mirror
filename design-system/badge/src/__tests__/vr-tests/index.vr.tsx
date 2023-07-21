import { snapshot } from '@af/visual-regression';

import BadgeBasic from '../../../examples/0-basic';
import BadgeCustomization from '../../../examples/4-customization';

snapshot(BadgeCustomization);

snapshot(BadgeBasic, {
  variants: [
    {
      name: 'light',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'dark',
      environment: {
        colorScheme: 'dark',
      },
    },
    {
      name: 'none',
      environment: {
        colorScheme: 'no-preference',
      },
    },
  ],
  ignoredLogs: [
    {
      pattern: /TypeError/i,
      ignoredBecause:
        'This error is expected now since the VR test would throw an error when an unhanded exception is thrown.',
      jiraIssueId: 'TODO-1',
    },
  ],
});
