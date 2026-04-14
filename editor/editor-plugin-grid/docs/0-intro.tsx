import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Grid', [
	{ name: 'Editor Core', link: '/packages/editor/editor-core' },
])}


  ${
		(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ marginTop: token('space.100') }}>
				<AtlassianInternalWarning />
			</div>
		)
	}

  This package includes the grid plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type GridPluginConfiguration = GridPluginOptions | undefined;

type GridPluginDependencies = [WidthPlugin];

type GridPluginSharedState = GridPluginState | null;

type GridPluginActions = {
  displayGrid: CreateDisplayGrid;
};

type GridPlugin = NextEditorPlugin<
  'grid',
  {
    pluginConfiguration: GridPluginConfiguration;
    dependencies: GridPluginDependencies;
    sharedState: GridPluginSharedState;
    actions: GridPluginActions;
  }
>;

interface GridPluginOptions {
  shouldCalcBreakoutGridLines?: boolean;
}

type GridPluginState = {
  gridType?: GridType;
  highlight: Highlights;
  visible: boolean;
};

type Highlights = Array<'wide' | 'full-width' | number>;

type CreateDisplayGrid = (view: EditorView) => DisplayGrid;
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
export default _default_1;
