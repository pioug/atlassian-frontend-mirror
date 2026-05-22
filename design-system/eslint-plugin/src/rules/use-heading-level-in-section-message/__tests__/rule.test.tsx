// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule, { headingLevelRequiredSuggestionText } from '../index';

ruleTester.run('use-heading-level-in-section-message', rule, {
	valid: [
		`
import SectionMessage from '@atlaskit/section-message';
<SectionMessage>Content.</SectionMessage>
  `,
		`
import SectionMessage from '@atlaskit/section-message';
<SectionMessage title="Switch it up" headingLevel={2}>
  Content.
</SectionMessage>
  `,
		// Should only trip on onboarding package
		`
import SectionMessage from 'a-different-package';
<SectionMessage title="Hello there!">Content.</SectionMessage>
  `,
	],
	invalid: [
		// Missing headingLevel
		{
			code: `
import SectionMessage from '@atlaskit/section-message';
<SectionMessage title="Switch it up">
  Content.
</SectionMessage>
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
import AkSectionMessage from '@atlaskit/section-message';
<AkSectionMessage title="Switch it up">
  Content.
</AkSectionMessage>
        `,
			errors: [
				{
					message: headingLevelRequiredSuggestionText,
				},
			],
		},
	],
});
