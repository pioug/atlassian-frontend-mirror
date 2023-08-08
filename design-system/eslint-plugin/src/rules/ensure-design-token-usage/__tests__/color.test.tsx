import { tester } from '../../__tests__/utils/_tester';
import rule from '../../ensure-design-token-usage';

import { Tests } from './_types';

const colorTests: Tests = {
  valid: [
    // Using config -> shouldEnforceFallbacks: false
    {
      code: `token('shadow.card')`,
    },
    {
      code: `const background = 'hey';`,
    },
    {
      code: `import { e100 } from 'lib';`,
    },
    {
      // Variable declarations with color names should be ignored
      code: `var YELLOW = 'foo';`,
    },
    {
      code: `var yellow = 'foo';`,
    },
    {
      code: `var NOT_YELLOW = 'foo';`,
    },
    {
      code: `css({ background: 'none' })`,
    },
    {
      code: `css({ background })`,
    },
    {
      code: `import { B100 } from '@atlaskit/theme/colors';`,
    },
    {
      code: `css({ boxShadow: token('shadow.card') })`,
    },
    {
      code: `
            css\`
              box-shadow: \${token('shadow.card')};
            \`
          `,
    },
    {
      code: `
            css\`
              color: inherit;
              color: token('color.background.blanket');
            \`
          `,
    },
    {
      code: `
          styled.div\`
            color: inherit;
            color: \${token('color.background.blanket')};
          \`
        `,
    },
    {
      code: `
          const containerShadowStyles = css({
            boxShadow: token( 'elevation.shadow.raised', \`0 4px 8px -2px \${N50A}, 0 0 1px \${N60A}\`),
          });
        `,
    },
    {
      // Should not enforce types
      code: `
          type Colors =
          | 'red'
          | 'green'
          | 'yellow';
        `,
    },
    {
      code: `
          const number = 123;
          const aString = number.toString();
        `,
    },
    {
      code: `const green = token('color.background.accent.green');`,
    },
    {
      code: `
          const colors = { green: token('color.background.accent.green') };
          return colors.green;
          `,
    },
    {
      code: `
          const green = token('color.background.accent.green');
          const colors = { green };
          `,
    },
    {
      code: `
          colors.green = token('color.background.accent.green');
          colors['blue'] = token('color.background.accent.blue');
          `,
    },
    {
      code: `const GOLD_YEARLY = Products.Member.Gold.yearly;`,
    },
    // Using config -> shouldEnforceFallbacks: true
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `token('shadow.card', background())`,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `import { B100 } from '@atlaskit/theme/colors';`,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
          css({
            boxShadow: token('shadow.card', 'red'),
          })
        `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
          css({
            boxShadow: getTokenValue('shadow.card', 'red'),
          })
        `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
          css\`
            box-shadow: \${token('shadow.card', 'red')};
          \`
        `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
          css\`
            box-shadow: \${getTokenValue('shadow.card', 'red')};
          \`
        `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
          css\`
            color: inherit;
            color: \${token('color.background.blanket', 'red')};
          \`
        `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
          styled.div\`
            color: inherit;
            color: \${token('color.background.blanket', 'red')};
          \`
        `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
          token('color.background.blanket', 'red');
          token('color.background.blanket', B100);
          token('color.background.blanket', colors.B200);
        `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
          token('color.background.blanket', 'red');
        `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
          const number = 123;
          const aString = number.toString();
        `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
        css({
          backgroundColor: token('color.background.blanket', background())
        })
        `,
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `
        const state = {
          value: 'red',
          color: 'blue',
          textColor: text(),
          bgColor: background,
        };
        `,
    },
    `const { value } = { color: 'blue' };`,
    `
        const options = [{ name: 'red', value: 'red', label: 'red' }]
        `,
    `
        const truncateCss = css\`
          white-space: nowrap;
        \`;
        `,
    `console.log(\`Removed \${text}.\`);`,
    `export const App = () => <SimpleTag text="Base Tag" testId="standard" />;`,
    `export const App = () => <Avatar src="0x400" />;`,
    // Qualified type identifiers are parsable
    `const options: Foo.Bar = { color: 'red' };`,
    // Using config -> exceptions: ['dangerouslyGetComputedToken', 'gold']
    {
      options: [
        {
          shouldEnforceFallbacks: false,
          exceptions: ['dangerouslyGetComputedToken', 'gold'],
        },
      ],
      code: `dangerouslyGetComputedToken('color.text', N800);`,
    },
    {
      options: [
        {
          shouldEnforceFallbacks: false,
          exceptions: ['dangerouslyGetComputedToken', 'gold'],
        },
      ],
      code: `
            const GOLD_YEARLY = Products.Member.Gold.yearly;
            useQuery({
              variables: {
                product: GOLD_YEARLY,
              },
            });
          `,
    },
    {
      // Object keys with color names
      code: `const foo = { green: 'foo', YELLOW: 'bar' }`,
    },
    {
      // Switches with color names as conditions
      code: `
          switch (color) {
            case RED:
              break;
            case GREEN:
              break;
            case blue:
              break;
            case yellowDark:
              break;
          }
          `,
    },
    {
      // Conditions
      code: `if (response.status === YELLOW_STATUS) {}`,
    },
    {
      // arbitrary objects
      code: `
    const listInlineStyles = {
      [varSpacing]: spacing[this.props.spacing],
      maxWidth: 8 * 10 * items.length * 2,
      '--icon-primary-color': 'CanvasText',
      '--icon-secondary-color': canvas,
      [icon.name]: { ...metadata[icon.name], component: icon.icon },
    };`,
    },
    // Custom theming options
    {
      code: `
          import { setGlobalTheme } from '@atlaskit/tokens'
          setGlobalTheme({ UNSAFE_themeOptions: {brandColor: '#ff0000'}});
          `,
    },
    {
      // arbitrary jsx
      code: `
    <SectionMessageAction key={action.text} href={action.href}>
      {action.text}
    </SectionMessageAction>`,
    },
    {
      // false positive named colors
      code: `
      <span
        style={{
          color: secondary,
          backgroundColor: primary,
        }}
        data-testid="color-pill"
        css={colorPillStyles}
      >
        {name}
      </span>`,
    },
    {
      code: `
          const containerShadowStyles = xcss({
            backgroundColor: 'color.background.success',
          });
        `,
    },
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
            background-color: $\{token('elevation.surface.raised')};
            box-shadow: \${token('elevation.shadow.raised')};
          \`
        `,
      errors: [{ messageId: 'legacyElevation' }],
    },
    {
      code: `css\`\${text};\``,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `
          css\`
            box-shadow: 0px 1px 1px #161A1D32;
          \`
        `,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `
          css({
            boxShadow: '0px 1px 1px #161A1D32',
          })
        `,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `css({ color: 'red' })`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `
            css\`
              white-space: nowrap;
              color: red;
              background-color: #ccc;
              border-color: rgb(0, 0, 0);
              outline-color: rgba(0, 0, 0, 0.5);
              box-shadow: 0px 1px 1px hsl(0, 100%, 50%);
              border-top-color: hsla(0, 100%, 50%, 0.5);
              border-left-color: lch(29.2345% 44.2 27);
              border-right-color: lab(29.2345% 39.3825 20.0664);
              border-bottom-color: color(display-p3 1 0.5 0);
            \`;
          `,
      errors: [
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
      ],
    },
    {
      code: `
            styled.div\`
              white-space: nowrap;
              color: red;
              background-color: #ccc;
              border-color: rgb(0, 0, 0);
              outline-color: rgba(0, 0, 0, 0.5);
              box-shadow: 0px 1px 1px hsl(0, 100%, 50%);
              border-top-color: hsla(0, 100%, 50%, 0.5);
              border-left-color: lch(29.2345% 44.2 27);
              border-right-color: lab(29.2345% 39.3825 20.0664);
              border-bottom-color: color(display-p3 1 0.5 0);
            \`;
          `,
      errors: [
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
      ],
    },
    {
      code: `
          css({
            backgroundColor: background(),
          });
        `,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `
          css({
            color: colors.B100,
            color: P100,
          });
        `,
      errors: [
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
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
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
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
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
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
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
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
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
      ],
    },
    {
      code: `css({ boxShadow: '0 0 0 2px white' })`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<div color="red">Hello</div>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon fill="rgb(255, 171, 0)">Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon stroke="1px solid rgb(255, 171, 0)">Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon fill={B400}>Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon css={{ color: B400 }}>Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon css={css({ color: B400 })}>Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon css={css\`color: \${B400}\`}>Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon css={css\`color: #eee;\`}>Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `<Icon fill={colors.B400}>Hello</Icon>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `const myStyles = { color: 'red' };`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    // TODO: Fails typescripteslinttester for some reason???
    {
      code: `const options: CSSProperties = { color: 'red' };`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `const options: CSSObject = { color: 'red' };`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      code: `css({
        boxSizing: 'border-box',
        width: '100%',
        padding: \`\${token('space.075', '6px')} \${token('space.075', '6px')}\`,

        border: \`2px solid \${N40}\`,
        borderRadius: '3px',
        cursor: 'inherit',
        fontSize: '24px',
        fontWeight: 500,
        outline: 'none',
        ':focus': {
          border: \`2px solid \${B100}\`,
        },
      })
      `,
      errors: [
        { messageId: 'hardCodedColor' },
        { messageId: 'hardCodedColor' },
      ],
    },
  ],
};

