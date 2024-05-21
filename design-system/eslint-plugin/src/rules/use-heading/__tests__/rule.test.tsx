// @ts-ignore
import { ruleTester } from '@atlassian/eslint-utils';

import rule from '../index';

ruleTester.run('use-heading', rule, {
  valid: [
    // ignores divs
    '<div><div></div></div>',
    '<div><div /></div>',
    // ignore heading elements with no children
    '<div><h1></h1></div>',
    '<div><h1 /></div>',
    '<div><h2></h2></div>',
    '<div><h2 /></div>',
    '<div><h3></h3></div>',
    '<div><h3 /></div>',
    '<div><h4></h4></div>',
    '<div><h4 /></div>',
    '<div><h5></h5></div>',
    '<div><h5 /></div>',
    '<div><h6></h6></div>',
    '<div><h6 /></div>',
    // ignores headings that are the root element
    `
    <h1>text 1</h1>
    `,
    // ignores headings that are not the first element
    `
      <div>
        <p>text 1</p>
        {children}
        <h1>text 2</h1>
      </div>
    `,
    `
      <div>
        <p>text 1</p>
        <h1>text 2</h1>
      </div>
    `,
  ],
  invalid: [
    // No sibling elements
    {
      code: [`<div><h2>content</h2></div>`].join('\n'),
      errors: [
        {
          messageId: 'preferHeading',
          suggestions: [
            {
              desc: `Convert to Heading`,
              output: [
                `import Heading from '@atlaskit/heading';`,
                `<div><Heading size='large'>content</Heading></div>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    // Sibling elements after the current element
    {
      code: [`<div><h2>content</h2><span>content</span></div>`].join('\n'),
      errors: [
        {
          messageId: 'preferHeading',
          suggestions: [
            {
              desc: `Convert to Heading`,
              output: [
                `import Heading from '@atlaskit/heading';`,
                `<div><Heading size='large'>content</Heading><span>content</span></div>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    // All 6 heading elements
    {
      code: [
        `import Heading from '@atlaskit/heading';`,
        `<div>`,
        `<div><h1>heading 1</h1></div>`,
        `<div><h2>heading 2</h2></div>`,
        `<div><h3>heading 3</h3></div>`,
        `<div><h4>heading 4</h4></div>`,
        `<div><h5>heading 5</h5></div>`,
        `<div><h6>heading 6</h6></div>`,
        `</div>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferHeading',
          suggestions: [
            {
              desc: `Convert to Heading`,
              output: [
                `import Heading from '@atlaskit/heading';`,
                `<div>`,
                `<div><Heading size='xlarge'>heading 1</Heading></div>`,
                `<div><h2>heading 2</h2></div>`,
                `<div><h3>heading 3</h3></div>`,
                `<div><h4>heading 4</h4></div>`,
                `<div><h5>heading 5</h5></div>`,
                `<div><h6>heading 6</h6></div>`,
                `</div>`,
              ].join('\n'),
            },
          ],
        },
        {
          messageId: 'preferHeading',
          suggestions: [
            {
              desc: `Convert to Heading`,
              output: [
                `import Heading from '@atlaskit/heading';`,
                `<div>`,
                `<div><h1>heading 1</h1></div>`,
                `<div><Heading size='large'>heading 2</Heading></div>`,
                `<div><h3>heading 3</h3></div>`,
                `<div><h4>heading 4</h4></div>`,
                `<div><h5>heading 5</h5></div>`,
                `<div><h6>heading 6</h6></div>`,
                `</div>`,
              ].join('\n'),
            },
          ],
        },
        {
          messageId: 'preferHeading',
          suggestions: [
            {
              desc: `Convert to Heading`,
              output: [
                `import Heading from '@atlaskit/heading';`,
                `<div>`,
                `<div><h1>heading 1</h1></div>`,
                `<div><h2>heading 2</h2></div>`,
                `<div><Heading size='medium'>heading 3</Heading></div>`,
                `<div><h4>heading 4</h4></div>`,
                `<div><h5>heading 5</h5></div>`,
                `<div><h6>heading 6</h6></div>`,
                `</div>`,
              ].join('\n'),
            },
          ],
        },
        {
          messageId: 'preferHeading',
          suggestions: [
            {
              desc: `Convert to Heading`,
              output: [
                `import Heading from '@atlaskit/heading';`,
                `<div>`,
                `<div><h1>heading 1</h1></div>`,
                `<div><h2>heading 2</h2></div>`,
                `<div><h3>heading 3</h3></div>`,
                `<div><Heading size='small'>heading 4</Heading></div>`,
                `<div><h5>heading 5</h5></div>`,
                `<div><h6>heading 6</h6></div>`,
                `</div>`,
              ].join('\n'),
            },
          ],
        },
        {
          messageId: 'preferHeading',
          suggestions: [
            {
              desc: `Convert to Heading`,
              output: [
                `import Heading from '@atlaskit/heading';`,
                `<div>`,
                `<div><h1>heading 1</h1></div>`,
                `<div><h2>heading 2</h2></div>`,
                `<div><h3>heading 3</h3></div>`,
                `<div><h4>heading 4</h4></div>`,
                `<div><Heading size='xsmall'>heading 5</Heading></div>`,
                `<div><h6>heading 6</h6></div>`,
                `</div>`,
              ].join('\n'),
            },
          ],
        },
        {
          messageId: 'preferHeading',
          suggestions: [
            {
              desc: `Convert to Heading`,
              output: [
                `import Heading from '@atlaskit/heading';`,
                `<div>`,
                `<div><h1>heading 1</h1></div>`,
                `<div><h2>heading 2</h2></div>`,
                `<div><h3>heading 3</h3></div>`,
                `<div><h4>heading 4</h4></div>`,
                `<div><h5>heading 5</h5></div>`,
                `<div><Heading size='xxsmall'>heading 6</Heading></div>`,
                `</div>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    // Heading module already imported
    {
      code: [
        `import Heading from '@atlaskit/heading';`,
        `<div><h2>content</h2><Heading>content</Heading></div>`,
      ].join('\n'),
      errors: [
        {
          messageId: 'preferHeading',
          suggestions: [
            {
              desc: `Convert to Heading`,
              output: [
                `import Heading from '@atlaskit/heading';`,
                `<div><Heading size='large'>content</Heading><Heading>content</Heading></div>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
    // JSXFragments as parent element
    {
      code: [`<><h2>content</h2><Heading>content</Heading></>`].join('\n'),
      errors: [
        {
          messageId: 'preferHeading',
          suggestions: [
            {
              desc: `Convert to Heading`,
              output: [
                `import Heading from '@atlaskit/heading';`,
                `<><Heading size='large'>content</Heading><Heading>content</Heading></>`,
              ].join('\n'),
            },
          ],
        },
      ],
    },
  ],
});
