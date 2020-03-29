import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  The page header pattern is a template that helps combine other components (breadcrumbs, headings, actions, and selects) to create a consistent user experience.

  ## Usage

  ${code`import PageHeader from '@atlaskit/page-header';`}

  ${(
    <Example
      packageName="@atlaskit/page-header"
      Component={require('../examples/BasicExample').default}
      source={require('!!raw-loader!../examples/BasicExample')}
      title="Basic"
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/page-header"
      Component={require('../examples/ComplexExample').default}
      source={require('!!raw-loader!../examples/ComplexExample')}
      title="Complex"
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/page-header"
      Component={require('../examples/CustomTitleComponentExample').default}
      source={require('!!raw-loader!../examples/CustomTitleComponentExample')}
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
