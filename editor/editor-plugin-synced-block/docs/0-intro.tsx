import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- md template from @atlaskit/docs
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Synced Block', [
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

  This package includes the synced block plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
export type SyncedBlockEditorProps = {
  defaultDocument: JSONDocNode;
  onChange: (
    editorView: EditorView,
    meta: {
      /**
       * Indicates whether or not the change may be unnecessary to listen to (dirty
       * changes can generally be ignored).
       *
       * This might be changes to media attributes for example when it gets updated
       * due to initial setup.
       *
       * We still fire these events however to avoid a breaking change.
       */
      isDirtyChange: boolean;
      source: 'local' | 'remote';
    },
  ) => void;
  onEditorReady: ({
    editorView,
    eventDispatcher,
  }: {
    editorView: EditorView;
    eventDispatcher: EventDispatcher;
  }) => void;
  popupsBoundariesElement: HTMLElement;
  popupsMountPoint: HTMLElement;
};

export type SyncedBlockRendererProps = {
  api?: ExtractInjectionAPI<SyncedBlockPlugin>;
  syncBlockFetchResult: UseFetchSyncBlockDataResult;
};

export interface SyncedBlockPluginOptions extends LongPressSelectionPluginOptions {
	/**
	 * Enables Live Page specific behaviour for the synced block plugin.
	 *
	 * It is only supported for use by Confluence.
	 *
	 * @default false
	 */
	__livePage?: boolean;
  enableSourceCreation?: boolean;
  syncBlockDataProvider: SyncBlockDataProviderInterface;
  syncedBlockRenderer: (props: SyncedBlockRendererProps) => React.JSX.Element;
}

export type SyncedBlockPlugin = NextEditorPlugin<
  'syncedBlock',
  {
    actions: {
      /**
       * Save content of bodiedSyncBlock nodes in local cache to backend.
       * This action allows bodiedSyncBlock to be saved in sync with product saving experience
       * as per {@link https://hello.atlassian.net/wiki/spaces/egcuc/pages/5932393240/Synced+Blocks+Save+refresh+principles}
       *
       * @returns true if saving all nodes successfully, false if fail to save some/all nodes
       */
      flushBodiedSyncBlocks: () => Promise<boolean>;
      /**
       * Save reference synced blocks on the document (tracked by local cache)to the backend.
       * This action allows syncBlock on the document to be saved in sync with product saving experience
       * as per {@link https://hello.atlassian.net/wiki/spaces/egcuc/pages/5932393240/Synced+Blocks+Save+refresh+principles}
       *
       * @returns true if flushing all syncBlocks successfully, false otherwise
       */
      flushSyncedBlocks: () => Promise<boolean>;
    };
    commands: {
      copySyncedBlockReferenceToClipboard: (inputMethod: INPUT_METHOD) => EditorCommand;
      insertSyncedBlock: () => EditorCommand;
    };
    dependencies: [
      SelectionPlugin,
      FloatingToolbarPlugin,
      DecorationsPlugin,
      OptionalPlugin<BlockControlsPlugin>,
      OptionalPlugin<ToolbarPlugin>,
      OptionalPlugin<BlockMenuPlugin>,
      OptionalPlugin<AnalyticsPlugin>,
      OptionalPlugin<ConnectivityPlugin>,
      OptionalPlugin<EditorViewModePlugin>,
      OptionalPlugin<ContentFormatPlugin>,
      OptionalPlugin<UserIntentPlugin>,
      OptionalPlugin<FocusPlugin>,
    ];
    pluginConfiguration: SyncedBlockPluginOptions | undefined;
    sharedState: SyncedBlockSharedState | undefined;
  }
>;
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
export default _default_1;
