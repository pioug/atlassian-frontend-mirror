import type {
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';

export type BlockCollapseSection = {
	from: number;
	headingPos: number;
	to: number;
};

export type BlockCollapseSharedState = {
	collapsedHeadingPositions: ReadonlySet<number>;
	collapsedSectionEnds: ReadonlyMap<number, number>;
};

export type BlockCollapsePlugin = NextEditorPlugin<
	'blockCollapse',
	{
		commands: {
			collapseHeadingsAtPositions: (positions: number[]) => EditorCommand;
			expandHeading: (headingPos: number) => EditorCommand;
			expandHeadingsContainingRange: (from: number, to: number) => EditorCommand;
			toggleHeading: (headingPos: number) => EditorCommand;
		};
		dependencies: [OptionalPlugin<UiControlRegistryPlugin>];
		sharedState: BlockCollapseSharedState | undefined;
	}
>;
