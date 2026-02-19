import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

export default md`

${createEditorUseOnlyNotice('Editor Plugin Base', [
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

  This package includes the base plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, and \`state\` of the plugin are defined below:

${code`
export interface BasePluginOptions {
  allowInlineCursorTarget?: boolean;
  allowScrollGutter?: ScrollGutterPluginOptions;
  /** deprecated do not use */
  browserFreezeTracking?: BrowserFreezetracking;
  /** deprecated do not use */
  inputTracking?: InputTracking;
}

export type BasePluginState = {
  allowScrollGutter?: ScrollGutterPluginOptions;
  /** Current height of keyboard (+ custom toolbar) in iOS app */
  keyboardHeight: number | undefined;
};

export type BasePlugin = NextEditorPlugin<
  'base',
  {
    actions: {
      registerMarks: (callback: Callback) => void;
      resolveMarks: (from: number, to: number, tr: Transaction) => void;
      setKeyboardHeight: typeof setKeyboardHeight;
    };
    dependencies: [OptionalPlugin<FeatureFlagsPlugin>, OptionalPlugin<ContextIdentifierPlugin>];
    pluginConfiguration: BasePluginOptions | undefined;
    sharedState: BasePluginState;
  }
>;

export type Callback = ({
  node,
  tr,
  pos,
  from,
  to,
}: {
  from: number;
  node: PMNode;
  pos: number;
  to: number;
  tr: Transaction;
}) => void;
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
