import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { createEditorUseOnlyNotice } from '@atlaskit/editor-common/doc-utils';
import { token } from '@atlaskit/tokens';

export default md`

${createEditorUseOnlyNotice('Editor Plugin Block Menu', [
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

  This package includes the block menu plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
enum FLAG_ID {
  LINK_COPIED_TO_CLIPBOARD = 'link-copied-to-clipboard',
}

type BlockMenuPlugin = NextEditorPlugin<
  'blockMenu',
  {
    actions: {
      getBlockMenuComponents: () => Array<RegisterBlockMenuComponent>;
      isTransformOptionDisabled: (
        optionNodeTypeName: string,
        optionNodeTypeAttrs?: Record<string, unknown>,
      ) => boolean;
      registerBlockMenuComponents: (blockMenuComponents: Array<RegisterBlockMenuComponent>) => void;
    };
    commands: {
      transformNode: TransformNodeCommand;
    };
    dependencies: [
      OptionalPlugin<BlockControlsPlugin>,
      OptionalPlugin<UserIntentPlugin>,
      OptionalPlugin<SelectionPlugin>,
      OptionalPlugin<DecorationsPlugin>,
      OptionalPlugin<AnalyticsPlugin>,
    ];
    pluginConfiguration?: BlockMenuPluginOptions;
    sharedState: BlockMenuSharedState;
  }
>;

type BlockMenuPluginOptions = {
  blockLinkHashPrefix?: string;
  getLinkPath?: () => string | null;
};

type BlockMenuSharedState =
  | {
      currentSelectedNodeName: string | undefined;
      showFlag: FLAG_ID | false;
    }
  | undefined;

type Parent<T> = T & { rank: number };

type ComponentTypes = Array<BlockMenuSection | BlockMenuItem | BlockMenuNested>;

type BlockMenuNestedComponent = (props: { children: React.ReactNode }) => React.ReactNode;

type BlockMenuSectionComponent = (props: { children: React.ReactNode }) => React.ReactNode;

type BlockMenuNestedSectionComponent = (props: {
  children: React.ReactNode;
}) => React.ReactNode;

type BlockMenuItemComponent = () => React.ReactNode;

type RegisterBlockMenuNested = BlockMenuNested & {
  component?: BlockMenuNestedComponent;
  parent: Parent<BlockMenuSection>;
};

type RegisterBlockMenuSection = BlockMenuSection & {
  component?: BlockMenuSectionComponent;
  parent?: Parent<BlockMenuNested>;
  rank?: number;
};

type RegisterBlockMenuItem = BlockMenuItem & {
  component?: BlockMenuItemComponent;
  isHidden?: () => boolean;
  parent: Parent<BlockMenuSection>;
};

type RegisterBlockMenuComponent =
  | RegisterBlockMenuNested
  | RegisterBlockMenuSection
  | RegisterBlockMenuItem;

type RegisterBlockMenuComponentType = RegisterBlockMenuComponent['type'];
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
