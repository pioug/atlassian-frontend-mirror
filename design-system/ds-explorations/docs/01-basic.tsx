import React from 'react';

import {
  AtlassianInternalWarning,
  DevPreviewWarning,
  md,
} from '@atlaskit/docs';

export default md`
${(
  <>
    <div style={{ marginBottom: 8 }}>
      <AtlassianInternalWarning />
    </div>
    <div style={{ marginTop: 8 }}>
      <DevPreviewWarning />
    </div>
  </>
)}`;
