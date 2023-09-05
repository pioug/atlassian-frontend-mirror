import React from 'react';
import { md, AtlassianInternalWarning } from '@atlaskit/docs';
import {
  createRxjsNotice,
  createMediaUseOnlyNotice,
  createSingletonNotice,
} from '@atlaskit/media-common/docs';

const packageName = 'Media Core';

export default md`
${createSingletonNotice(packageName)}

${createMediaUseOnlyNotice(packageName, [
  { name: 'Media Card', link: '/packages/media/media-card' },
  { name: 'Media Picker', link: '/packages/media/media-picker' },
])}

${(<AtlassianInternalWarning />)}

${createRxjsNotice(packageName)}

  This package is required by other Media Components, and should not be used
  directly.

  It holds shared code between Media Components, such as:

  * models
  * providers
  * interfaces
`;
