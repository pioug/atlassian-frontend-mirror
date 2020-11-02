import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  Toggles are a quick way to view and switch between enabled or disabled states.
  Use toggles when your intent is to turn something on or off instantly (ex. Enable public access).
  If a physical switch would work for the action,
  a toggle is probably the best component to use.

  ## Usage

  ${code`
import Toggle from '@atlaskit/toggle';

<label htmlFor="toggle-button">Allow pull requests</label>
<Toggle
  id="toggle-button
/>
  `}

  ${(
    <Example
      packageName="@atlaskit/toggle"
      Component={require('../examples/6-ariaToggle').default}
      title=""
      source={require('!!raw-loader!../examples/6-ariaToggle')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/toggle"
      Component={require('../examples/0-stateful').default}
      title="Sizing"
      source={require('!!raw-loader!../examples/0-stateful')}
    />
  )}

  We provide a stateless version of the component which allows you the ability
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
      heading="Toggle Props"
      props={require('!!extract-react-types-loader!../src/toggle')}
    />
  )}

`;
