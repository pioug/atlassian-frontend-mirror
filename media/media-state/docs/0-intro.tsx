import React from 'react';

import { AtlassianInternalWarning, md } from '@atlaskit/docs';
import {
  createMediaUseOnlyNotice,
  createSingletonNotice,
} from '@atlaskit/media-common/docs';

const packageName = 'Media State';

export default md`
${createSingletonNotice(packageName)}

${createMediaUseOnlyNotice(packageName, [
  { name: 'Media Card', link: '/packages/media/media-card' },
  { name: 'Media Picker', link: '/packages/media/media-picker' },
])}

${(<AtlassianInternalWarning />)}

This library provides a state management solution for Media frontend, particularly for caching the file states. It is built using [Zustand](https://github.com/pmndrs/zustand) and [Immer](https://immerjs.github.io/immer/), with devtools support for development environments.
`;
