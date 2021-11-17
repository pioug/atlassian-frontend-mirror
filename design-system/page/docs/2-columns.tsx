import React from 'react';

import { Code } from '@atlaskit/code';
import { Example, md } from '@atlaskit/docs';

/**
 * Hack because `react-markings` cannot interpolate inline items,
 * which we need for the code.
 */
const ColumnSpanDocs = () => (
  <p>
    The span of a <Code>GridColumn</Code> is determined by its{' '}
    <Code>medium</Code> prop.
  </p>
);

export default md`
${(<ColumnSpanDocs />)}

${(
  <Example
    packageName="@atlaskit/page"
    Component={require('../examples/05-columns').default}
    title="Spacing"
    source={require('!!raw-loader!../examples/05-columns')}
  />
)}
`;
