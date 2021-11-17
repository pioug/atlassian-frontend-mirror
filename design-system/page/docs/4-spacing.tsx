import React from 'react';

import { Code } from '@atlaskit/code';
import { Example, md } from '@atlaskit/docs';

import { spacingMapping } from '../src/constants';

/**
 * Hack because `react-markings` cannot interpolate inline items,
 * which we need for the code.
 */
const SpacingOptions = () => (
  <ul>
    <li>
      <Code>cosy</Code> (default) – a medium amount of spacing (
      {spacingMapping.cosy}px).
    </li>
    <li>
      <Code>compact</Code> – a small amount of spacing ({spacingMapping.compact}
      px).
    </li>
    <li>
      <Code>comfortable</Code> – a large amount of spacing (
      {spacingMapping.comfortable}px).
    </li>
  </ul>
);

export default md`
The spacing between a grid's columns is configurable. There are three options available:

${(<SpacingOptions />)}

${(
  <Example
    packageName="@atlaskit/page"
    Component={require('../examples/03-spacing-example').default}
    title="Spacing"
    source={require('!!raw-loader!../examples/03-spacing-example')}
  />
)}
`;
