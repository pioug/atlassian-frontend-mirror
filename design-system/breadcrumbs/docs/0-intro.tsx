import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`

  Breadcrumbs are used for nested navigation, with each item acting as a link.
  There is a stateful default export that handles expansion of the collapse
  view, and passes other props on to the stateless export.

  Breadcrumbs are used as the wrapper component. BreadcrumbsItem is the rendering component for each individual item in the
  list.

  ## Usage

  ${code`import Breadcrumbs, { BreadcrumbsItem } from '@atlaskit/breadcrumbs';`}


  A Breadcrumbs component with no items will not be rendered.

  ${(
    <Example
      packageName="@atlaskit/breadcrumbs"
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/breadcrumbs"
      Component={require('../examples/8-expand').default}
      title="With Expand"
      source={require('!!raw-loader!../examples/8-expand')}
    />
  )}

  ${(
    <Props
      heading="Breadcrumbs Props"
      props={require('!!extract-react-types-loader!../src/components/Breadcrumbs')}
    />
  )}

  ${(
    <Props
      heading="BreadcrumbsStateless Props"
      props={require('!!extract-react-types-loader!../src/components/Breadcrumbs')}
    />
  )}

  ${(
    <Props
      heading="BreadcrumbsItem Props"
      props={require('!!extract-react-types-loader!../src/components/BreadcrumbsItem')}
    />
  )}

`;
