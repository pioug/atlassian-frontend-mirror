import React from 'react';

import {
  AtlassianInternalWarning,
  DevPreviewWarning,
  md,
} from '@atlaskit/docs';

import { Stack } from '../src';

export default md`
${(
  <Stack gap="space.100">
    <AtlassianInternalWarning />
    <DevPreviewWarning />
  </Stack>
)}`;
