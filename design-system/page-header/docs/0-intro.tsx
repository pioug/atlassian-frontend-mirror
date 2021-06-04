import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  The page header pattern is a template that helps combine other components (breadcrumbs, headings, actions, and selects) to create a consistent user experience.

  ## Usage

  ${code`import PageHeader from '@atlaskit/page-header';`}

  ${(
    <Example
      packageName="@atlaskit/page-header"
      Component={
        require('../examples/constellation/page-header-default').default
      }
      source={require('!!raw-loader!../examples/constellation/page-header-default')}
      title="Default"
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/page-header"
      Component={
        require('../examples/constellation/page-header-complex').default
      }
      source={require('!!raw-loader!../examples/constellation/page-header-complex')}
      title="Complex"
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/page-header"
      Component={
        require('../examples/constellation/page-header-custom-title').default
      }
      source={require('!!raw-loader!../examples/constellation/page-header-custom-title')}
      title="Custom title component"
    />
  )}

  ${(
    <Props
      heading="PageHeader Props"
      props={require('!!extract-react-types-loader!../src/PageHeader')}
    />
  )}
`;
