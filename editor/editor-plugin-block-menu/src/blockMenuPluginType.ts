import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';

export type BlockMenuPlugin = NextEditorPlugin<
	'blockMenu',
	{
		actions: {
			getBlockMenuComponents: () => Array<RegisterBlockMenuComponent>;
			registerBlockMenuComponents: (blockMenuComponents: Array<RegisterBlockMenuComponent>) => void;
		};
		dependencies: [
			OptionalPlugin<BlockControlsPlugin>,
			OptionalPlugin<UserIntentPlugin>,
			OptionalPlugin<SelectionPlugin>,
			OptionalPlugin<DecorationsPlugin>,
		];
		pluginConfiguration?: BlockMenuPluginOptions;
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

type WithRank<T> = T & { rank: number };

export type Parent<T> = WithRank<T>;

type ComponentType = BlockMenuSection | BlockMenuItem | BlockMenuNested;

export type ComponentTypes = Array<ComponentType>;

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

export type BlockMenuNestedComponent = () => React.ReactNode;

export type BlockMenuSectionComponent = (props: { children: React.ReactNode }) => React.ReactNode;

export type BlockMenuItemComponent = () => React.ReactNode;

export type RegisterBlockMenuNested = BlockMenuNested & {
	component?: BlockMenuNestedComponent;
	parent: Parent<BlockMenuSection>;
};

export type RegisterBlockMenuSection = BlockMenuSection & {
	component?: BlockMenuSectionComponent;
	rank: number; // Only sections have a rank in itself as a section does not have a parent, the parent is the <BlockMenuContent/>
};

export type RegisterBlockMenuItem = BlockMenuItem & {
	component?: BlockMenuItemComponent;
	parent: Parent<BlockMenuSection>;
};

export type RegisterBlockMenuComponent =
	| RegisterBlockMenuNested
	| RegisterBlockMenuSection
	| RegisterBlockMenuItem;
