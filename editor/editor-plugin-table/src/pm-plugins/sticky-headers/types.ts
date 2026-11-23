export type RowStickyState = {
	padding: number;
	pos: number;
	sticky: boolean;
	top: number;
};

export type StickyPluginState = RowStickyState[];

type UpdateSticky = {
	name: 'UPDATE';
	state: RowStickyState;
};

type RemoveSticky = {
	name: 'REMOVE';
	pos: number;
};

/** Replaces every entry with a snapshot of the header rows that are stuck right now. */
type ReplaceSticky = {
	name: 'REPLACE';
	state: StickyPluginState;
};

export type StickyPluginAction = UpdateSticky | RemoveSticky | ReplaceSticky;
