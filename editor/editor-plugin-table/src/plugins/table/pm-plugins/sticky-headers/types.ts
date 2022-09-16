export type RowStickyState = {
  pos: number;
  top: number;
  padding: number;
  sticky: boolean;
};

export type StickyPluginState = RowStickyState[];

export type UpdateSticky = {
  name: 'UPDATE';
  state: RowStickyState;
};

export type RemoveSticky = {
  name: 'REMOVE';
  pos: number;
};

export type StickyPluginAction = UpdateSticky | RemoveSticky;
