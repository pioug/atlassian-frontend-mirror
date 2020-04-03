import React from 'react';
import { md, code, Example } from '@atlaskit/docs';

const PitchSentence = () => (
  <p>
    Below is an icon explorer just for object icons. You can view an icon
    explorer that includes all icons at the{' '}
    <a href="/packages/core/icon">main icons package documentation</a>
  </p>
);

export default md`
This package includes the field-interface icons. These are a subset of icons with the following unique attributes:

- They are represented at only 2 sizes, each size being a unique svg
    - a 16*16px icon
    - a 24*24px icon
- They do not have the sizing prop.
- They have specific colours by default.
- they have a different API to icons in the \`@atlaskit/icons\` package.

## Usage

${code`
import CodeIcon from '@atlaskit/icon-object/glyph/code/16';

const MyComponent = () => (
    <CodeIcon />
)
`}

If you want to use the CodeIcon at a different size, you would need
to import the 24px version of the icon as follows:

${code`
import CodeIcon from '@atlaskit/icon-object/glyph/code/24';

const MyComponent = () => (
    <CodeIcon />
)
`}

${(<PitchSentence />)}

${(
  <Example
    packageName="@atlaskit/icon-object"
    Component={require('../examples/icon-explorer').default}
    title="Icon Explorer"
    source={require('!!raw-loader!../examples/icon-explorer')}
  />
)}
`;
