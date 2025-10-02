export type FloatingToolbarPluginAction =
	| {
			data: {
				buttonIndex: number;
				optionIndex?: number;
			};
			type: 'SHOW_CONFIRM_DIALOG';
	  }
	| {
			type: 'HIDE_CONFIRM_DIALOG';
	  };
