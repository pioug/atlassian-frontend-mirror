import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
Pagination is helpful when you do not want to bloat your page by showing all the data at once. In this case we expect user to
navigate through different pages of the component.

This component is mostly used with tables, see [dynamic-table](https://atlaskit.atlassian.com/packages/core/dynamic-table) for example.

## Usage:

${code`
import Pagination from '@atlaskit/pagination';
`}

${(
  <Example
    packageName="@atlaskit/pagination"
    Component={require('../examples/01-basic').default}
    title="Basic Pagination"
    source={require('!!raw-loader!../examples/01-basic')}
  />
)}

## Advance Usage

### Passing in the <Link> component from react-router

You can replace parts of the pagination UI by passing in custom components.

The following will render the pagination component by replacing the @atlaskit/button
component with the <Link> component from react-router.

${(
  <Example
    packageName="@atlaskit/pagination"
    Component={require('../examples/02-with-react-router').default}
    title="Usage with react router"
    source={require('!!raw-loader!../examples/02-with-react-router')}
  />
)}

${(
  <Props
    props={require('!!extract-react-types-loader!../src/components/Pagination')}
    heading="Pagination props"
  />
)}
`;
