import React from 'react';

import { AtlassianInternalWarning, md } from '@atlaskit/docs';
import { createEditorUseOnlyNotice } from '@atlaskit/editor-core/docs/editor-use-only';

export default md`

  ${createEditorUseOnlyNotice('Editor Plugin Avatar Group', [
    { name: 'Editor Core', link: '/packages/editor/editor-core' },
  ])}

  ${(
    <>
      <div style={{ marginTop: '0.5rem' }}>
        <AtlassianInternalWarning />
      </div>
    </>
  )}

  This package includes the avatar group plugin used by @atlaskit/editor-core.

  ## Usage
---
// Add in info about plugin.

### Plugin dependencies


### Plugin configuration


### Shared state


### Actions


### Commands


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.

## License
---
 Please see [Atlassian Frontend - License](https://developer.atlassian.com/cloud/framework/atlassian-frontend/#license) for more licensing information.
`;
