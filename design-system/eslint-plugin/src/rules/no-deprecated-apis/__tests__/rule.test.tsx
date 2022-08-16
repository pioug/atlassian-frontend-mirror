import { tester } from '../../__tests__/utils/_tester';
import rule from '../index';

tester.run('no-deprecated-imports', rule, {
  valid: [
    {
      code: `import { SomeElement } from 'some-other-library';

      const Element = () => (
        <SomeElement cssFn={cssFn()} />
      );`,
    },
    {
      code: `import { ButtonItem } from '@atlaskit/menu';

      const Element = () => (
        <ButtonItem />
      );`,
    },
    {
      code: `import Drawer from '@atlaskit/drawer';

      const Element = () => (
        <Drawer />
      );`,
    },
    {
      code: `import { ButtonItem } from '@atlaskit/side-navigation';

      const Element = () => (
        <SomeUsage cssFn={cssFn()}>
          <ButtonItem />
        </SomeUsage>
      );`,
    },
    {
      code: `import { SomeElement } from 'some-other-library';

      const Element = () => (
        <SomeElement isOpen innerRef={() => 'hi'} />
      );`,
    },
    {
      code: `import InlineMessage from '@atlaskit/inline-message';

      const Element = () => (
        <InlineMessage appearance='connectivity' />
      );`,
    },
  ],
  invalid: [
    {
      code: `import Drawer from '@atlaskit/drawer';

      const Element = () => (
        <Drawer overrides={overrides} />
      );`,
      errors: [{ messageId: 'noDeprecatedApis' }],
    },
    {
      code: `import { ButtonItem } from '@atlaskit/menu';

      const Element = () => (
        <ButtonItem cssFn={cssFn()} />
      );`,
      errors: [{ messageId: 'noDeprecatedApis' }],
    },
    {
      code: `import { ButtonItem } from '@atlaskit/side-navigation';

      const Element = () => (
        <ButtonItem cssFn={cssFn()} />
      );`,
      errors: [{ messageId: 'noDeprecatedApis' }],
    },
    {
      code: `import { ButtonItem } from '@atlaskit/side-navigation';

      const Element = () => (
        <ButtonItem overrides={{ Item: { cssFn }}} />
      );`,
      errors: [{ messageId: 'noDeprecatedApis' }],
    },
    {
      code: `import { ButtonItem } from '@atlaskit/menu';

      const Element = () => (
        <ButtonItem overrides={{ Item: { cssFn }}} />
      );`,
      errors: [{ messageId: 'noDeprecatedApis' }],
    },
    {
      code: `import Banner from '@atlaskit/banner';

      const Element = () => (
        <Banner isOpen />
      );`,
      errors: [{ messageId: 'noDeprecatedApis' }],
    },
    {
      code: `import Banner from '@atlaskit/banner';

      const Element = () => (
        <Banner innerRef={() => 'hi'} />
      );`,
      errors: [{ messageId: 'noDeprecatedApis' }],
    },
    {
      code: `import InlineMessage from '@atlaskit/inline-message';

      const Element = () => (
        <InlineMessage type='connectivity' />
      );`,
      errors: [{ messageId: 'noDeprecatedApis' }],
    },
  ],
});
