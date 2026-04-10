import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- md template from @atlaskit/docs
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Loom', [
	{ name: 'Editor Core', link: '/packages/editor/editor-core' },
])}\

  ${
		(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ marginTop: token('space.100', '8px') }}>
				<AtlassianInternalWarning />
			</div>
		)
	}

  This package includes the Loom plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, and \`state\` of the plugin are defined below:

${code`
export type VideoMeta = {
  duration?: number;
  sharedUrl: string;
  title: string;
};

export type PositionType = 'start' | 'end' | 'current';

export type LoomPluginErrorMessages =
  | 'is-supported-failure'
  | 'failed-to-initialise'
  | 'api-key-not-provided';

export type LoomSDKErrorMessages =
  | 'incompatible-browser'
  | 'third-party-cookies-disabled'
  | 'no-media-streams-support';

export type GetClientResult =
  | {
      client: LoomClient;
      status: 'loaded';
    }
  | {
      message: LoomPluginErrorMessages | LoomSDKErrorMessages;
      status: 'error';
    };

export type GetClient = Promise<GetClientResult>;

export type LoomProviderOptions = {
  getClient: () => GetClient;
};

export interface ButtonComponentProps {
  'data-ds--level'?: string;
  onClickBeforeInit?: (event: React.MouseEvent<HTMLElement>) => void;
}

export type ButtonComponent = React.ForwardRefExoticComponent<
  ButtonComponentProps & React.RefAttributes<HTMLElement>
>;

export type RenderButton = (ButtonComponent: ButtonComponent) => JSX.Element | null;

export type LoomPluginOptionsWithProvider = {
  loomProvider: LoomProviderOptions;
  renderButton?: RenderButton;
  shouldRenderButton?: () => boolean;
  shouldShowToolbarButton?: boolean;
};

export type LoomPluginOptionsWithoutProvider = {
  loomProvider?: LoomProviderOptions;
  renderButton: RenderButton;
  shouldRenderButton?: () => boolean;
  shouldShowToolbarButton?: boolean;
};

export type LoomPluginOptions = LoomPluginOptionsWithProvider | LoomPluginOptionsWithoutProvider;

export type LoomPlugin = NextEditorPlugin<
	'loom',
	{
		actions: {
			initLoom: ({
				loomProvider,
			}: {
				loomProvider: LoomProviderOptions;
			}) => Promise<{ error?: string }>;
			insertLoom: (video: VideoMeta, positionType: PositionType) => boolean;
			recordVideo: ({
				inputMethod,
				editorAnalyticsAPI,
			}: {
				editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
				inputMethod: INPUT_METHOD;
			}) => EditorCommand;
		};
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			WidthPlugin,
			HyperlinkPlugin,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<QuickInsertPlugin>,
			OptionalPlugin<ConnectivityPlugin>,
			OptionalPlugin<ToolbarPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
		];
		pluginConfiguration: LoomPluginOptions;
		sharedState: LoomPluginState | undefined;
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
