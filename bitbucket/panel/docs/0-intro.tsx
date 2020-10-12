import React from 'react';

import {
  AtlassianInternalWarning,
  code,
  Example,
  md,
  Props,
} from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

This panel component is designed hold content and expand and collapse with user interaction. It animates its opening and closing.

## Usage

${code`import Panel, { PanelStateless } from '@atlaskit/panel';`}

There are two initial visibility options for the panel: expanded or collapsed.
Panels are collapsed by default.

The default export is a component that you can set default state for.

${(
  <Example
    packageName="@atlaskit/panel"
    Component={require('../examples/01-collapsed').default}
    title="Basic"
    source={require('!!raw-loader!../examples/01-collapsed')}
  />
)}

We also provide a stateless version of the component which allows you
the ability to control whether the panel is expanded or collapsed programatically

${(
  <Example
    packageName="@atlaskit/panel"
    Component={require('../examples/05-stateless').default}
    title="Stateless"
    source={require('!!raw-loader!../examples/05-stateless')}
  />
)}

Panels are not a fixed height and will expand to the height of the content inside.

${(
  <Props
    heading="Panel Default Props"
    props={require('!!extract-react-types-loader!../src/components/Panel/Panel')}
  />
)}

${(
  <Props
    heading="Panel Stateless Props"
    props={require('!!extract-react-types-loader!../src/components/Panel/PanelStateless')}
  />
)}
`;
