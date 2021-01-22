import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Dynamic table stateless behaves the same as dynamic table,
  but requires control of its state from a parent component.

  ## Usage

  ${code`import { DynamicTableStateless } from '@atlaskit/dynamic-table';`}

  ${(
    <Example
      packageName="@atlaskit/dynamic-table"
      Component={require('../examples/1-stateless').default}
      title=""
      source={require('!!raw-loader!../examples/1-stateless')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/Stateless')}
    />
  )}
`;
