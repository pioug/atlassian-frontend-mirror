import React from 'react';
import { md, AtlassianInternalWarning } from '@atlaskit/docs';
import { createMediaUseOnlyNotice } from '@atlaskit/media-common/docs';

const _default_1: any = md`
  ${createMediaUseOnlyNotice('Media UI', [
		{ name: 'Media Card', link: '/packages/media/media-card' },
		{ name: 'Media Picker', link: '/packages/media/media-picker' },
	])}

  ${(<AtlassianInternalWarning />)}

  This package includes common components and utilities used by other media packages.

`;
export default _default_1;
// TODO: Add props for each subviews using Props from extract react-type
