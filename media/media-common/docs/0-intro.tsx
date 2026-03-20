import React from 'react';
import { md, AtlassianInternalWarning } from '@atlaskit/docs';
import { createMediaUseOnlyNotice } from '../src/docs/media-use-only';
const _default_1: any = md`
  ${createMediaUseOnlyNotice('Media Common', [
		{ name: 'Media Card', link: '/packages/media/media-card' },
		{ name: 'Media Picker', link: '/packages/media/media-picker' },
	])}

  ${(<AtlassianInternalWarning />)}
  
  This package includes common utilities used by other media packages.
`;
export default _default_1;
