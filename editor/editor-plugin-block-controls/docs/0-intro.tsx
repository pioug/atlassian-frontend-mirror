import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';
import Link from '@atlaskit/link';
import SectionMessage from '@atlaskit/section-message';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _default_1: any = md`

${createEditorUseOnlyNotice('Editor Plugin Block Controls', [
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

  This package includes the block controls plugin used by \`@atlaskit/editor-core\`.

  ## Usage
---

The \`dependencies\`, \`configuration\`, \`state\`, \`actions\`, and \`commands\` of the plugin are defined
below:

${code`
type BlockControlsPlugin = NextEditorPlugin<
  'blockControls',
  {
    actions: {
      registerNodeDecoration: (factory: NodeDecorationFactory) => void;
      unregisterNodeDecoration: (type: string) => void;
    };
    commands: {
      handleKeyDownWithPreservedSelection: (event: KeyboardEvent) => EditorCommand;
      mapPreservedSelection: (mapping: Mapping) => EditorCommand;
      moveNode: MoveNode;
      moveNodeWithBlockMenu: (direction: DIRECTION.UP | DIRECTION.DOWN) => EditorCommand;
      moveToLayout: (
        start: number,
        to: number,
        options?: { moveNodeAtCursorPos?: boolean; moveToEnd?: boolean; selectMovedNode?: boolean },
      ) => EditorCommand;
      setMultiSelectPositions: (anchor?: number, head?: number) => EditorCommand;
      setNodeDragged: (
        getPos: () => number | undefined,
        anchorName: string,
        nodeType: string,
      ) => EditorCommand;
      setSelectedViaDragHandle: (isSelectedViaDragHandle?: boolean) => EditorCommand;
      showDragHandleAt: (
        pos: number,
        anchorName: string,
        nodeType: string,
        handleOptions?: HandleOptions,
        rootPos?: number,
        rootAnchorName?: string,
        rootNodeType?: string,
      ) => EditorCommand;
      startPreservingSelection: () => EditorCommand;
      stopPreservingSelection: () => EditorCommand;
      toggleBlockMenu: (options?: {
        anchorName?: string;
        closeMenu?: boolean;
        openedViaKeyboard?: boolean;
        triggerByNode?: TriggerByNode;
      }) => EditorCommand;
    };
    dependencies: BlockControlsPluginDependencies;
    pluginConfiguration?: BlockControlsPluginConfig;
    sharedState: BlockControlsSharedState;
  }
>;

type BlockControlsPluginConfig = {
  rightSideControlsEnabled?: boolean;
};

type BlockControlsSharedState = {
  activeDropTargetNode?: ActiveDropTargetNode;
  activeNode?: ActiveNode;
  blockMenuOptions?: {
    canMoveDown?: boolean;
    canMoveUp?: boolean;
    openedViaKeyboard?: boolean;
  };
  hoverSide?: 'left' | 'right';
  isDragging: boolean;
  isEditing?: boolean;
  isMenuOpen: boolean;
  isMouseOut?: boolean;
  isPMDragging: boolean;
  isSelectedViaDragHandle?: boolean;
  isShiftDown?: boolean;
  lastDragCancelled: boolean;
  menuTriggerBy?: string;
  menuTriggerByNode?: TriggerByNode;
  multiSelectDnD?: MultiSelectDnD;
  preservedSelection?: Selection;
  rightSideControlsEnabled?: boolean;
} | undefined;

type HandleOptions = { isFocused: boolean } | undefined;

type MoveNodeMethod = INPUT_METHOD.DRAG_AND_DROP | INPUT_METHOD.SHORTCUT | INPUT_METHOD.BLOCK_MENU;

