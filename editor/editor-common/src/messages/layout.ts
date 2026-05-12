import { defineMessages } from 'react-intl';

export const toolbarMessages: {
	columnOption: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	controlslayoutPlaceholder: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	distributeColumns: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	fiveColumns: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	floatingToolbarRadioGroupAriaLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	fourColumns: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	layoutPlaceholder: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	leftSidebar: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	resizeLayout: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	rightSidebar: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	singleColumn: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	singleColumnAdvancedLayout: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	threeColumns: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	threeColumnsAdvancedLayout: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	threeColumnsWithLeftSidebars: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	threeColumnsWithRightSidebars: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	threeColumnsWithSidebars: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	twoColumns: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	twoColumnsAdvancedLayout: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	singleColumn: {
		id: 'fabric.editor.single',
		defaultMessage: 'Single column layout',
		description:
			'The text is shown as a label on a toolbar button when the user selects a single column layout option in the editor.',
	},
	twoColumns: {
		id: 'fabric.editor.twoColumns',
		defaultMessage: 'Two columns layout',
		description:
			'Label for the toolbar button that applies a two equal-width columns layout to the selected content.',
	},
	singleColumnAdvancedLayout: {
		id: 'fabric.editor.singleColumns',
		defaultMessage: '1 Column layout',
		description:
			'Label for the toolbar button that applies a single-column layout to the selected content in the advanced layout options.',
	},
	twoColumnsAdvancedLayout: {
		id: 'fabric.editor.twoColumns',
		defaultMessage: '2 Column layout',
		description:
			'Label for the advanced layout toolbar button that applies a two equal-width columns layout.',
	},
	threeColumns: {
		id: 'fabric.editor.threeColumns',
		defaultMessage: 'Three columns layout',
		description: 'Layout with three columns of equal width',
	},
	threeColumnsAdvancedLayout: {
		id: 'fabric.editor.threeColumns',
		defaultMessage: '3 Column layout',
		description: 'Layout with three columns of equal width',
	},
	fourColumns: {
		id: 'fabric.editor.fourColumns',
		defaultMessage: '4 Column layout',
		description:
			'Label for the advanced layout toolbar button that applies a four equal-width columns layout.',
	},
	fiveColumns: {
		id: 'fabric.editor.fiveColumns',
		defaultMessage: '5 Column layout',
		description:
			'Label for the advanced layout toolbar button that applies a five equal-width columns layout.',
	},
	rightSidebar: {
		id: 'fabric.editor.rightSidebar',
		defaultMessage: 'Right sidebar layout',
		description: 'Layout with two columns, left column is 2/3 and right is 1/3 of page',
	},
	leftSidebar: {
		id: 'fabric.editor.leftSidebar',
		defaultMessage: 'Left sidebar layout',
		description: 'Layout with two columns, left column is 1/3 and right is 2/3 of page',
	},
	threeColumnsWithSidebars: {
		id: 'fabric.editor.threeColumnsWithSidebars',
		defaultMessage: 'Three columns with sidebars layout',
		description: 'Layout with 3 columns laid out as 25% - 50% - 25%',
	},
	threeColumnsWithLeftSidebars: {
		id: 'fabric.editor.threeColumnsWithLeftSidebars',
		defaultMessage: 'Three columns with left sidebar layout',
		description: 'Layout with 3 columns laid out as 25% - 25% - 50%',
	},
	threeColumnsWithRightSidebars: {
		id: 'fabric.editor.threeColumnsWithRightSidebars',
		defaultMessage: 'Three columns with right sidebar layout',
		description: 'Layout with 3 columns laid out as 50% - 25% - 25%',
	},
	floatingToolbarRadioGroupAriaLabel: {
		id: 'fabric.editor.floatingToolbar.floatingToolbarRadioGroupAriaLabel',
		defaultMessage: 'Layout options',
		description: "a floating toolbar radiogroup's aria label",
	},
	layoutPlaceholder: {
		id: 'fabric.editor.layout.placeholder',
		defaultMessage: 'Add content',
		description:
			'Placeholder text shown inside an empty layout column, prompting the user to add content.',
	},
	controlslayoutPlaceholder: {
		id: 'fabric.editor.layout.controls.placeholder',
		defaultMessage: '/ to insert',
		description:
			'Placeholder text shown inside an empty layout column when controls are active, instructing the user to type / to open the insert menu.',
	},
	columnOption: {
		id: 'fabric.editor.layout.columnOption',
		defaultMessage: '{count, plural, one {{count} Column} other {{count} Columns}}',
		description:
			'The text is shown as a label for a layout column option in the editor toolbar. It displays the number of columns, for example "1 Column" or "3 Columns".',
	},
	resizeLayout: {
		id: 'fabric.editor.layout.resizeLayout',
		defaultMessage: 'Resize layout',
		description:
			'The text is shown as a label on a button or handle when the user can resize the layout columns in the editor.',
	},
	distributeColumns: {
		id: 'fabric.editor.layout.distributeColumns',
		defaultMessage: 'Distribute columns',
		description:
			'The text is shown as a label for an option that distributes layout columns evenly.',
	},
});
