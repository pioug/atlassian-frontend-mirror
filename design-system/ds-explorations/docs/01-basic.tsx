import React from 'react';

import {
  AtlassianInternalWarning,
  DevPreviewWarning,
  md,
} from '@atlaskit/docs';
import { token } from '@atlaskit/tokens';

export default md`
${(
  <>
    <div style={{ marginBottom: token('space.100', '8px') }}>
      <AtlassianInternalWarning />
    </div>
    <div style={{ marginTop: token('space.100', '8px') }}>
      <DevPreviewWarning />
    </div>
  </>
)}`;
