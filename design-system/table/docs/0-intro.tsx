/* eslint-disable @atlassian/tangerine/import/entry-points */
import React from 'react';

import {
  AtlassianInternalWarning,
  DevPreviewWarning,
  Example,
  md,
} from '@atlaskit/docs';
import Stack from '@atlaskit/ds-explorations/stack';

export default md`
  ${(
    <Stack gap="space.200">
      <AtlassianInternalWarning />
      <DevPreviewWarning />
    </Stack>
  )}

  A table is used to display data.

  ## Usage

  ${(
    <Example
      packageName="@atlaskit/table"
      Component={require('../examples/basic').default}
      title="Basic example"
      source={require('!!raw-loader!../examples/basic')}
    />
  )}

`;
