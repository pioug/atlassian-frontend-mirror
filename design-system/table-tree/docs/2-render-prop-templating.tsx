import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`
  For use cases that need fine-grained control, the \`TableTree\` allows for templating based on the 
  [render prop pattern](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) and several
  exported subcomponents.
  
  The render prop is called whenever a tree row needs to be displayed, e.g. when the user
  expands the parent row. 
  The render prop receives row's data and should return a React component — a row of cells displaying
  the data for the row.
  
  ${(
    <Example
      packageName="@atlaskit/table-tree"
      Component={
        require('../examples/render-prop-async-with-update-items').default
      }
      source={require('!!raw-loader!../examples/render-prop-async-with-update-items')}
      title="Basic"
      language="javascript"
    />
  )}
  
  The \`Headers\` component can be skipped if it's not necessary:
  
  ${(
    <Example
      packageName="@atlaskit/table-tree"
      Component={require('../examples/render-prop-no-headers').default}
      source={require('!!raw-loader!../examples/render-prop-no-headers')}
      title="No headers"
      language="javascript"
    />
  )}
  
  ## Subcomponents

  ## Headers
  A row holding the \`Header\` components. Can be skipped if no headers are needed.
  
  ## Header
  A header cell for the given column.
  
  ## Rows
  A placeholder that is automatically expanded into nested rows. Contains
  the render prop that is called to display the individual rows.
  The data is supplied by the \`items\` property.
  
  ## Row
  A row holding the data cells.
  
  ## Cell
  A cell of data to display.
  
`;
