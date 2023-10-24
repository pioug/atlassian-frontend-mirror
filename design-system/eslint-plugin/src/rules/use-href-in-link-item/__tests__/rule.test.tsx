// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule, { hrefRequiredSuggestionText } from '../index';

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
    // Should not trip if variable is defined as a prop
    `
import { LinkItem } from '@atlaskit/menu';

const Component = ({ url }) => <LinkItem href={url}>Zombo</LinkItem>;
  `,
    `
import { LinkItem } from '@atlaskit/menu';

const Component = (url) => <LinkItem href={url}>Zombo</LinkItem>;
  `,
    `
import { LinkItem } from '@atlaskit/menu';

class C extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <LinkItem href={this.props.url}>Zombo</LinkItem>;
  }
}
  `,
    // Should only trip on `@atlaskit/menu`
    `
import { LinkItem } from 'a-different-package';
<LinkItem onClick={()=>{}}>Zombo</LinkItem>
  `,
  ],
  invalid: [
    // Missing href
    {
      code: `
import { LinkItem } from '@atlaskit/menu';
<LinkItem>Link</LinkItem>
    `,
      errors: [
        {
          suggestions: [
            {
              desc: hrefRequiredSuggestionText,
              output: `
import { LinkItem, ButtonItem } from '@atlaskit/menu';
<ButtonItem>Link</ButtonItem>
    `,
            },
          ],
        },
      ],
    },
    // Should not readd ButtonItem if import exists
    {
      code: `
import { ButtonItem, LinkItem } from '@atlaskit/menu';
<LinkItem>Zombo</LinkItem>
    `,
      errors: [
        {
          suggestions: [
            {
              desc: hrefRequiredSuggestionText,
              output: `
import { ButtonItem, LinkItem } from '@atlaskit/menu';
<ButtonItem>Zombo</ButtonItem>
    `,
            },
          ],
        },
      ],
    },
    // Should handle empty href
    {
      code: `
import { LinkItem } from '@atlaskit/menu';
<LinkItem href="">Link</LinkItem>
    `,
      errors: [
        {
          suggestions: [
            {
              desc: hrefRequiredSuggestionText,
              output: `
import { LinkItem, ButtonItem } from '@atlaskit/menu';
<ButtonItem >Link</ButtonItem>
    `,
            },
          ],
        },
      ],
    },
    // Should handle invalid href
    {
      code: `
import { LinkItem } from '@atlaskit/menu';
<LinkItem href="#">Link</LinkItem>
    `,
      errors: [
        {
          suggestions: [
            {
              desc: hrefRequiredSuggestionText,
              output: `
import { LinkItem, ButtonItem } from '@atlaskit/menu';
<ButtonItem >Link</ButtonItem>
    `,
            },
          ],
        },
      ],
    },
    // Should handle variables
    {
      code: `
import { LinkItem } from '@atlaskit/menu';
const url = "";
<LinkItem href={url}>Zombo</LinkItem>
    `,
      errors: [
        {
          suggestions: [
            {
              desc: hrefRequiredSuggestionText,
              output: `
import { LinkItem, ButtonItem } from '@atlaskit/menu';
const url = "";
<ButtonItem >Zombo</ButtonItem>
    `,
            },
          ],
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
          suggestions: [
            {
              desc: hrefRequiredSuggestionText,
              output: `
import { LinkItem, ButtonItem } from '@atlaskit/menu';

const url = null;
<ButtonItem >Zombo</ButtonItem>
    `,
            },
          ],
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
          suggestions: [
            {
              desc: hrefRequiredSuggestionText,
              output: `
import { LinkItem, ButtonItem } from '@atlaskit/menu';

const url = undefined;
<ButtonItem >Zombo</ButtonItem>
    `,
            },
          ],
        },
      ],
    },
    // Should handle named imports
    {
      code: `
import { LinkItem as AkLinkItem } from '@atlaskit/menu';
<AkLinkItem>Link</AkLinkItem>
    `,
      errors: [
        {
          suggestions: [
            {
              desc: hrefRequiredSuggestionText,
              output: `
import { LinkItem as AkLinkItem, ButtonItem } from '@atlaskit/menu';
<ButtonItem>Link</ButtonItem>
    `,
            },
          ],
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
          suggestions: [
            {
              desc: hrefRequiredSuggestionText,
              output: `
import { LinkItem as AkLinkItem, ButtonItem } from '@atlaskit/menu';
<ButtonItem >Link</ButtonItem>
    `,
            },
          ],
        },
      ],
    },
    // Should handle default imports
    {
      code: `
import LinkItem from '@atlaskit/menu/link-item';
<LinkItem>Link</LinkItem>
    `,
      errors: [
        {
          suggestions: [
            {
              desc: hrefRequiredSuggestionText,
              output: `
import ButtonItem from '@atlaskit/menu/button-item';
import LinkItem from '@atlaskit/menu/link-item';
<ButtonItem>Link</ButtonItem>
    `,
            },
          ],
        },
      ],
    },
    {
      code: `
import LinkItem from '@atlaskit/menu/link-item';
import { ButtonItem } from '@atlaskit/menu';
<LinkItem>Link</LinkItem>
`,
      errors: [
        {
          suggestions: [
            {
              desc: hrefRequiredSuggestionText,
              output: `
import LinkItem from '@atlaskit/menu/link-item';
import { ButtonItem } from '@atlaskit/menu';
<ButtonItem>Link</ButtonItem>
`,
            },
          ],
        },
      ],
    },
    // Should handle other packages with same name imports
    {
      code: `
import { ButtonItem } from 'some-other-package';
import { LinkItem } from '@atlaskit/menu';

return (
  <div>
    <ButtonItem>Button</ButtonItem>
    <LinkItem>Link</LinkItem>
  </div>
);
`,
      errors: [
        {
          suggestions: [
            {
              desc: hrefRequiredSuggestionText,
              output: `
import { ButtonItem } from 'some-other-package';
import { LinkItem, ButtonItem as ButtonItem2 } from '@atlaskit/menu';

return (
  <div>
    <ButtonItem>Button</ButtonItem>
    <ButtonItem2>Link</ButtonItem2>
  </div>
);
`,
            },
          ],
        },
      ],
    },
    {
      code: `
import { ButtonItem } from 'some-other-package';
import { ButtonItem2 } from 'some-other-package';
import { LinkItem } from '@atlaskit/menu';

return (
  <div>
    <ButtonItem>Button</ButtonItem>
    <ButtonItem2>Button</ButtonItem2>
    <LinkItem>Link</LinkItem>
  </div>
);
`,
      errors: [
        {
          suggestions: [
            {
              desc: hrefRequiredSuggestionText,
              output: `
import { ButtonItem } from 'some-other-package';
import { ButtonItem2 } from 'some-other-package';
import { LinkItem, ButtonItem as ButtonItem3 } from '@atlaskit/menu';

return (
  <div>
    <ButtonItem>Button</ButtonItem>
    <ButtonItem2>Button</ButtonItem2>
    <ButtonItem3>Link</ButtonItem3>
  </div>
);
`,
            },
          ],
        },
      ],
    },
  ],
});
