import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
## Documentation

All the documentation can be found in the **sidebar nav links**  👈

- [Navigation and banners](page/docs/navigation-and-banners)
- [Columns](page/docs/columns)
- [Layout](page/docs/layout)
- [Spacing](page/docs/spacing)
- [Nesting](page/docs/nesting)

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
  <Props
    props={require('!!extract-react-types-loader!../src/page')}
    heading="Page Props"
  />
)}

${(
  <Props
    props={require('!!extract-react-types-loader!../src/grid-column')}
    heading="GridColumn Props"
  />
)}

${(
  <Props
    props={require('!!extract-react-types-loader!../src/extract-react-types/grid-wrapper')}
    heading="Grid Props"
  />
)}

`;
