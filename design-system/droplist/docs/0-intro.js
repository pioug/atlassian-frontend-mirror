import React from 'react';

import { code, Example, md } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage appearance="error" title="WARNING: DROPLIST IS DEPRECATED">
    Do not use this component - there are better more robust components waiting
    just for you! For the pop up behaviour please use{' '}
    <a href="/packages/design-system/popup">@atlaskit/popup</a> and for common
    menu components please use{' '}
    <a href="/packages/design-system/menu">@atlaskit/menu</a>.
  </SectionMessage>
)}

An internal base component for implementing dropdown and select components.

 ## Usage

${code`
import DropList, {
  DroplistGroup,
  Item
} from '@atlaskit/droplist';
`}

  This is a base component on which such components as @atlaskit/dropdown-menu,
  @atlaskit/single-select, @atlaskit/multi-select are built. It contains only styles and
  very basic logic. It does not have any keyboard interactions, selectable logic or
  open/close functionality

  ${(
    <Example
      packageName="@atlaskit/droplist"
      Component={require('../examples/00-basic-example').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/droplist"
      Component={require('../examples/01-bound-example').default}
      title="Bound Example"
      source={require('!!raw-loader!../examples/01-bound-example')}
    />
  )}
`;
