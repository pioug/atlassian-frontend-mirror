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

export type StickyPluginAction = UpdateSticky | RemoveSticky;
