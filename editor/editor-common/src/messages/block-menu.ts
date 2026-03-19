import { defineMessages } from 'react-intl-next';

export const messages: {
    copyBlock: {
        id: string;
        defaultMessage: string;
        description: string;
    }; moveUpBlock: {
        id: string;
        defaultMessage: string;
        description: string;
    }; moveDownBlock: {
        id: string;
        defaultMessage: string;
        description: string;
    }; copyLink: {
        id: string;
        defaultMessage: string;
        description: string;
    }; copyLinkToBlock: {
        id: string;
        defaultMessage: string;
        description: string;
    };
    // [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
    // New message with updated wording. To clean up: remove old message and feature flag check when flag is removed.
    copyLinkToSelection: {
        id: string;
        defaultMessage: string;
        description: string;
    }; linkCopiedToClipboard: {
        id: string;
        defaultMessage: string;
        description: string;
    }; paragraph: {
        id: string;
        defaultMessage: string;
        description: string;
    }; codeBlock: {
        id: string;
        defaultMessage: string;
        description: string;
    }; layout: {
        id: string;
        defaultMessage: string;
        description: string;
    }; deleteBlock: {
        id: string;
        defaultMessage: string;
        description: string;
    }; turnInto: {
        id: string;
        defaultMessage: string;
        description: string;
    }; createSyncedBlock: {
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
    }; copySyncedBlock: {
        id: string;
        defaultMessage: string;
        description: string;
    }; newLozenge: {
        id: string;
        defaultMessage: string;
        description: string;
    }; decisionList: {
        id: string;
        defaultMessage: string;
        description: string;
    }; wrapIcon: {
        id: string;
        defaultMessage: string;
        description: string;
    }; create: {
        id: string;
        defaultMessage: string;
        description: string;
    }; headings: {
        id: string;
        defaultMessage: string;
        description: string;
    }; suggested: {
        id: string;
        defaultMessage: string;
        description: string;
    }; structure: {
        id: string;
        defaultMessage: string;
        description: string;
    }; fallbackNestedMenu: {
        id: string;
        defaultMessage: string;
        description: string;
    }; fallbackMenuItem: {
        id: string;
        defaultMessage: string;
        description: string;
    };
} = defineMessages({
	copyBlock: {
		id: 'fabric.editor.block.menu.copy.block',
		defaultMessage: 'Copy block',
		description: 'Copy the selected block to the clipboard',
	},
	moveUpBlock: {
		id: 'fabric.editor.block.menu.move.up',
		defaultMessage: 'Move up',
		description: 'Move the selected block up in the document',
	},
	moveDownBlock: {
		id: 'fabric.editor.block.menu.move.down',
		defaultMessage: 'Move down',
		description: 'Move the selected block down in the document',
	},
	copyLink: {
		id: 'fabric.editor.block.menu.copy.link',
		defaultMessage: 'Copy link',
		description: 'Copy link to the selected content',
	},
	copyLinkToBlock: {
		id: 'fabric.editor.block.menu.copy.link.to.block',
		defaultMessage: 'Copy link to block',
		description: 'Copy link to the selected block',
	},
	// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
	// New message with updated wording. To clean up: remove old message and feature flag check when flag is removed.
	copyLinkToSelection: {
		id: 'fabric.editor.block.menu.copy.link.to.selection',
		defaultMessage: 'Copy link to selection',
		description: 'Copy link to the selected content',
	},
	linkCopiedToClipboard: {
		id: 'fabric.editor.block.menu.link.copied.to.clipboard',
		defaultMessage: 'Link copied to clipboard',
		description: 'Confirmation message shown when link is copied to clipboard',
	},
	paragraph: {
		id: 'fabric.editor.block.menu.paragraph',
		defaultMessage: 'Paragraph',
		description: 'Change the selected block to a paragraph',
	},
	codeBlock: {
		id: 'fabric.editor.block.menu.codeblock',
		defaultMessage: 'Code block',
		description: 'Convert the selected block to a code block',
	},
	layout: {
		id: 'fabric.editor.block.menu.layout',
		defaultMessage: 'Layout',
		description: 'Convert the selected block to a layout node',
	},
	deleteBlock: {
		id: 'fabric.editor.block.menu.delete.block',
		defaultMessage: 'Delete',
		description: 'Delete the selected block from the document',
	},
	turnInto: {
		id: 'fabric.editor.block.menu.turn.into',
		defaultMessage: 'Turn into',
		description: 'Turn the selected block into another type',
	},
	createSyncedBlock: {
		id: 'fabric.editor.block.menu.create.synced.block',
		defaultMessage: 'Create synced block',
		description:
			'Create a synced block at this line, converting the selection to a synced block if applicable',
	},
	// [FEATURE FLAG: platform_editor_block_menu_v2_patch_3]
	// New message with updated wording. To clean up: remove old message and feature flag check when flag is removed.
	syncBlock: {
		id: 'fabric.editor.block.menu.sync.block',
		defaultMessage: 'Sync block',
		description:
			'Create a synced block at this line, converting the selection to a synced block if applicable',
	},
	copySyncedBlock: {
		id: 'fabric.editor.block.menu.copy.synced.block',
		defaultMessage: 'Copy synced block',
		description: 'Copy the selected synced block to the clipboard',
	},
	newLozenge: {
		id: 'fabric.editor.block.menu.new.lozenge',
		defaultMessage: 'New',
		description: 'Text in lozenge which appears next to newly added menu items',
	},
	decisionList: {
		id: 'fabric.editor.block.menu.decision',
		defaultMessage: 'Decision',
		description: 'Label for the decision option in the block menu transformation menu',
	},
	wrapIcon: {
		id: 'fabric.editor.block.menu.wrap.icon',
		defaultMessage: 'Wrap',
		description: 'Aria label for the wrap icon in code block toolbar',
	},
	create: {
		id: 'fabric.editor.block.menu.create',
		defaultMessage: 'Create',
		description: 'Menu section title for creating new block types',
	},
	headings: {
		id: 'fabric.editor.block.menu.headings',
		defaultMessage: 'Headings',
		description: 'Menu section title for heading block types',
	},
	suggested: {
		id: 'fabric.editor.block.menu.suggested',
		defaultMessage: 'Suggested',
		description: 'Menu section title for suggested block types',
	},
	structure: {
		id: 'fabric.editor.block.menu.structure',
		defaultMessage: 'Structure',
		description: 'Menu section title for structural block types',
	},
	fallbackNestedMenu: {
		id: 'fabric.editor.block.menu.fallback.nested.menu',
		defaultMessage: 'Nested Menu',
		description:
			'Fallback text displayed for nested menu component in block menu when proper component is not available',
	},
	fallbackMenuItem: {
		id: 'fabric.editor.block.menu.fallback.menu.item',
		defaultMessage: 'Block Menu Item',
		description:
			'Fallback text displayed for menu item component in block menu when proper component is not available',
	},
});
