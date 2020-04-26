import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`

  Page provides layout for other components

  ## Usage

${code`
import Page, { Grid, GridColumn } from '@atlaskit/page';
`}

  ${(
    <Example
      packageName="@atlaskit/page"
      Component={require('../examples/00-basic-usage').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-usage')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/page"
      Component={require('../examples/01-layout-example').default}
      title="Layout"
      source={require('!!raw-loader!../examples/01-layout-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/page"
      Component={require('../examples/02-nested-grid-example').default}
      title="Nested Grids"
      source={require('!!raw-loader!../examples/02-nested-grid-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/page"
      Component={require('../examples/03-grid-spacing-example').default}
      title="Spacing"
      source={require('!!raw-loader!../examples/03-grid-spacing-example')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/Page')}
      heading="Page Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/GridColumn')}
      heading="GridColumn Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/Grid')}
      heading="Grid Props"
    />
  )}

`;
