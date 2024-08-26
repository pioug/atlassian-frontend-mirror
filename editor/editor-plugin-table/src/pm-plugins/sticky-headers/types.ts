export type RowStickyState = {
	pos: number;
	top: number;
	padding: number;
	sticky: boolean;
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

export type StickyPluginAction = UpdateSticky | RemoveSticky;
