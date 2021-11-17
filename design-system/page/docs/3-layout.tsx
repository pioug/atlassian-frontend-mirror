import React from 'react';

import { Code } from '@atlaskit/code';
import { Example, md } from '@atlaskit/docs';

import { defaultGridColumnWidth } from '../src/constants';

/**
 * Hack because `react-markings` cannot interpolate inline items,
 * which we need for the width.
 */
const FixedLayoutDocs = () => (
  <p>
    A fixed layout will occupy a maximum of {defaultGridColumnWidth} pixels for
    each column space, plus a fixed amount based on the chosen spacing.
  </p>
);

/**
 * Hack because `react-markings` cannot interpolate inline items,
 * which we need for the code.
 */
const FluidLayoutDocs = () => (
  <p>
    Custom width pages are supported by setting <Code>layout="fluid"</Code> on
    the <Code>Grid</Code>. This will make the grid expand to fill its container.
  </p>
);

export default md`
Grids can have either a fixed or fluid layout, which determines its width.

## Fixed layout (default)

${(<FixedLayoutDocs />)}

${(
  <Example
    packageName="@atlaskit/page"
    Component={require('../examples/06-fixed-layout').default}
    title="Fixed layout example with 6 columns"
    source={require('!!raw-loader!../examples/06-fixed-layout')}
  />
)}

## Fluid layout (custom width)

${(<FluidLayoutDocs />)}

${(
  <Example
    packageName="@atlaskit/page"
    Component={require('../examples/07-fluid-layout').default}
    title="Fluid layout example with 6 columns"
    source={require('!!raw-loader!../examples/07-fluid-layout')}
  />
)}
`;
