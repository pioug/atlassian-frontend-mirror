import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

export default md`

${createEditorUseOnlyNotice('Editor Plugin Track Changes', [
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

  This package includes the track changes plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type TrackChangesPlugin = NextEditorPlugin<
  'trackChanges',
  {
    commands: {
      /**
       * Toggles the displaying of changes in the editor.
       */
      toggleChanges: EditorCommand;
    };
    dependencies: [
      /**
       * Primary toolbar plugin for registering the track changes button.
       */
      OptionalPlugin<PrimaryToolbarPlugin>,
      /**
       * Show diff plugin for showing the changes in a diff view.
       */
      ShowDiffPlugin,
    ];
    pluginConfiguration?: {
      /**
       * Whether the track changes button should be shown on the toolbar.
       * Defaults to false.
       */
      showOnToolbar?: boolean;
    };
    sharedState: {
      /**
       * Whether the track changes feature is currently displaying changes.
       * Defaults to false.
       */
      isDisplayingChanges: boolean;
      /**
       * If there are changes in the document that determine if track changes button
       * should be enabled.
       * This will only be false initially before any changes in the session.
       */
      isShowDiffAvailable: boolean;
    };
  }
>;
`}

  ### Example Usage
---
${code`
import React from 'react';

import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { usePreset } from '@atlaskit/editor-core/use-preset';
import { basePlugin } from '@atlaskit/editor-plugins/base';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { showDiffPlugin } from '@atlaskit/editor-plugin-show-diff';
import { trackChangesPlugin } from '@atlaskit/editor-plugin-track-changes';

const styles = cssMap({
	aboveEditor: {
		paddingTop: token('space.100'),
		paddingBottom: token('space.100'),
	},
	everythingContainer: {
		paddingTop: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		paddingRight: token('space.200'),
	},
});

function Editor() {
	const { preset, editorApi } = usePreset(
		(builder) =>
			builder.add(basePlugin).add(showDiffPlugin).add(trackChangesPlugin),
		[],
	);

	const isSelected = useSharedPluginStateSelector(editorApi, 'trackChanges.isDisplayingChanges');

	return (
		<Box xcss={styles.everythingContainer}>
			<Box xcss={styles.aboveEditor}>
				<Button
					appearance="primary"
					onClick={() => {
						editorApi?.core.actions.execute(
							editorApi?.trackChanges.commands.toggleChanges,
						);
					}}
					isSelected={isSelected}
				>
					Show Diff
				</Button>
			</Box>
			<ComposableEditor preset={preset} />
		</Box>
	);
}

export default Editor;
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
