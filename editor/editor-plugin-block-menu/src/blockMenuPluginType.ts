import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';

export type BlockMenuPlugin = NextEditorPlugin<
	'blockMenu',
	{
		dependencies: [
			OptionalPlugin<BlockControlsPlugin>,
			OptionalPlugin<UserIntentPlugin>,
			OptionalPlugin<SelectionPlugin>,
		];
		actions: {
			registerBlockMenuComponents: (blockMenuComponents: Array<RegisterBlockMenuComponent>) => void;
			getBlockMenuComponents: () => Array<RegisterBlockMenuComponent>;
		};
	}
>;

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
	parent: Parent<BlockMenuSection>;
	component?: BlockMenuNestedComponent;
};

export type RegisterBlockMenuSection = BlockMenuSection & {
	rank: number; // Only sections have a rank in itself as a section does not have a parent, the parent is the <BlockMenuContent/>
	component?: BlockMenuSectionComponent;
};

export type RegisterBlockMenuItem = BlockMenuItem & {
	parent: Parent<BlockMenuSection>;
	component?: BlockMenuItemComponent;
};

export type RegisterBlockMenuComponent =
	| RegisterBlockMenuNested
	| RegisterBlockMenuSection
	| RegisterBlockMenuItem;