const colorSuggestionTests: Tests = {
  valid: [],
  invalid: [
    // Using config -> shouldEnforceFallbacks: false
    {
      code: `css({ backgroundColor: 'red' })`,
      output: `css({ backgroundColor: 'red' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token`,
              output: `css({ backgroundColor: token('') })`,
            },
          ],
        },
      ],
    },
    {
      code: `css({ backgroundColor: 'rgb(123,123,123)' })`,
      output: `css({ backgroundColor: 'rgb(123,123,123)' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token`,
              output: `css({ backgroundColor: token('') })`,
            },
          ],
        },
      ],
    },
    {
      code: `css({ backgroundColor: '#423234' })`,
      output: `css({ backgroundColor: '#423234' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token`,
              output: `css({ backgroundColor: token('') })`,
            },
          ],
        },
      ],
    },
    {
      code: `css({ backgroundColor: background() })`,
      output: `css({ backgroundColor: background() })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token`,
              output: `css({ backgroundColor: token('') })`,
            },
          ],
        },
      ],
    },
    {
      code: `css({ backgroundColor: DN100 })`,
      output: `css({ backgroundColor: DN100 })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token`,
              output: `css({ backgroundColor: token('') })`,
            },
          ],
        },
      ],
    },
    {
      code: `css({ boxShadow: '0px 1px 1px #161A1D32' })`,
      output: `css({ boxShadow: '0px 1px 1px #161A1D32' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token`,
              output: `css({ boxShadow: token('') })`,
            },
          ],
        },
      ],
    },
    // Using config -> shouldEnforceFallbacks: true
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `css({ backgroundColor: 'red' })`,
      output: `css({ backgroundColor: 'red' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `css({ backgroundColor: token('', 'red') })`,
            },
          ],
        },
      ],
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `css({ backgroundColor: 'rgb(123,123,123)' })`,
      output: `css({ backgroundColor: 'rgb(123,123,123)' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `css({ backgroundColor: token('', 'rgb(123,123,123)') })`,
            },
          ],
        },
      ],
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `css({ backgroundColor: '#423234' })`,
      output: `css({ backgroundColor: '#423234' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `css({ backgroundColor: token('', '#423234') })`,
            },
          ],
        },
      ],
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `css({ backgroundColor: background() })`,
      output: `css({ backgroundColor: background() })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `css({ backgroundColor: token('', background()) })`,
            },
          ],
        },
      ],
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `css({ backgroundColor: DN100 })`,
      output: `css({ backgroundColor: DN100 })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `css({ backgroundColor: token('', DN100) })`,
            },
          ],
        },
      ],
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `css({ boxShadow: '0px 1px 1px #161A1D32' })`,
      output: `css({ boxShadow: '0px 1px 1px #161A1D32' })`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `css({ boxShadow: token('', '0px 1px 1px #161A1D32') })`,
            },
          ],
        },
      ],
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `<Star primaryColor="rgb(255, 171, 0)" />`,
      output: `<Star primaryColor="rgb(255, 171, 0)" />`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `<Star primaryColor={token('', rgb(255, 171, 0))} />`,
            },
          ],
        },
      ],
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `<Star primaryColor={Y500} />`,
      output: `<Star primaryColor={Y500} />`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `<Star primaryColor={token('', Y500)} />`,
            },
          ],
        },
      ],
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `<Star primaryColor={color.Y500} />`,
      output: `<Star primaryColor={color.Y500} />`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `<Star primaryColor={token('', color.Y500)} />`,
            },
          ],
        },
      ],
    },
    {
      options: [{ shouldEnforceFallbacks: true }],
      code: `export const Highlight = (props) => (
  <div style={{ borderLeftColor: highlights[props.color] }} />
);`,
      output: `export const Highlight = (props) => (
  <div style={{ borderLeftColor: highlights[props.color] }} />
);`,
      errors: [
        {
          messageId: 'hardCodedColor',
          suggestions: [
            {
              desc: `Convert to token with fallback`,
              output: `export const Highlight = (props) => (
  <div style={{ borderLeftColor: token('', highlights[props.color]) }} />
);`,
            },
          ],
        },
      ],
    },
  ],
};

const colorExceptionTests: Tests = {
  valid: [
    {
      options: [{ exceptions: ['green'] }],
      code: `css({ color: 'green' });`,
    },
    {
      options: [{ exceptions: ['P100'] }],
      code: `css({ color: P100 });`,
    },
    {
      options: [{ exceptions: ['dangerouslyGetComputedToken'] }],
      code: `css({ color: dangerouslyGetComputedToken('foo') });`,
    },
    {
      options: [{ exceptions: ['P100'] }],
      code: `css({ color: P100 });`,
    },
    {
      options: [{ exceptions: ['P100'] }],
      code: `css({ color: P100 });`,
    },
    {
      options: [{ exceptions: ['red'] }],
      code: `<div color="red"></div>`,
    },
    {
      options: [{ exceptions: ['red', 'gold'] }],
      code: `<div color="gold" fill="red"></div>`,
    },
    {
      options: [{ exceptions: ['myCustomColor'] }],
      code: `<div color={myCustomColor}></div>`,
    },
  ],
  invalid: [
    {
      options: [{ exceptions: [] }],
      code: `css({ color: P100 });`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      options: [{ exceptions: ['red', 'gold'] }],
      code: `<div color="blue"></div>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
    {
      options: [{ exceptions: [] }],
      code: `<div color={blue}></div>`,
      errors: [{ messageId: 'hardCodedColor' }],
    },
  ],
};

const allTests: Tests = {
  valid: [
    ...colorTests.valid,
    ...colorSuggestionTests.valid,
    ...colorExceptionTests.valid,
  ],
  invalid: [
    ...colorTests.invalid,
    ...colorSuggestionTests.invalid,
    ...colorExceptionTests.invalid,
  ],
};

tester.run('ensure-design-token-usage', rule, allTests);
