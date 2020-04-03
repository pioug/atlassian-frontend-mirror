import React from 'react';
import { md, Props, Example, code } from '@atlaskit/docs';

export default md`
  A Toggle component. It is a checkbox displayed in an alternative way.

  ## Usage

  ${code`import Toggle from '@atlaskit/toggle';`}

  The default export is a component that you can control and listen to events.

  ${(
    <Example
      packageName="@atlaskit/toggle"
      Component={require('../examples/0-stateful').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-stateful')}
    />
  )}

  We also provide a stateless version of the component which allows you the ability
  to control whether the toggle is checked or not programatically

  ${(
    <Example
      packageName="@atlaskit/toggle"
      Component={require('../examples/1-stateless').default}
      title="Stateless"
      source={require('!!raw-loader!../examples/1-stateless')}
    />
  )}

  ${(
    <Props
      heading="Toggle Default Props"
      props={require('!!extract-react-types-loader!../src/Toggle')}
    />
  )}

  ${(
    <Props
      heading="Toggle Stateless Props"
      props={require('!!extract-react-types-loader!../src/ToggleStateless')}
    />
  )}
`;
