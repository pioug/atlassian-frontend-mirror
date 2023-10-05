// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('use-button-item', rule, {
  valid: [
    `
      import { LinkItem } from '@atlaskit/menu';
      <LinkItem href="http://zombo.com">Zombo</LinkItem>
    `,
    `
      import { ButtonItem, LinkItem } from '@atlaskit/menu';
      <LinkItem href="http://zombo.com">Zombo</LinkItem>
    `,
    // Should understand named imports
    `
      import { LinkItem as AkLinkItem } from '@atlaskit/menu';
      <AkLinkItem href="http://zombo.com">Zombo</AkLinkItem>
    `,
    `
      import { ButtonItem, LinkItem as AkLinkItem } from '@atlaskit/menu';
      <AkLinkItem href="http://zombo.com">Zombo</AkLinkItem>
    `,
    // Should not trip for a defined variable
    `
      import { LinkItem } from '@atlaskit/menu';

      const url = "http://zombo.com";
      <LinkItem href={url}>Zombo</LinkItem>
    `,
    // Should not trip if variable is defined out of the parent scope
    `
      import { LinkItem } from '@atlaskit/menu';
      import { url } from 'another-package';

      <LinkItem href={url}>Zombo</LinkItem>
    `,
    // Should only trip on `@atlaskit/menu`
    `
      import { LinkItem } from 'a-different-package';
      <LinkItem onClick={()=>{}}>Zombo</LinkItem>
    `,
  ],
  invalid: [
    // hrefRequired
    {
      code: `
        import { LinkItem } from '@atlaskit/menu';
        <LinkItem>Link</LinkItem>
      `,
      errors: [
        {
          messageId: 'hrefRequired',
        },
      ],
    },
    {
      code: `
        import { LinkItem } from '@atlaskit/menu';
        <LinkItem href="">Zombo</LinkItem>
      `,
      errors: [
        {
          messageId: 'hrefRequired',
        },
      ],
    },
    {
      code: `
        import { LinkItem as AkLinkItem } from '@atlaskit/menu';
        <AkLinkItem>Link</AkLinkItem>
      `,
      errors: [
        {
          messageId: 'hrefRequired',
        },
      ],
    },
    {
      code: `
        import { LinkItem as AkLinkItem } from '@atlaskit/menu';
        <AkLinkItem href="">Link</AkLinkItem>
      `,
      errors: [
        {
          messageId: 'hrefRequired',
        },
      ],
    },
    {
      code: `
        import { LinkItem } from '@atlaskit/menu';

        const url = null;
        <LinkItem href={url}>Zombo</LinkItem>
      `,
      errors: [
        {
          messageId: 'hrefRequired',
        },
      ],
    },
    {
      code: `
        import { LinkItem } from '@atlaskit/menu';

        const url = undefined;
        <LinkItem href={url}>Zombo</LinkItem>
      `,
      errors: [
        {
          messageId: 'hrefRequired',
        },
      ],
    },
    {
      code: `
        import { LinkItem } from '@atlaskit/menu';
        const url = "";
        <LinkItem href={url}>Zombo</LinkItem>
      `,
      errors: [
        {
          messageId: 'hrefRequired',
        },
      ],
    },
  ],
});
