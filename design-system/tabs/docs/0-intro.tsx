import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Use tabs to display multiple panels within a single window.

  ## Usage

  ${code`import Tabs,  { TabContent, TabItem } from '@atlaskit/tabs';`}

  ${(
    <Example
      packageName="@atlaskit/tabs"
      Component={require('../examples/00-defaultTabs').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-defaultTabs')}
    />
  )}

  ${(
    <Props
      heading="Tabs Props"
      props={require('!!extract-react-types-loader!../src/components/tabs')}
    />
  )}

  ### Tab Content Provided Props

  These props are provided to the component that you pass to \`components.Content\`.

  ${(
    <Props
      heading="TabContent Props"
      props={require('!!extract-react-types-loader!../src/components/tab-panel')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/tabs"
      Component={require('../examples/30-custom-tab-panel-component').default}
      title="Custom Content component"
      source={require('!!raw-loader!../examples/30-custom-tab-panel-component')}
    />
  )}

  ### Tab Item Provided Props

  These props are provided to the component that you pass to \`components.Item\`.

  ${(
    <Props
      heading="TabItem Props"
      props={require('!!extract-react-types-loader!../src/components/tab')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/tabs"
      Component={require('../examples/20-custom-tab-components').default}
      title="Custom Item component"
      source={require('!!raw-loader!../examples/20-custom-tab-components')}
    />
  )}
`;
