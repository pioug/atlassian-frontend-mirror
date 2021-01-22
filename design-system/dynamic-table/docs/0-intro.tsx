import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  ${(
    <>
      <p>
        Dynamic tables give users the ability to add content to a table without
        refreshing the page. It comes with pagination, sorting, and re-ordering
        functionality. Dynamic table can be both controlled and uncontrolled.
      </p>

      <p>
        If this functionality is not needed, use the{' '}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table"
          target="_blank"
          rel="noopener noreferrer"
        >
          HTML table element
        </a>
        .
      </p>
    </>
  )}

  ## Usage

  ${code`import DynamicTable from '@atlaskit/dynamic-table';`}

  ${(
    <Example
      packageName="@atlaskit/dynamic-table"
      Component={require('../examples/0-stateful').default}
      title=""
      source={require('!!raw-loader!../examples/0-stateful')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/Stateful')}
    />
  )}
`;
