import React from 'react';

import { code, Example, md, Props } from '@atlaskit/docs';

export default md`
  ## Documentation

  All the supplementary documentation can be found in the **sidebar nav links**  👈

  - [Customization](popup/docs/customization)
  - [Nested popups](popup/docs/nested-popups)
  - [Focus management](popup/docs/focus-management)
  - [Triggerless popups](popup/docs/triggerless-popups)
  - [Content updates](popup/docs/content-updates)

  ## Usage

  ${code`
import Popup from '@atlaskit/popup';
  `}

  ${(
    <Example
      packageName="@atlaskit/popup"
      Component={require('../examples/default').default}
      source={require('!!raw-loader!../examples/default')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/Popup')}
    />
  )}
`;
