import { tester } from '../../../__tests__/utils/_tester';
import rule from '../../index';

tester.run('ensure-design-token-usage', rule, {
  valid: [
    `token('shadow.card', background())`,
    `const background = 'hey';`,
    `import { e100 } from 'lib';`,
    `
    css({background:'none'})
    `,
    `
      import { B100 } from '@atlaskit/theme/colors';
    `,
    `
      css({
        boxShadow: token('shadow.card'),
      })
    `,
    `
      css\`
        box-shadow: \${token('shadow.card')};
      \`
    `,
    `
      css\`
        color: inherit;
        color: token('color.background.blanket');
      \`
    `,
    `
    styled.div\`
      color: inherit;
      color: token('color.background.blanket');
    \`
  `,
    `
      token('color.background.blanket', 'red');
      token('color.background.blanket', B100);
      token('color.background.blanket', colors.B200);
    `,
    `
    token('color.background.blanket');
  `,
    `
    const number = 123;
    const aString = number.toString();
  `,
    `
    css({
      backgroundColor: token('color.background.blanket', background())
    })
    `,
    `
    wrapper.find('#eeeeee').exists()
    `,
  ],
  invalid: [
    {
      code: `
        css\`
          \${e100};
        \`
      `,
      output: `
        css\`
          background-color: $\{token('color.background.card')};
          box-shadow: \${token('shadow.card')};
        \`
      `,
      errors: [
        {
          messageId: 'legacyElevation',
        },
      ],
    },
    {
      code: `
        css({
          boxShadow: '0px 1px 1px #161A1D32',
        })
      `,
      errors: [
        {
          messageId: 'hardCodedColor',
        },
      ],
    },
    {
      code: `
        css\`
          box-shadow: 0px 1px 1px #161A1D32;
        \`
      `,
      errors: [
        {
          messageId: 'hardCodedColor',
        },
      ],
    },
    {
      code: `css({ color: 'var(--accent-blueSubtle)' });`,
      output: `css({ color: token('color.accent.blueSubtle') });`,
      errors: [
        {
          messageId: 'directTokenUsage',
        },
      ],
    },
    {
      code: `
        css\`
          color: var(--accent-blueSubtle);
        \`;
      `,
      errors: [
        {
          messageId: 'directTokenUsage',
        },
      ],
    },
    {
      code: `
        styled.div\`
          color: var(--accent-blueSubtle);
        \`;
      `,
      errors: [
        {
          messageId: 'directTokenUsage',
        },
      ],
    },
    {
      code: `css({ color: 'red' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
        },
      ],
    },
    {
      code: `
        css\`
          color: red;
          background-color: #ccc;
        \`;
      `,
      errors: [
        {
          messageId: 'hardCodedColor',
        },
      ],
    },
    {
      code: `
        styled.div\`
          color: red;
          background-color: #ccc;
        \`;
      `,
      errors: [
        {
          messageId: 'hardCodedColor',
        },
      ],
    },
    {
      code: `
        css({
          backgroundColor: background(),
        });
      `,
      errors: [
        {
          messageId: 'hardCodedColor',
        },
      ],
    },
    {
      code: `
        colors.B100;
        P100;
      `,
      errors: [
        {
          messageId: 'hardCodedColor',
        },
        {
          messageId: 'hardCodedColor',
        },
      ],
    },
    {
      code: `
        css({
          color: 'red',
          color: 'orange',
        });
      `,
      errors: [
        {
          messageId: 'hardCodedColor',
        },
        {
          messageId: 'hardCodedColor',
        },
      ],
    },
    {
      code: `
        css({
          color: 'hsl(30, 100%, 50%, 0.6)',
          color: 'hsla(30, 100%, 50%, 0.6)',
        });
      `,
      errors: [
        {
          messageId: 'hardCodedColor',
        },
        {
          messageId: 'hardCodedColor',
        },
      ],
    },
    {
      code: `
        css({
          color: 'rgb(0, 0, 0)',
          color: 'rgba(0, 0, 0, 0.5)',
        });
      `,
      errors: [
        {
          messageId: 'hardCodedColor',
        },
        {
          messageId: 'hardCodedColor',
        },
      ],
    },
    {
      code: `
        css({
          color: '#ccc',
          color: '#cccaaa',
          color: '#cccaaaff'
        })
      `,
      errors: [
        {
          messageId: 'hardCodedColor',
        },
        {
          messageId: 'hardCodedColor',
        },
        {
          messageId: 'hardCodedColor',
        },
      ],
    },
    {
      code: `
        token(identifier);
      `,
      errors: [
        {
          messageId: 'staticToken',
        },
      ],
    },
    {
      code: `
        token('dont-exist');
      `,
      errors: [
        {
          message: 'The token "dont-exist" does not exist.',
        },
      ],
    },
  ],
});
