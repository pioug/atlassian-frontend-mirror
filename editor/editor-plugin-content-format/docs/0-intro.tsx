import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

export default md`

${createEditorUseOnlyNotice('Editor Plugin Content Format', [
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

  A shared state management plugin for the Atlassian Editor that tracks the content mode/format of the editor. This plugin enables other editor plugins and products to be aware of the current editor content format state and update it as needed.

  ## Overview

  The Content Format plugin provides:
  - **Shared state tracking**: Tracks the current content mode of the editor
  - **State sharing**: Makes state accessible to dependent plugins
  - **Simple command API**: \`api.contentFormat?.commands.updateContentMode(...)\` to update the state

  ## Usage

  ### Accessing Content Mode State

  Add the plugin as an optional dependency in your plugin:

${code`
import type { OptionalPlugin } from '@atlaskit/editor-common/types';
import type { ContentFormatPlugin } from '@atlaskit/editor-plugin-content-format';

export type YourPluginDependencies = [
  OptionalPlugin<ContentFormatPlugin>,
];
`}

  #### In your plugin:

${code`
const contentMode = api?.contentFormat?.sharedState?.contentMode;
`}

  #### In React components:

${code`
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ContentFormatPlugin } from '@atlaskit/editor-plugin-content-format';

type Props = {
  editorApi?: PublicPluginAPI<[ContentFormatPlugin]>;
};

export const MyComponent = ({ editorApi }: Props) => {
  const { contentMode } = useSharedPluginStateWithSelector(
    editorApi,
    ['contentFormat'],
    (states) => ({
      contentMode: states.contentFormatState?.contentMode,
    })
  );

  return <div>Current mode: {contentMode}</div>;
};
`}

  ### Updating Content Mode

  Products and plugins can update the content mode using the command:

${code`
api.contentFormat?.commands.updateContentMode('compact');
`}

  ## Plugin API

  ### Configuration Options

${code`
type ContentFormatPluginOptions = {
  initialContentMode?: EditorContentMode; // Defaults to 'standard'
};
`}

  ### Shared State

${code`
type ContentFormatPluginState = {
  contentMode: EditorContentMode;
};
`}

  ### Commands

  #### \`updateContentMode(mode: EditorContentMode)\`

  Updates the current content mode. Returns \`null\` if the mode hasn't changed (performance optimization).

  **Example:**
${code`
api.contentFormat?.commands.updateContentMode('dense');
`}

  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
`;
