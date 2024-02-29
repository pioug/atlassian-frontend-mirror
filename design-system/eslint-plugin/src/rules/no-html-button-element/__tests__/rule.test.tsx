// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('prefer-button-or-pressable', rule, {
  valid: [
    // it ignores React components
    '<Component />',

    // it ignores already transformed code
    `
      const myI18nValue: string = "Close dialog";
      <Button>{myI18nValue}</Button>
    `,
    `
      const myI18nValue: string = "Close dialog";
      <Pressable>{myI18nValue}</Pressable>
    `,

    // it ignores non-JSX code
    'const x = 10;',

    // it ignores elements that aren't buttons
    '<a></a>',

    // it ignores string values defined as inline object notation
    '<a>{"link"}</a>',

    // it ignores styled calls extending components
    `styled(Button)\`color: red;\``,
    `styled(Pressable)\`color: red;\``,

    // it ignores styled calls extending elements that aren't buttons
    `styled('a')\`color: red;\``,

    // it ignores styled calls extending elements that aren't buttons
    `styled.a\`color: red;\``,

    // it ignores styled calls extending elements that aren't buttons
    `styled.a({ color: 'red' })`,
  ],
  invalid: [
    // it suggests for button elements
    {
      code: '<button></button>',
      errors: [{ messageId: 'noHtmlButtonElement' }],
    },

    // it suggests for self closing tags
    {
      code: '<button />',
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests for self closing tags in Box
    {
      code: '<Box><button /></Box>',
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if the element only contains whitespace
    {
      code: '<button>  \n\n\t\t  \n\r  \t\t\t</button>',
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if button contains one JSX child
    {
      code: '<button><span>Content</span></button>',
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if button contains text alongside JSX children
    {
      code: `
        <button>
          <span>a span</span>
          loose text
        </button>
      `,
      errors: [{ messageId: 'noHtmlButtonElement' }],
    },

    // it suggests if button contains more than one JSX element
    {
      code: `
      <button>
        <span>Some span</span>
        <span>Some other span</span>
      </button>
    `,
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if the only child is a React.Fragment
    {
      code: [
        `<button>`,
        `  <>`,
        `    <something></something>`,
        `  </>`,
        `</button>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // Suggests if button has attributes
    {
      code: [
        `<button`,
        `  data-testid="some-test-id" `,
        `  type="submit"`,
        `  aria-live="polite"`,
        `  id="button"`,
        `>`,
        `</button>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if element has style attribute
    {
      code: `<button style={{ padding: "8px" }}></button>`,
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if element has css attribute
    {
      code: `<button css={css({ padding: "8px" })}></button>`,
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if element has css attribute with a variable reference
    {
      code: [
        `const someStyles = css({ color: token('atlassian.red', 'red') });`,
        '<button css={someStyles}>{children}</button>',
      ].join('\n'),
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if element has class attribute
    {
      code: `<button class='container'></button>`,
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if element has className attribute
    {
      code: `<button className='container'></button>`,
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if element has multiple JSX children and appropriate styling
    {
      code: [
        `const flexStyles = css({ display: 'flex' });`,
        `<button css={flexStyles}>`,
        `  <a href=\"/\">Home</a>`,
        `  <a href=\"/about\">About</a>`,
        `  <a href=\"/contact\">Contact</a>`,
        `</button>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if element has nested styles
    {
      code: `
      const fakeStyles = css({
        width: '100%',
        height: '100%',
        '& > div': {
          display: 'flex',
          boxSizing: 'border-box',
        },
      });
      <button css={fakeStyles}>
        <Item>1</Item>
        <Item>2</Item>
      </button>
    `,
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if element used with styled components (member, template)
    {
      code: `styled.button\`color: 'red'\``,
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if element used with styled components (member, object)
    {
      code: `styled.button({ color: 'green' })`,
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if element used with styled components (call)
    {
      code: `styled('button')\`color: 'blue'\``,
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },

    // it suggests if element used with compiled (member)
    {
      code: `styled2.button\`color: 'red'\``,
      errors: [
        {
          messageId: 'noHtmlButtonElement',
        },
      ],
    },
  ],
});
