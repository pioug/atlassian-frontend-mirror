import React from 'react';

import { AtlassianInternalWarning, md } from '@atlaskit/docs';
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

export default md`

  ${createEditorUseOnlyNotice('Editor Plugin Media Insert', [
		{ name: 'Editor Core', link: '/packages/editor/editor-core' },
	])}

  ${
		(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ marginTop: token('space.100', '8px') }}>
				<AtlassianInternalWarning />
			</div>
		)
	}

  This package includes the media insert plugin used by @atlaskit/editor-core.

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
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
