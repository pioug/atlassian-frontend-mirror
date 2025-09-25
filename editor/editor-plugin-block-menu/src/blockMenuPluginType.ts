import type {
	NextEditorPlugin,
	OptionalPlugin,
	EditorCommand,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';

import type { FormatNodeTargetType } from './editor-commands/transforms/types';

export type BlockMenuPlugin = NextEditorPlugin<
	'blockMenu',
	{
		actions: {
			getBlockMenuComponents: () => Array<RegisterBlockMenuComponent>;
			registerBlockMenuComponents: (blockMenuComponents: Array<RegisterBlockMenuComponent>) => void;
		};
		commands: {
			formatNode: (targetType: FormatNodeTargetType) => EditorCommand;
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

export type BlockMenuPluginOptions = {
	/**
	 * Optional query parameter name used for block-specific URL to create a deep link to specific block
	 */
	blockQueryParam?: string;

	/**
	 * Optional function to retrieve the current link path for the editor context.
	 * @returns The current link path as a string, or null if no path is available
	 */
	getLinkPath?: () => string | null;
};

export type BlockMenuSharedState =
	| {
			/**
			 * The name of the currently selected node type that triggered the block menu
			 * This exposes the menuTriggerBy value from blockControls plugin
			 */
			currentSelectedNodeName: string | undefined;
	  }
	| undefined;

type WithRank<T> = T & { rank: number };

export type Parent<T> = WithRank<T>;

type ComponentType = BlockMenuSection | BlockMenuItem | BlockMenuNested;

export type ComponentTypes = Array<ComponentType>;

/**
 * The relationship between BlockMenuItem, BlockMenuSection, BlockMenuNested
 * BlockMenuSection can have BlockMenuItem or BlockMenuNested as children
 * BlockMenuNested can have BlockMenuSection as children,
 * BlockMenuNested, with BlockMenuSection and BlockMenuItem, is a nested menu
 *  _______________________________________
 * | Block menu (no typing)
 * |  |BlockMenuSection
 * |  |  |BlockMenuItem
 * |  |  |BlockMenuNested
 * |  |  |  |BlockMenuSection
 * |  |  |  |  |BlockMenuItem
 */

type BlockMenuItem = {
	key: string;
	type: 'block-menu-item';
};

type BlockMenuSection = {
	key: string;
	type: 'block-menu-section';
};

type BlockMenuNested = {
	key: string;
	type: 'block-menu-nested';
};

export type BlockMenuNestedComponent = (props?: { children: React.ReactNode }) => React.ReactNode;

export type BlockMenuSectionComponent = (props: { children: React.ReactNode }) => React.ReactNode;

export type BlockMenuNestedSectionComponent = (props: {
	children: React.ReactNode;
}) => React.ReactNode;

export type BlockMenuItemComponent = () => React.ReactNode;

export type RegisterBlockMenuNested = BlockMenuNested & {
	component?: BlockMenuNestedComponent;
	parent: Parent<BlockMenuSection>;
};

export type RegisterBlockMenuSection = BlockMenuSection & {
	component?: BlockMenuSectionComponent;
	parent?: Parent<BlockMenuNested>;
	rank?: number; // use when parent is not there
};

export type RegisterBlockMenuItem = BlockMenuItem & {
	component?: BlockMenuItemComponent;
	parent: Parent<BlockMenuSection>;
};

export type RegisterBlockMenuComponent =
	| RegisterBlockMenuNested
	| RegisterBlockMenuSection
	| RegisterBlockMenuItem;
