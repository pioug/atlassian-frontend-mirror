import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  Empty State is used for various scenarios, for example: empty search, 
  no items, broken link, general error message, welcome screen etc. 
  (usually it takes the whole page).

  ## Usage

  ${code`import EmptyState from '@atlaskit/empty-state';`}

  ${(
    <Example
      packageName="@atlaskit/empty-state"
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${(
    <Props
      heading="EmptyState Props"
      props={require('!!extract-react-types-loader!../src/EmptyState')}
    />
  )}
`;
