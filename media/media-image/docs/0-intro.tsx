import React from 'react';
import {
  md,
  code,
  Example,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';
import { createRxjsNotice } from '@atlaskit/media-common/docs';

import { Hr } from './shared';

export default md`
  ${(<AtlassianInternalWarning />)}

  ${createRxjsNotice('Media Image')}

  ### 🛠 [Upgrade guide](/packages/media/media-image/docs/upgrade-guide)

  View this guide to help upgrade breaking changes between major versions of media-image.

  ${(<Hr />)}

  This package exports \`MediaImage\` component using
  [render prop pattern](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

  The render prop is called whenever the requested image status was changed.
  e.g. when the component is rendered it triggers the request and add the image status
  as \`loading\` and it changes to \`succeeded\` when Media API returns the image src
  data or image preview is available.

  This package is required by other Media Components, and should not be used
  directly.

  ## Usage

  ${code`import { MediaImage } from '@atlaskit/media-image';

  `}

  ${(
    <Example
      packageName="@atlaskit/media-image"
      Component={require('../examples/0-basic').default}
      title="MediaImage Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  The component loads the image based on these propss.

  ${(
    <Props
      heading="MediaImage Props"
      props={require('!!extract-react-types-loader!../src/mediaImage')}
    />
  )}

`;
