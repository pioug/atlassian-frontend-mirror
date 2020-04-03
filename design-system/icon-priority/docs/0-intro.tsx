import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

const PitchSentence = () => (
  <p>
    Below is an icon explorer just for priority icons. You can view an icon
    explorer that includes all icons at the{' '}
    <a href="/packages/core/icon">main icons package documentation</a>
  </p>
);

export default md`
This package includes the priority icons. These are a subset of icons with specific colours by default.

## Usage

${code`
import PriorityLowest from '@atlaskit/icon-priority/glyph/priority-lowest';

const MyComponent = () => (
    <PriorityLowest size="medium" />
)
`}

${(
  <Example
    packageName="@atlaskit/icon-priority"
    Component={require('../examples/01-icon-explorer').default}
    title="Icon Explorer"
    source={require('!!raw-loader!../examples/01-icon-explorer')}
  />
)}

${(<PitchSentence />)}

${(
  <Props
    heading="Icon Props"
    props={require('!!extract-react-types-loader!../src/components/Icon')}
  />
)}
`;
