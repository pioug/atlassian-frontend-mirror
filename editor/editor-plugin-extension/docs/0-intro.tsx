import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

  ${createEditorUseOnlyNotice('Editor Plugin Extension', [
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

  This package includes the extension plugin used by @atlaskit/editor-core.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type ExtensionPluginOptions = {
  __rendererExtensionOptions?: {
    isAllowedToUseRendererView: (node: ADFEntity) => boolean;
    rendererExtensionHandlers?: ExtensionHandlers;
    showUpdated1PBodiedExtensionUI: (node: ADFEntity) => boolean;
  };
  appearance?: EditorAppearance;
  breakoutEnabled?: boolean;
  extensionHandlers?: ExtensionHandlers;
  getExtensionHeight?: GetPMNodeHeight;
  getUnsupportedContent?: (node: ExtensionParams<Parameters>) => JSONDocNode | undefined;
};

type ExtensionPluginDependencies = [
  OptionalPlugin<AnalyticsPlugin>,
  OptionalPlugin<FeatureFlagsPlugin>,
  WidthPlugin,
  DecorationsPlugin,
  OptionalPlugin<ContextPanelPlugin>,
  OptionalPlugin<ContextIdentifierPlugin>,
  OptionalPlugin<ConnectivityPlugin>,
  OptionalPlugin<ToolbarPlugin>,
  OptionalPlugin<MentionsPlugin>,
  OptionalPlugin<CopyButtonPlugin>,
];

type ExtensionPluginActions = {
  api: () => ExtensionAPI;
  editSelectedExtension: () => boolean;
  forceAutoSave: typeof forceAutoSave;
  insertMacroFromMacroBrowser: InsertMacroFromMacroBrowser;
  insertOrReplaceBodiedExtension: InsertOrReplaceExtensionAction;
  insertOrReplaceExtension: InsertOrReplaceExtensionAction;
  runMacroAutoConvert: RunMacroAutoConvert;
};

type ExtensionPlugin = NextEditorPlugin<
  'extension',
  {
    pluginConfiguration: ExtensionPluginOptions | undefined;
    dependencies: ExtensionPluginDependencies;
    sharedState:
      | {
          extensionProvider?: ExtensionState['extensionProvider'];
          processParametersAfter?: ExtensionState['processParametersAfter'];
          showContextPanel: boolean | undefined;
        }
      | undefined;
    actions: ExtensionPluginActions;
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
