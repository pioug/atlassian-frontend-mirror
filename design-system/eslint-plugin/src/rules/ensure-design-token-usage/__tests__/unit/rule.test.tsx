import { tester } from '../../../__tests__/utils/_tester';
import rule from '../../index';

tester.run('ensure-design-token-usage', rule, {
  valid: [
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
      code: `'var(--accent-blueSubtle)';`,
      output: `token('color.accent.blueSubtle');`,
      errors: [
        {
          messageId: 'directTokenUsage',
        },
      ],
    },
    {
      code: `'--accent-blueSubtle';`,
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
      code: `
        css({
          color: 'red',
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
        'red';
        'orange';
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
        'hsl(30, 100%, 50%, 0.6)';
        'hsla(30, 100%, 50%, 0.6)';
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
        'rgb(0, 0, 0)';
        'rgba(0, 0, 0, 0.5)';
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
        '#ccc';
        '#cccaaa';
        '#cccaaaff';
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
