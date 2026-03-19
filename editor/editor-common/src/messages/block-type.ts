import { defineMessages } from 'react-intl-next';

export const messages: {
    normal: {
        id: string;
        defaultMessage: string;
        description: string;
    }; smallText: {
        id: string;
        defaultMessage: string;
        description: string;
    }; heading1: {
        id: string;
        defaultMessage: string;
        description: string;
    }; heading1Description: {
        id: string;
        defaultMessage: string;
        description: string;
    }; heading2: {
        id: string;
        defaultMessage: string;
        description: string;
    }; heading2Description: {
        id: string;
        defaultMessage: string;
        description: string;
    }; heading3: {
        id: string;
        defaultMessage: string;
        description: string;
    }; heading3Description: {
        id: string;
        defaultMessage: string;
        description: string;
    }; heading4: {
        id: string;
        defaultMessage: string;
        description: string;
    }; heading4Description: {
        id: string;
        defaultMessage: string;
        description: string;
    }; heading5: {
        id: string;
        defaultMessage: string;
        description: string;
    }; heading5Description: {
        id: string;
        defaultMessage: string;
        description: string;
    }; heading6: {
        id: string;
        defaultMessage: string;
        description: string;
    }; heading6Description: {
        id: string;
        defaultMessage: string;
        description: string;
    }; blockquote: {
        id: string;
        defaultMessage: string;
        description: string;
    }; blockquoteDescription: {
        id: string;
        defaultMessage: string;
        description: string;
    }; codeblock: {
        id: string;
        defaultMessage: string;
        description: string;
    }; codeblockDescription: {
        id: string;
        defaultMessage: string;
        description: string;
    }; infoPanel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; infoPanelDescription: {
        id: string;
        defaultMessage: string;
        description: string;
    }; notePanel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; notePanelDescription: {
        id: string;
        defaultMessage: string;
        description: string;
    }; successPanel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; successPanelDescription: {
        id: string;
        defaultMessage: string;
        description: string;
    }; warningPanel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; warningPanelDescription: {
        id: string;
        defaultMessage: string;
        description: string;
    }; errorPanel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; errorPanelDescription: {
        id: string;
        defaultMessage: string;
        description: string;
    }; customPanel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; customPanelDescription: {
        id: string;
        defaultMessage: string;
        description: string;
    }; syncedBlock: {
        id: string;
        defaultMessage: string;
        description: string;
    };
    // [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
    // New message with updated wording. To clean up: remove old message and feature flag check when flag is removed.
    syncBlock: {
        id: string;
        defaultMessage: string;
        description: string;
    }; syncedBlockDescription: {
        id: string;
        defaultMessage: string;
        description: string;
    }; newLozenge: {
        id: string;
        defaultMessage: string;
        description: string;
    }; panel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; textBoxAriaLabel: {
        id: string;
        defaultMessage: string;
        description: string;
    }; other: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
	normal: {
		id: 'fabric.editor.normal',
		defaultMessage: 'Normal text',
		description: 'This is the default text style',
	},
	smallText: {
		id: 'fabric.editor.smallText',
		defaultMessage: 'Small text',
		description: 'This is a smaller variant of the normal text style',
	},
	heading1: {
		id: 'fabric.editor.heading1',
		defaultMessage: 'Heading 1',
		description:
			'Used for the title of a section of your document, headings run from 1 (largest size) to 6 (smallest size)',
	},
	heading1Description: {
		id: 'fabric.editor.heading1Description',
		defaultMessage: 'Use this for a top level heading',
		description: 'Description of the main heading, heading 1',
	},
	heading2: {
		id: 'fabric.editor.heading2',
		defaultMessage: 'Heading 2',
		description:
			'Used for the title of a section of your document, headings run from 1 (largest size) to 6 (smallest size)',
	},
	heading2Description: {
		id: 'fabric.editor.heading2Description',
		defaultMessage: 'Use this for key sections',
		description: 'Description of a subtitle heading or secondary heading',
	},
	heading3: {
		id: 'fabric.editor.heading3',
		defaultMessage: 'Heading 3',
		description:
			'Used for the title of a section of your document, headings run from 1 (largest size) to 6 (smallest size)',
	},
	heading3Description: {
		id: 'fabric.editor.heading3Description',
		defaultMessage: 'Use this for sub sections and group headings',
		description:
			'Description text shown in the block type menu to help users understand when to use Heading 3 for sub sections and group headings in the editor.',
	},
	heading4: {
		id: 'fabric.editor.heading4',
		defaultMessage: 'Heading 4',
		description:
			'Used for the title of a section of your document, headings run from 1 (largest size) to 6 (smallest size)',
	},
	heading4Description: {
		id: 'fabric.editor.heading4Description',
		defaultMessage: 'Use this for deep headings',
		description:
			'Description text shown in the block type menu to help users understand when to use Heading 4 for deep headings in the editor.',
	},
	heading5: {
		id: 'fabric.editor.heading5',
		defaultMessage: 'Heading 5',
		description:
			'Used for the title of a section of your document, headings run from 1 (largest size) to 6 (smallest size)',
	},
	heading5Description: {
		id: 'fabric.editor.heading5Description',
		defaultMessage: 'Use this for grouping list items',
		description:
			'Description text shown in the block type menu to help users understand when to use Heading 5 for grouping list items in the editor.',
	},
	heading6: {
		id: 'fabric.editor.heading6',
		defaultMessage: 'Heading 6',
		description:
			'Used for the title of a section of your document, headings run from 1 (largest size) to 6 (smallest size)',
	},
	heading6Description: {
		id: 'fabric.editor.heading6Description',
		defaultMessage: 'Use this for low level headings',
		description:
			'Description text shown in the block type menu to help users understand when to use Heading 6 for low level headings in the editor.',
	},
	blockquote: {
		id: 'fabric.editor.blockquote2',
		defaultMessage: 'Quote',
		description:
			'Label shown as a menu item in the block type dropdown to insert a blockquote for quoting text in the editor.',
	},
	blockquoteDescription: {
		id: 'fabric.editor.blockquote.description',
		defaultMessage: 'Insert a quote or citation',
		description:
			'Description text shown in the block type menu to help users understand the blockquote option for inserting a quote or citation in the editor.',
	},
	codeblock: {
		id: 'fabric.editor.codeblock',
		defaultMessage: 'Code snippet',
		description: 'Insert a snippet/segment of code (code block)',
	},
	codeblockDescription: {
		id: 'fabric.editor.codeblock.description',
		defaultMessage: 'Display code with syntax highlighting',
		description:
			'Menu description shown in the quick insert menu. Explains that selecting this option inserts a code block with syntax highlighting support.',
	},
	infoPanel: {
		id: 'fabric.editor.infoPanel',
		defaultMessage: 'Info panel',
		description:
			'Visually distinguishes your text by adding a background colour (blue, purple, yellow, green, red)',
	},
	infoPanelDescription: {
		id: 'fabric.editor.infoPanel.description',
		defaultMessage: 'Highlight information in a colored panel',
		description:
			'Visually distinguishes your text by adding a background colour (blue, purple, yellow, green, red)',
	},
	notePanel: {
		id: 'fabric.editor.notePanel',
		defaultMessage: 'Note panel',
		description: 'Visually distinguishes your text by adding a note panel',
	},
	notePanelDescription: {
		id: 'fabric.editor.notePanel.description',
		defaultMessage: 'Add a note in a colored panel',
		description: 'Visually distinguishes your text by adding a note panel',
	},
	successPanel: {
		id: 'fabric.editor.successPanel',
		defaultMessage: 'Success panel',
		description: 'Visually distinguishes your text by adding a success panel',
	},
	successPanelDescription: {
		id: 'fabric.editor.successPanel.description',
		defaultMessage: 'Add tips in a colored panel',
		description: 'Visually distinguishes your text by adding a success panel',
	},
	warningPanel: {
		id: 'fabric.editor.warningPanel',
		defaultMessage: 'Warning panel',
		description: 'Visually distinguishes your text by adding a warning panel',
	},
	warningPanelDescription: {
		id: 'fabric.editor.warningPanel.description',
		defaultMessage: 'Add a note of caution in a colored panel',
		description: 'Visually distinguishes your text by adding a warning panel',
	},
	errorPanel: {
		id: 'fabric.editor.errorPanel',
		defaultMessage: 'Error panel',
		description: 'Visually distinguishes your text by adding a error panel',
	},
	errorPanelDescription: {
		id: 'fabric.editor.errorPanel.description',
		defaultMessage: 'Call out errors in a colored panel',
		description: 'Visually distinguishes your text by adding a error panel',
	},
	customPanel: {
		id: 'fabric.editor.customPanel',
		defaultMessage: 'Custom panel',
		description: 'Visually distinguishes your panel by adding a emoji icon and background color',
	},
	customPanelDescription: {
		id: 'fabric.editor.customPanel.description',
		defaultMessage: 'Add a note with an emoji and colored background',
		description: 'Visually distinguishes your panel by adding a emoji icon and background color ',
	},
	syncedBlock: {
		id: 'fabric.editor.syncedBlock',
		defaultMessage: 'Create synced block',
		description: 'Inserts a synced block that auto-updates content across Atlassian apps',
	},
	// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
	// New message with updated wording. To clean up: remove old message and feature flag check when flag is removed.
	syncBlock: {
		id: 'fabric.editor.syncBlock',
		defaultMessage: 'Sync block',
		description: 'Inserts a synced block that auto-updates content across Atlassian apps',
	},
	syncedBlockDescription: {
		id: 'fabric.editor.syncedBlock.description',
		defaultMessage: 'Sync content across multiple locations',
		description: 'Description of the synced block that auto-updates content across Atlassian apps',
	},
	newLozenge: {
		id: 'fabric.editor.quickinsert.new.lozenge',
		defaultMessage: 'New',
		description: 'Text in lozenge that appears next to new quick insert items',
	},
	panel: {
		id: 'fabric.editor.panel',
		defaultMessage: 'Panel',
		description: 'Visually distinguishes your text by adding a panel',
	},
	textBoxAriaLabel: {
		id: 'fabric.editor.aria.textbox',
		defaultMessage: 'textbox',
		description:
			'This is the definition of the HTML role textbox, it needs to be translated in the same way that a textbox with a HTML role of textbox',
	},
	other: {
		id: 'fabric.editor.other',
		defaultMessage: 'Others...',
		description:
			'Label shown as a menu item in the block type dropdown to access additional text formatting options in the editor.',
	},
});
