export type ContextualToolbarState = {
	// state of floating toolbar, initial state is dependent on view mode
	isCollapsed: boolean;
};

export type ContextualToolbarActions =
	| {
			type: 'expand-toolbar';
	  }
	| {
			type: 'collapse-toolbar';
	  };
