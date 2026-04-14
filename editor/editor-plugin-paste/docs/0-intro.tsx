import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Paste', [
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

  This package includes the paste plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
export type PastePluginOptions = {
  cardOptions?: CardOptions;
  isFullPage?: boolean;
  pasteWarningOptions?: PasteWarningOptions;
  sanitizePrivateContent?: boolean;
};

export type LastContentPasted = {
  isPlainText: boolean;
  isShiftPressed: boolean;
  pastedAt: number;
  pastedSlice: Slice;
  pasteEndPos: number;
  pasteSource: PasteSource;
  pasteStartPos: number;
  text?: string;
};

export type ActiveFlag = FlagConfig | false;

export interface PastePluginState {
  activeFlag: ActiveFlag | null;
  lastContentPasted: LastContentPasted | null;
  /** map of pasted macro link positions that will to be mapped through incoming transactions */
  pastedMacroPositions: { [key: string]: number };
}

export type PastePluginDependencies = [
  OptionalPlugin<FeatureFlagsPlugin>,
  OptionalPlugin<ListPlugin>,
  BetterTypeHistoryPlugin,
  OptionalPlugin<CardPlugin>,
  OptionalPlugin<AnalyticsPlugin>,
  OptionalPlugin<MediaPlugin>,
  OptionalPlugin<ExtensionPlugin>,
  OptionalPlugin<AnnotationPlugin>,
  OptionalPlugin<MentionsPlugin>,
  OptionalPlugin<ExpandPlugin>,
];

export type PastePlugin = NextEditorPlugin<
  'paste',
  {
    dependencies: PastePluginDependencies;
    pluginConfiguration: PastePluginOptions;
    sharedState: {
      activeFlag: ActiveFlag | null;
      lastContentPasted: LastContentPasted | null;
    };
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
