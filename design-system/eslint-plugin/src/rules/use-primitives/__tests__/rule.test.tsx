// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('use-primitives', rule, {
  valid: [
    // it ignores React components
    '<Component />',

    // it ignores self-closing Box
    '<Box />',

    // it ignores empty Box
    '<Box></Box>',

    // it ignores elements with mixed JSX/non-JSX children
    '<div><Button>open</Button> dialog</div>',

    // it ignores already transformed code
    `
      const myI18nValue: string = "Close dialog";
      <Text>{myI18nValue}</Text>
    `,

    // it ignores non-JSX code
    'const x = 10;',

    // it ignores elements that aren't div or span
    '<a></a>',

    // it ignores elements that only contain text
    '<span> leading and trailing space </span>',

    // it ignores string values defined as inline object notation
    '<a>{"link"}</a>',

    // it ignores string values defined as variable object notation
    `
      const myI18nValue: string = "Close dialog";
      <p>{myI18nValue}</p>
    `,

    // it ignores elements containing more than on JSX element
    `
      <span>
        <article>Some article</article>
        <article>Some other article</article>
      </span>
    `,

    // it handles nested styles to avoid false positives
    `
      const fakeStyles = css({
        width: '100%',
        height: '100%',
        '& > div': {
          display: 'flex',
          boxSizing: 'border-box',
        },
      });
      <div css={fakeStyles}>
        <Item>1</Item>
        <Item>2</Item>
      </div>
    `,
  ],
  invalid: [
    // it suggests Box for div elements
    {
      code: '<div></div>',
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `<Box></Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it suggests Box for span elements
    {
      code: '<span></span>',
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `<Box as="span"></Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it ignores existing Box elements
    {
      code: '<Box><div /></Box>',
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `<Box><Box /></Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it correctly transforms self closing tags
    {
      code: '<div />',
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `<Box />`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it suggests Box if the element only contains whitespace
    {
      code: '<span>  \n\n\t\t  \n\r  \t\t\t</span>',
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `<Box as="span">  \n\n\t\t  \n\r  \t\t\t</Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it suggests Box for div/span containing one JSX child
    {
      code: '<span><button>button content</button></span>',
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `<Box as="span"><button>button content</button></Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it suggests Box when the only child is a React.Fragment
    {
      code: [`<div>`, `  <>`, `    <button></button>`, `  </>`, `</div>`].join(
        '\n',
      ),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `<Box>`,
                `  <>`,
                `    <button></button>`,
                `  </>`,
                `</Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it updates the existing import correctly
    {
      code: [
        `import { Stack } from '@atlaskit/primitives'`,
        `<div></div>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Stack, Box } from '@atlaskit/primitives';\n`,
                `<Box></Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // Correctly maps existing attributes to props
    {
      code: [
        `<div`,
        `  data-testid="some-test-id" `,
        `  role="button"`,
        `  aria-live="polite"`,
        `  id="box-like"`,
        `>`,
        `</div>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `<Box testId="some-test-id" role="button" aria-live="polite" id="box-like">`,
                `</Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it suggests partial conversion if element has style attribute
    {
      code: `<div style={{ padding: "8px" }}></div>`,
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `// TODO: Manually convert styling into props`,
                `<Box style={{`,
                `  padding: \"8px\"`,
                `}}></Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it suggests partial conversion if element has css attribute
    {
      code: `<div css={css({ padding: "8px" })}></div>`,
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `// TODO: Manually convert styling into props`,
                `<Box css={css({`,
                `  padding: \"8px\"`,
                `})}></Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it suggests partial conversion if element has css attribute with a variable reference
    {
      code: [
        `const someStyles = css({ color: token('atlassian.red', 'red') });`,
        '<div css={someStyles}>{children}</div>',
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `const someStyles = css({ color: token('atlassian.red', 'red') });`,
                `// TODO: Manually convert styling into props`,
                `<Box css={someStyles}>{children}</Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it suggests partial conversion if element has class attribute
    {
      code: `<div class='container'></div>`,
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `// TODO: Manually convert styling into props`,
                `<Box class=\'container\'></Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it suggests partial conversion if element has className attribute
    {
      code: `<div className='container'></div>`,
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `// TODO: Manually convert styling into props`,
                `<Box className=\'container\'></Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it suggests Inline if element has multiple JSX children and appropriate styling
    {
      code: [
        `const flexStyles = css({ display: 'flex' });`,
        `<div css={flexStyles}>`,
        `  <a href=\"/\">Home</a>`,
        `  <a href=\"/about\">About</a>`,
        `  <a href=\"/contact\">Contact</a>`,
        `</div>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesInline',
          suggestions: [
            {
              desc: `Convert to Inline`,
              output: [
                `import { Inline } from '@atlaskit/primitives';`,
                `const flexStyles = css({ display: 'flex' });`,
                `// TODO: Manually convert styling into props`,
                `<Inline css={flexStyles}>`,
                `  <a href=\"/\">Home</a>`,
                `  <a href=\"/about\">About</a>`,
                `  <a href=\"/contact\">Contact</a>`,
                `</Inline>`,
              ].join('\n'),
            },
            {
              desc: `Convert to Flex`,
              output: [
                `import { Flex } from '@atlaskit/primitives';`,
                `const flexStyles = css({ display: 'flex' });`,
                `// TODO: Manually convert styling into props`,
                `<Flex css={flexStyles}>`,
                `  <a href=\"/\">Home</a>`,
                `  <a href=\"/about\">About</a>`,
                `  <a href=\"/contact\">Contact</a>`,
                `</Flex>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it suggests Stack if element has multiple JSX children and appropriate styling
    {
      code: [
        `const flexStyles = css({ display: 'flex', flexDirection: 'column' });`,
        `<span css={flexStyles}>`,
        `  <a href=\"/\">Home</a>`,
        `  <a href=\"/about\">About</a>`,
        `  <a href=\"/contact\">Contact</a>`,
        `</span>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesStack',
          suggestions: [
            {
              desc: `Convert to Stack`,
              output: [
                `import { Stack } from '@atlaskit/primitives';`,
                `const flexStyles = css({ display: 'flex', flexDirection: 'column' });`,
                `// TODO: Manually convert styling into props`,
                `<Stack css={flexStyles}>`,
                `  <a href=\"/\">Home</a>`,
                `  <a href=\"/about\">About</a>`,
                `  <a href=\"/contact\">Contact</a>`,
                `</Stack>`,
              ].join('\n'),
            },
            {
              desc: `Convert to Flex`,
              output: [
                `import { Flex } from '@atlaskit/primitives';`,
                `const flexStyles = css({ display: 'flex', flexDirection: 'column' });`,
                `// TODO: Manually convert styling into props`,
                `<Flex css={flexStyles}>`,
                `  <a href=\"/\">Home</a>`,
                `  <a href=\"/about\">About</a>`,
                `  <a href=\"/contact\">Contact</a>`,
                `</Flex>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // it suggests for real world example: https://stash.atlassian.com/projects/JIRACLOUD/repos/jira-frontend/commits/50026a9169018b0a01c6ab71bfa72e01b5f2d8f1#src/packages/portfolio-3/portfolio/src/app-simple-plans/view/main/tabs/dependencies/issue/story.tsx?f=11
    {
      code: [
        `<div`,
        `  style={{`,
        `    display: 'flex',`,
        `    flexBasis: '100%',`,
        `    flexDirection: 'column',`,
        `    flexGrow: 1,`,
        `    maxWidth: '100%',`,
        `    minHeight: '100%',`,
        `  }}`,
        `>`,
        `  <IssueExample position={{ x: 200, y: 100 }} itemId="10000" />`,
        `</div>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [
                `import { Box } from '@atlaskit/primitives';`,
                `// TODO: Manually convert styling into props`,
                `<Box style={{`,
                `  display: 'flex',`,
                `  flexBasis: '100%',`,
                `  flexDirection: 'column',`,
                `  flexGrow: 1,`,
                `  maxWidth: '100%',`,
                `  minHeight: '100%'`,
                `}}>`,
                `  <IssueExample position={{ x: 200, y: 100 }} itemId="10000" />`,
                `</Box>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },

    // use cases to deal with later...
    /*
    {
      code: [
        `const someStyles = css({ backgroundColor: token('color.background.neutral.bold', 'red') });`,
        `const Component = () => {`,
        `    return <div css={someStyles}>{children}</div>`,
        `};`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [`This currently breaks... FIXME`].join('\n'),
            },
          ],
        },
      ],
    },
    {
      code: [
        `const someStyles = css({ backgroundColor: token('color.background.neutral.bold', 'red') });`,
        `const Component = () => <div css={someStyles}>{children}</div>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesBox',
          suggestions: [
            {
              desc: `Convert to Box`,
              output: [`This currently breaks... FIXME`].join('\n'),
            },
          ],
        },
      ],
    },
    */
  ],
});
