import React from 'react';
import { md, AtlassianInternalWarning } from '@atlaskit/docs';
import { createRxjsNotice } from '@atlaskit/media-common/rxjs-notice';
import { createMediaUseOnlyNotice } from '@atlaskit/media-common/media-use-only';
import { createSingletonNotice } from '@atlaskit/media-common/singleton-notice';

const packageName = 'Media Core';

const _default_1: any = md`
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
export default _default_1;
