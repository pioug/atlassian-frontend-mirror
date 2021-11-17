import React from 'react';

import { Code } from '@atlaskit/code';
import { Example, md } from '@atlaskit/docs';

/**
 * Hack because `react-markings` cannot interpolate inline items,
 * which we need for the code.
 */
const NestingDocs = () => (
  <>
    <p>Grids can be nested inside of each other to form complex layouts.</p>
    <p>
      If a nested <Code>Grid</Code> is inside of a <Code>GridColumn</Code> with
      a provided value for <Code>medium</Code>, then the nested{' '}
      <Code>Grid</Code> will use that <Code>medium</Code> value as its default
      number of columns.
    </p>
  </>
);

export default md`
${(<NestingDocs />)}

${(
  <Example
    packageName="@atlaskit/page"
    Component={require('../examples/02-nested-grid-example').default}
    title="Nested grids"
    source={require('!!raw-loader!../examples/02-nested-grid-example')}
  />
)}
`;
