import { typescriptEslintTester } from '../../__tests__/utils/_tester';
import rule, { name, noDeprecatedJSXAttributeMessageId } from '../index';

import defaultMeta from './__fixtures__/default.json';
import hasNamedSpecifiers from './__fixtures__/has-named-specifiers.json';

typescriptEslintTester.run(name, rule, {
	valid: [
		{
			code: `import { SomeElement } from 'some-other-library';

      const Element = () => (
        <SomeElement cssFn={cssFn()} />
      );`,
		},
		{
			code: `import { SomeElement } from 'some-other-library';

      const Element = () => (
        <SomeElement cssFn={cssFn()} />
      );`,
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			code: `import { ButtonItem } from '@atlaskit/menu';

      const Element = () => (
        <ButtonItem />
      );`,
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			code: `import { ButtonItem } from '@atlaskit/side-navigation';

      const Element = () => (
        <SomeUsage cssFn={cssFn()}>
          <ButtonItem />
        </SomeUsage>
      );`,
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			code: `import InlineMessage from '@atlaskit/inline-message';

      const Element = () => (
        <InlineMessage appearance='connectivity' />
      );`,
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			code: `import { Section } from '@atlaskit/inline-message';

      const Element = () => (
        <Section cssFn2={cssFn()} />
      );`,
			options: [{ deprecatedConfig: hasNamedSpecifiers }],
		},
	],

	invalid: [
		{
			code: `import { ButtonItem } from '@atlaskit/menu';

      const Element = () => (
        <ButtonItem cssFn={cssFn()} />
      );`,
			options: [{ deprecatedConfig: defaultMeta }],
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
		},
		{
			code: `import { ButtonItem } from '@atlaskit/side-navigation';

      const Element = () => (
        <ButtonItem cssFn={cssFn()} />
      );`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			code: `import { ButtonItem } from '@atlaskit/side-navigation';

      const Element = () => (
        <ButtonItem overrides={{ Item: { cssFn }}} />
      );`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			code: `import { ButtonItem } from '@atlaskit/menu';

      const Element = () => (
        <ButtonItem overrides={{ Item: { cssFn }}} />
      );`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			code: `import InlineMessage from '@atlaskit/inline-message';

      const Element = () => (
        <InlineMessage type='connectivity' />
      );`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: defaultMeta }],
		},
		{
			code: `import { ButtonItem } from '@atlaskit/menu';

        const Element = () => (
          <ButtonItem cssFn2={cssFn()} />
        );`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: hasNamedSpecifiers }],
		},
		{
			code: `import { MenuGroup } from '@atlaskit/menu';

        const Element = () => (
          <MenuGroup cssFn2={cssFn()} />
        );`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: hasNamedSpecifiers }],
		},
		{
			code: `import Heading from '@atlaskit/heading';

        const Element = () => (
          <Heading level="h700" />
        );`,
			errors: [{ messageId: noDeprecatedJSXAttributeMessageId }],
			options: [{ deprecatedConfig: defaultMeta }],
		},
	],
});
