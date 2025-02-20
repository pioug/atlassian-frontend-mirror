export type ContextualToolbarState = {
	// state of floating toolbar, initial state is dependent on view mode
	display: 'expanded' | 'collapsed' | 'static';
};

export type ContextualToolbarActions =
	| {
			type: 'expand-toolbar';
	  }
	| {
			type: 'collapse-toolbar';
	  };
