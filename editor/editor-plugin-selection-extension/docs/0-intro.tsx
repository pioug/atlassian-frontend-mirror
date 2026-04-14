import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

  ${createEditorUseOnlyNotice('Editor Plugin Selection', [
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

  This package includes the selection extension plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, and \`state\` of the plugin are defined below:

${code`
export interface SelectionExtensionPluginOptions {
  extensionList?: ExtensionConfiguration[];
  extensions?: SelectionExtensions;
  pageModes?: SelectionExtensionModes | SelectionExtensionModes[];
}

export type SelectionExtensionSelectionInfo = {
  coords: SelectionExtensionCoords;
  from: number;
  text: string;
  to: number;
};

export type SelectionExtension = {
  component?: ComponentType<SelectionExtensionComponentProps>;
  icon?: ComponentType<PropsWithChildren<{ label: string }>>;
  isDisabled?: (params: SelectionExtensionCallbackOptions) => boolean;
  name: string;
  onClick?: (params: SelectionExtensionCallbackOptions) => void;
};

export type SelectionExtensionComponentProps = {
  closeExtension: () => void;
  selection: SelectionExtensionSelectionInfo;
};

export type SelectionExtensionCallbackOptions = {
  selectedNodeAdf?: ADFEntity;
  selection?: SelectionExtensionSelectionInfo;
  selectionRanges?: SelectionRange[];
};

export type SelectionExtensions = {
  external?: SelectionExtension[];
  firstParty?: SelectionExtension[];
};

export type SelectionRange = {
  end: SelectionPointer;
  start: SelectionPointer;
};

export type SelectionPointer = {
  pointer: string;
  position?: number;
};

export type SelectionExtensionCoords = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

export type ExtensionConfiguration = {
  blockMenu?: BlockMenuExtensionConfiguration;
  inlineToolbar?: ToolbarExtensionConfiguration;
  key: string;
  primaryToolbar?: ToolbarExtensionConfiguration;
  source: ExtensionSource;
};

export type ExtensionSource = 'first-party' | 'external';

export type ToolbarExtensionConfiguration = {
  getMenuItems?: GetMenuItemsFn;
  getToolbarItem?: GetToolbarItemFn;
};

export type BlockMenuExtensionConfiguration = {
  getMenuItems: GetMenuItemsFn;
  placement?: BlockMenuPlacement;
};

export type GetToolbarItemFn = () => ExtensionToolbarItemConfiguration;

export type GetMenuItemsFn = () => Array<ExtensionMenuItemConfiguration>;

export type GetNestedMenuItemsFn = () => Array<ExtensionMenuItemNestedConfiguration>;

export type ExtensionToolbarItemConfiguration = {
  icon: ComponentType<PropsWithChildren<{ label: string }>>;
  isDisabled?: boolean;
  key?: string;
  label?: string;
  onClick?: () => void;
  tooltip: string;
};

export type ExtensionMenuItemConfiguration =
  | ExtensionDropdownItemConfiguration
  | ExtensionNestedDropdownMenuConfiguration;

export type ExtensionDropdownItemConfiguration = {
  contentComponent?: ComponentType<SelectionExtensionComponentProps>;
  icon: ComponentType<PropsWithChildren<{ label: string; size?: 'small' | 'medium' }>>;
  isDisabled?: boolean;
  key?: string;
  label: string;
  lozenge?: { label: string };
  onClick?: () => void;
};

export type ExtensionNestedDropdownMenuConfiguration = {
  getMenuItems: GetNestedMenuItemsFn;
  icon: ComponentType<PropsWithChildren<{ label: string; size?: 'small' | 'medium' }>>;
  isDisabled?: boolean;
  key?: string;
  label: string;
};

export type SelectionExtensionPlugin = NextEditorPlugin<
  'selectionExtension',
  {
    actions: {
      getDocumentFromSelection: () => { selectedNodeAdf?: ADFEntity } | null;
      getSelectionAdf: () => SelectionAdfResult;
      insertAdfAtEndOfDoc: (nodeAdf: ADFEntity) => InsertAdfAtEndOfDocResult;
      replaceWithAdf: (nodeAdf: ADFEntity) => ReplaceWithAdfResult;
    };
    commands: {
      clearActiveExtension: () => EditorCommand;
      setActiveExtension: ({
        extension,
        selection,
      }: {
        extension: SelectionExtension | ExtensionMenuItemConfiguration;
        selection: SelectionExtensionSelectionInfo;
      }) => EditorCommand;
    };
    dependencies: [
      OptionalPlugin<AnalyticsPlugin>,
      OptionalPlugin<EditorViewModePlugin>,
      OptionalPlugin<EditorViewModeEffectsPlugin>,
      OptionalPlugin<PrimaryToolbarPlugin>,
      OptionalPlugin<UserPreferencesPlugin>,
      OptionalPlugin<UserIntentPlugin>,
      OptionalPlugin<SelectionPlugin>,
      OptionalPlugin<BlockControlsPlugin>,
      OptionalPlugin<BlockMenuPlugin>,
      OptionalPlugin<ToolbarPlugin>,
      SelectionToolbarPlugin,
    ];
    pluginConfiguration: SelectionExtensionPluginOptions | undefined;
    sharedState: SelectionExtensionPluginState | null;
  }
>;

export type SelectionExtensionPluginState = {
  activeExtension?: {
    coords: SelectionExtensionCoords;
    extension: SelectionExtension | ExtensionMenuItemConfiguration;
    selection: SelectionExtensionSelectionInfo;
  };
  docChangedAfterClick?: boolean;
  nodePos?: number;
  selectedNode?: PMNode;
  startTrackChanges?: boolean;
};

export type ReplaceWithAdfStatus = 'success' | 'document-changed' | 'failed-to-replace';
export type ReplaceWithAdfResult = { status: ReplaceWithAdfStatus };

export type InsertAdfAtEndOfDocResult = { status: 'success' | 'failed' };

export type SelectionAdfResult = {
  selectedNodeAdf?: ADFEntity;
  selectionRanges?: SelectionRange[];
} | null;
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export default _default_1;