type BlockControlsPluginDependencies = [
  OptionalPlugin<LimitedModePlugin>,
  OptionalPlugin<EditorDisabledPlugin>,
  OptionalPlugin<EditorViewModePlugin>,
  OptionalPlugin<WidthPlugin>,
  OptionalPlugin<FeatureFlagsPlugin>,
  OptionalPlugin<AnalyticsPlugin>,
  OptionalPlugin<AccessibilityUtilsPlugin>,
  OptionalPlugin<QuickInsertPlugin>,
  OptionalPlugin<TypeAheadPlugin>,
  OptionalPlugin<SelectionPlugin>,
  OptionalPlugin<MetricsPlugin>,
  OptionalPlugin<InteractionPlugin>,
  OptionalPlugin<UserIntentPlugin>,
  OptionalPlugin<ToolbarPlugin>,
];

type NodeDecorationFactory = {
  create: (params: NodeDecorationFactoryParams) => Decoration;
  shouldCreate?: (params: NodeDecorationFactoryParams) => boolean;
  showInViewMode?: boolean;
  type: string;
};

type NodeDecorationFactoryParams = {
  anchorName: string;
  editorState: EditorState;
  nodeType: string;
  nodeViewPortalProviderAPI: PortalProviderAPI;
  rootAnchorName?: string;
  rootNodeType?: string;
  rootPos: number;
};

type PluginState = {
  activeDropTargetNode?: ActiveDropTargetNode;
  activeNode?: ActiveNode;
  blockMenuOptions?: { canMoveDown?: boolean; canMoveUp?: boolean; openedViaKeyboard?: boolean };
  decorations: DecorationSet;
  editorHeight: number;
  editorWidthLeft: number;
  editorWidthRight: number;
  isDocSizeLimitEnabled: boolean | null;
  isDragging: boolean;
  isMenuOpen?: boolean;
  isPMDragging: boolean;
  isResizerResizing: boolean;
  isSelectedViaDragHandle?: boolean;
  isShiftDown?: boolean;
  lastDragCancelled: boolean;
  menuTriggerBy?: string;
  menuTriggerByNode?: TriggerByNode;
  multiSelectDnD?: MultiSelectDnD;
  preservedSelection?: Selection;
};

type RightEdgeButtonProps = {
  api: PublicPluginAPI<[BlockControlsPlugin]>;
  getPos: () => number | undefined;
};

type MoveNode = (
  start: number,
  to: number,
  inputMethod?: MoveNodeMethod,
  formatMessage?: IntlShape['formatMessage'],
) => EditorCommand;
`}


  ## Support
---
For internal Atlassian, visit the slack channel [#help-editor](https://atlassian.slack.com/archives/CFG3PSQ9E) for support or visit [go/editor-help](https://go/editor-help) to submit a bug.
## License
---
 Please see [Atlassian Frontend - License](https://hello.atlassian.net/wiki/spaces/AF/pages/2589099144/Documentation#License) for more licensing information.
`;
export default _default_1;

function AlternativePackagesMessage({
	alternatePackages,
}: React.PropsWithoutRef<{
	alternatePackages?: { link: string; name: string }[];
}>) {
	if (!alternatePackages) {
		return null;
	}
	if (alternatePackages.length === 1) {
		return (
			<p>
				Consider using <Link href={alternatePackages[0].link}>{alternatePackages[0].name}</Link>{' '}
				instead.
			</p>
		);
	}
	return (
		<p>
			Consider using one of these packages instead:
			<ul>
				{alternatePackages.map((p) => (
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-key
					<li>
						<Link href={p.link}>{p.name}</Link>
					</li>
				))}
			</ul>
		</p>
	);
}

export function createEditorUseOnlyNotice(
	componentName: string,
	alternatePackages?: { link: string; name: string }[],
): React.JSX.Element {
	return (
		<SectionMessage title="Internal Editor Use Only" appearance="error">
			<p>
				{componentName} is intended for internal use by the Editor Platform as a plugin dependency
				of the Editor within your product.
			</p>
			<p>Direct use of this component is not supported.</p>
			<AlternativePackagesMessage alternatePackages={alternatePackages} />
		</SectionMessage>
	);
}
