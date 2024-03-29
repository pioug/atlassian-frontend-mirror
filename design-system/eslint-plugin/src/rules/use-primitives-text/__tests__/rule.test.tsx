// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('use-primitives-text', rule, {
  valid: [
    // ignores divs
    '<div></div>',
    // ignores paragraphs mixed with other elements
    `
      <div>
        <p>text 1</p>
        <p>text 2</p>
        <Box>{children}</Box>
      </div>`,
    `
      <div>
        <p>text 1</p>
        {children}
        <p>text 2</p>
      </div>
    `,
    `
      <div>
        {Boolean(value) && <p>text</p>}
      </div>
    `,
    // ignore span elements with potentially non-string children
    '<span>text<Image src="path/to/image.jpg" /></span>',
    '<span>{children}</span>',
    // ignores text elements with unallowed props
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <div>
        <span css={paddingStyles}>content</span>
        <strong css={paddingStyles}>content</strong>
        <em css={paddingStyles}>content</em>
        <div>
          <p css={paddingStyles}>content</p>
        </div>
      </div>
    `,
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <span css={paddingStyles} id='contentId' data-testid='contentTestId'>content</span>
    `,
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <span data-test-id='contentTestId'>content</span>
    `,
  ],
  invalid: [
    // it suggests Text for span elements with only text as children
    {
      code: [`<span>content</span>`].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesText',
          suggestions: [
            {
              desc: `Convert to Text`,
              output: [
                `import { Text } from '@atlaskit/primitives';`,
                `<Text>content</Text>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    // it suggests Text as strong for native strong elements
    {
      code: [`<strong>content</strong>`].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesText',
          suggestions: [
            {
              desc: `Convert to Text`,
              output: [
                `import { Text } from '@atlaskit/primitives';`,
                `<Text as='strong'>content</Text>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    // it suggests Text as em for native em elements
    {
      code: [`<em>content</em>`].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesText',
          suggestions: [
            {
              desc: `Convert to Text`,
              output: [
                `import { Text } from '@atlaskit/primitives';`,
                `<Text as='em'>content</Text>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    // it suggests Text for elements with only allowed props
    {
      code: [
        `<span key='contentKey' id='contentId' data-testid='contentTestId'>content</span>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesText',
          suggestions: [
            {
              desc: `Convert to Text`,
              output: [
                `import { Text } from '@atlaskit/primitives';`,
                `<Text key='contentKey' id='contentId' testId='contentTestId'>content</Text>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    // it suggests Text for paragraph elements that are the only child
    {
      code: [`<div>`, `  <p>text</p>`, `</div>`].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesText',
          suggestions: [
            {
              desc: `Convert to Text`,
              output: [
                `import { Text } from '@atlaskit/primitives';`,
                `<div>`,
                `  <Text as='p'>text</Text>`,
                `</div>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    // it suggests Text and Stack for groups of paragraph elements
    {
      code: [
        `<div>`,
        `  <p>text 1</p>`,
        `  <p data-testid='contentTestId'>text 2</p>`,
        `  <p>text 3</p>`,
        `</div>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesStackedText',
          suggestions: [
            {
              desc: `Convert to Text and Stack`,
              output: [
                `import { Text, Stack } from '@atlaskit/primitives';`,
                `<div><Stack space='space.150'>`,
                `  <Text as='p'>text 1</Text>`,
                `  <Text testId='contentTestId' as='p'>text 2</Text>`,
                `  <Text as='p'>text 3</Text>`,
                `</Stack></div>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    // it suggests Text with color inherit for text elements when option is enabled
    {
      options: [{ inheritColor: true }],
      code: [`<span>content</span>`].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesText',
          suggestions: [
            {
              desc: `Convert to Text`,
              output: [
                `import { Text } from '@atlaskit/primitives';`,
                `<Text color='inherit'>content</Text>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      options: [{ inheritColor: true }],
      code: [`<div>`, `  <p>text</p>`, `</div>`].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesText',
          suggestions: [
            {
              desc: `Convert to Text`,
              output: [
                `import { Text } from '@atlaskit/primitives';`,
                `<div>`,
                `  <Text as='p' color='inherit'>text</Text>`,
                `</div>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      options: [{ inheritColor: true }],
      code: [`<strong>content</strong>`].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesText',
          suggestions: [
            {
              desc: `Convert to Text`,
              output: [
                `import { Text } from '@atlaskit/primitives';`,
                `<Text as='strong' color='inherit'>content</Text>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      options: [{ inheritColor: true }],
      code: [`<em>content</em>`].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesText',
          suggestions: [
            {
              desc: `Convert to Text`,
              output: [
                `import { Text } from '@atlaskit/primitives';`,
                `<Text as='em' color='inherit'>content</Text>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    {
      options: [{ inheritColor: true }],
      code: [
        `<div>`,
        `  <p>text 1</p>`,
        `  <p data-testid='contentTestId'>text 2</p>`,
        `  <p>text 3</p>`,
        `</div>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferPrimitivesStackedText',
          suggestions: [
            {
              desc: `Convert to Text and Stack`,
              output: [
                `import { Text, Stack } from '@atlaskit/primitives';`,
                `<div><Stack space='space.150'>`,
                `  <Text as='p' color='inherit'>text 1</Text>`,
                `  <Text testId='contentTestId' as='p' color='inherit'>text 2</Text>`,
                `  <Text as='p' color='inherit'>text 3</Text>`,
                `</Stack></div>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
  ],
});
