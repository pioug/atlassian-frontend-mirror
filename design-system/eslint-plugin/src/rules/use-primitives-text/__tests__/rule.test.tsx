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
    // ignore text elements with potentially non-string children
    '<span>text<Image src="path/to/image.jpg" /></span>',
    '<span>{children}</span>',
    // ignores text elements with unallowed props
    `
      import { css } from '@emotion/react';
      const paddingStyles = css({ padding: '8px' });
      <span css={paddingStyles}>content</span>
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
    // it suggests Text of variant ui for span elements with no style
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
                `<Text variant='ui'>content</Text>`,
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
                `<Text key='contentKey' id='contentId' testId='contentTestId' variant='ui'>content</Text>`,
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
                `  <Text>text</Text>`,
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
                `  <Text>text 1</Text>`,
                `  <Text testId='contentTestId'>text 2</Text>`,
                `  <Text>text 3</Text>`,
                `</Stack></div>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
  ],
});
