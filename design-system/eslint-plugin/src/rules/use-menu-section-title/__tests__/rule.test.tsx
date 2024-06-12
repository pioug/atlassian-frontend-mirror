import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('use-menu-section-title', rule, {
	valid: [
		`
	import { Section } from '@atlaskit/menu';

    <Section title="Section content title">
      Children
    </Section>
	`,
		`
	import { Section } from '@atlaskit/menu';

	const titleId = "section-label-test-id";

    <Section titleId={titleId}>
      Children
    </Section>
	`,
		`
    import Section from '@atlaskit/menu/section';

    <Section title="Section content title">
      Children
    </Section>
	`,
		`
	import Section from '@atlaskit/menu/section';

	const titleId = "section-label-test-id";

    <Section titleId={titleId}>
      Children
    </Section>
	`,
		`
    import AkSection from '@atlaskit/menu/section';

    <AkSection title="Section content title">
      Children
    </AkSection>
	`,
		`
	import AkSection from '@atlaskit/menu/section';

	const titleId = "section-label-test-id";

    <AkSection titleId={titleId}>
      Children
    </AkSection>
	`,
		`
    import { Section as AkSection } from '@atlaskit/menu';

    <Section title="Section content title">
      Children
    </Section>
	`,
		`
	import { Section as AkSection } from '@atlaskit/menu';

	const titleId = "section-label-test-id";

    <Section titleId={titleId}>
      Children
    </Section>
	`,
	],
	invalid: [
		{
			code: `
      import { Section } from '@atlaskit/menu';

      <Section>
      	Children
      </Section>
      `,
			errors: [
				{
					messageId: 'missingTitleProp',
				},
			],
		},
		{
			code: `
      import { Section } from '@atlaskit/menu';

      <Section title="">
      	Children
      </Section>
      `,
			errors: [
				{
					messageId: 'titlePropShouldHaveContents',
				},
			],
		},
		{
			code: `
      import { Section } from '@atlaskit/menu';

      <Section titleId="">
      	Children
      </Section>
      `,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
      import { Section } from '@atlaskit/menu';

      <Section titleId="testId" title="Section accessible title">
      	Children
      </Section>
      `,
			errors: [
				{
					messageId: 'noBothPropsUsage',
				},
			],
		},
		{
			code: `
      import Section from '@atlaskit/menu/section';

      <Section>
      	Children
      </Section>
      `,
			errors: [
				{
					messageId: 'missingTitleProp',
				},
			],
		},
		{
			code: `
      import Section from '@atlaskit/menu/section';

      <Section title="">
      	Children
      </Section>
      `,
			errors: [
				{
					messageId: 'titlePropShouldHaveContents',
				},
			],
		},
		{
			code: `
      import Section from '@atlaskit/menu/section';

      <Section titleId="">
      	Children
      </Section>
      `,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
      import Section from '@atlaskit/menu/section';

      <Section titleId="testId" title="Section accessible title">
      	Children
      </Section>
      `,
			errors: [
				{
					messageId: 'noBothPropsUsage',
				},
			],
		},
		{
			code: `
      import AkSection from '@atlaskit/menu/section';

      <AkSection>
      	Children
      </AkSection>
      `,
			errors: [
				{
					messageId: 'missingTitleProp',
				},
			],
		},
		{
			code: `
      import AkSection from '@atlaskit/menu/section';

      <AkSection title="">
      	Children
      </AkSection>
      `,
			errors: [
				{
					messageId: 'titlePropShouldHaveContents',
				},
			],
		},
		{
			code: `
      import AkSection from '@atlaskit/menu/section';

      <AkSection titleId="">
      	Children
      </AkSection>
      `,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
      import AkSection from '@atlaskit/menu/section';

      <AkSection titleId="testId" title="Section accessible title">
      	Children
      </AkSection>
      `,
			errors: [
				{
					messageId: 'noBothPropsUsage',
				},
			],
		},
		{
			code: `
      import { Section as AkSection } from '@atlaskit/menu';

      <AkSection>
      	Children
      </AkSection>
      `,
			errors: [
				{
					messageId: 'missingTitleProp',
				},
			],
		},
		{
			code: `
      import { Section as AkSection } from '@atlaskit/menu';

      <AkSection title="">
      	Children
      </AkSection>
      `,
			errors: [
				{
					messageId: 'titlePropShouldHaveContents',
				},
			],
		},
		{
			code: `
      import { Section as AkSection } from '@atlaskit/menu';

      <AkSection titleId="">
      	Children
      </AkSection>
      `,
			errors: [
				{
					messageId: 'titleIdShouldHaveValue',
				},
			],
		},
		{
			code: `
      import { Section as AkSection } from '@atlaskit/menu';

      <AkSection titleId="testId" title="Section accessible title">
      	Children
      </AkSection>
      `,
			errors: [
				{
					messageId: 'noBothPropsUsage',
				},
			],
		},
	],
});
