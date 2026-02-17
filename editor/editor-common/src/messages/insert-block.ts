import { defineMessages } from 'react-intl-next';

export const toolbarInsertBlockMessages = defineMessages({
	action: {
		id: 'fabric.editor.action',
		defaultMessage: 'Action item',
		description: 'Also known as a “task”, “to do item”, or a checklist',
	},
	actionDescription: {
		id: 'fabric.editor.action.description',
		defaultMessage: 'Create and assign action items',
		description:
			'Displayed as a description text for the action item option in the editor insert menu, used to explain the purpose of creating and assigning action items.',
	},
	closeInsertRightRail: {
		id: 'fabric.editor.insertRightRail.close',
		defaultMessage: 'Close',
		description:
			'Label for the close button on the insert right rail panel in the editor, used to dismiss the insert elements panel.',
	},
	link: {
		id: 'fabric.editor.link',
		defaultMessage: 'Link',
		description:
			'Shown as a menu item label in the editor insert menu, used to insert a hyperlink into the document.',
	},
	linkDescription: {
		id: 'fabric.editor.link.description',
		defaultMessage: 'Insert a link',
		description:
			'Displayed as a description text for the link option in the editor insert menu, explaining that it allows users to insert a hyperlink into the document.',
	},
	mediaFiles: {
		id: 'fabric.editor.mediaFiles',
		defaultMessage: 'Image, video, or file',
		description:
			'Menu option shown in the quick insert menu. Allows users to insert one or more files, videos, or images into the document.',
	},
	addMediaFiles: {
		id: 'fabric.editor.addMediaFiles',
		defaultMessage: 'Add image, video, or file',
		description:
			'Menu option shown in the quick insert menu. Allows users to add images, videos, or files to the document.',
	},
	insertRightRailTitle: {
		id: 'fabric.editor.insertRightRail.title',
		defaultMessage: 'Insert',
		description:
			'Heading or title shown in the insert right rail panel. Indicates the purpose of the panel for inserting elements.',
	},
	mediaFilesDescription: {
		id: 'fabric.editor.mediaFiles.description',
		defaultMessage: 'Add images and other files to your page',
		description:
			'Menu description shown in the quick insert menu. Explains that users can add images and other files to their page.',
	},
	image: {
		id: 'fabric.editor.image',
		defaultMessage: 'Image',
		description:
			'Shown as a menu item label in the editor insert menu, used to insert an image into the document.',
	},
	mention: {
		id: 'fabric.editor.mention',
		defaultMessage: 'Mention',
		description: 'Reference another person in your document',
	},
	mentionDescription: {
		id: 'fabric.editor.mention.description',
		defaultMessage: 'Mention someone to send them a notification',
		description: 'Reference another person in your document',
	},
	emoji: {
		id: 'fabric.editor.emoji',
		defaultMessage: 'Emoji',
		description: 'Insert an emoticon or smiley :-)',
	},
	emojiDescription: {
		id: 'fabric.editor.emoji.description',
		defaultMessage: 'Use emojis to express ideas 🎉 and emotions 😄',
		description:
			'Menu description shown in the quick insert menu. Explains that users can insert emojis to enhance their content.',
	},
	table: {
		id: 'fabric.editor.table',
		defaultMessage: 'Table',
		description:
			'Menu option shown in the quick insert menu. Allows users to insert a table into the document.',
	},
	tableDescription: {
		id: 'fabric.editor.table.description',
		defaultMessage: 'Insert a table',
		description:
			'Menu description shown in the quick insert menu. Explains that users can insert a table to organize data.',
	},
	tableSelector: {
		id: 'fabric.editor.tableSelector',
		defaultMessage: 'Table size',
		description: 'Opens a table selector that lets you insert a table of custom size',
	},
	tableSelectorDescription: {
		id: 'fabric.editor.tableSelector.description',
		defaultMessage: 'Add a table using popup to select a custom size',
		description: 'Opens a table selector that lets you insert a table of a custom size',
	},
	tableSizeSelectorButton: {
		id: 'fabric.editor.tableSizeSelectorButton',
		defaultMessage: '{numberOfColumns} by {numberOfRows}',
		description:
			'Button label showing table dimensions. The placeholders {numberOfColumns} and {numberOfRows} will be substituted with the selected number of columns and rows.',
	},
	tableSizeSelectorPopup: {
		id: 'fabric.editor.tableSizeSelectorPopup',
		defaultMessage: 'Table size selector',
		description:
			'Popup menu shown when selecting table size. Allows users to choose custom dimensions for creating a table.',
	},
	expand: {
		id: 'fabric.editor.expand',
		defaultMessage: 'Expand',
		description:
			'Menu option shown in the quick insert menu. Allows users to insert an expandable/collapsible section into the document.',
	},
	expandDescription: {
		id: 'fabric.editor.expand.description',
		defaultMessage: 'Insert an expand',
		description:
			'Menu description shown in the quick insert menu. Explains that users can insert expandable content sections.',
	},
	decision: {
		id: 'fabric.editor.decision',
		defaultMessage: 'Decision',
		description:
			'Menu option shown in the quick insert menu. Allows users to insert a decision element to track and document decisions.',
	},
	decisionDescription: {
		id: 'fabric.editor.decision.description',
		defaultMessage: "Capture decisions so they're easy to track",
		description:
			'Menu description shown in the quick insert menu. Explains that users can insert decision elements for tracking.',
	},
	feedbackDialog: {
		id: 'fabric.editor.feedbackDialog',
		defaultMessage: 'Give feedback',
		description:
			'Menu option shown in the quick insert menu. Opens a dialog where users can provide feedback about the editor.',
	},
	feedbackDialogDescription: {
		id: 'fabric.editor.feedbackDialog.description',
		defaultMessage: 'Tell us about your experience using the cloud editor',
		description:
			'Menu description shown in the quick insert menu. Invites users to share their feedback about the editor experience.',
	},
	horizontalRule: {
		id: 'fabric.editor.horizontalRule',
		defaultMessage: 'Divider',
		description:
			'Shown as a menu item label in the editor insert menu, used to insert a horizontal rule or divider to separate content in the document.',
	},
	horizontalRuleDescription: {
		id: 'fabric.editor.horizontalRule.description',
		defaultMessage: 'Separate content with a horizontal line',
		description:
			'Displayed as a description text for the divider option in the editor insert menu, explaining that it inserts a horizontal line to separate content sections in the document.',
	},
	date: {
		id: 'fabric.editor.date',
		defaultMessage: 'Date',
		description:
			'Menu option shown in the quick insert menu. Allows users to insert a date into the document using a date picker.',
	},
	dateDescription: {
		id: 'fabric.editor.date.description',
		defaultMessage: 'Add a date using a calendar',
		description:
			'Menu description shown in the quick insert menu. Explains how to add a date into the document using a calendar picker.',
	},
	placeholderText: {
		id: 'fabric.editor.placeholderText',
		defaultMessage: 'Placeholder text',
		description:
			'Menu option shown in the quick insert menu. Allows users to insert a text placeholder into the document.',
	},
	placeholderTextDescription: {
		id: 'fabric.editor.placeholderText.description',
		defaultMessage: 'Insert a text placeholder into the page',
		description:
			'Menu description shown in the quick insert menu. Explains how to insert a text placeholder for later content.',
	},
	columns: {
		id: 'fabric.editor.columns',
		defaultMessage: 'Layouts',
		description:
			'Menu option shown in the quick insert menu. Allows users to create multi-column layouts and sections.',
	},
	columnsDescription: {
		id: 'fabric.editor.columns.description',
		defaultMessage: 'Structure your page using sections',
		description:
			'Menu description shown in the quick insert menu. Explains how to use layouts to structure content.',
	},
	columnsDescriptionAdvancedLayout: {
		id: 'fabric.editor.columns.advanced.layout.description',
		defaultMessage:
			'Insert {numberOfColumns} equal {numberOfColumns, plural, one {column} other {columns}}',
		description:
			'Menu option for advanced layouts. The placeholder {numberOfColumns} will be substituted with the number of equal columns being inserted.',
	},
	singleColumnsDescriptionAdvancedLayout: {
		id: 'fabric.editor.columns.advanced.layout.single.description',
		defaultMessage: 'Insert a single column layout',
		description:
			'Menu option shown in the quick insert menu. Allows users to insert a single column layout section.',
	},
	status: {
		id: 'fabric.editor.status',
		defaultMessage: 'Status',
		description:
			'Menu option shown in the quick insert menu. Allows users to insert a status indicator for tasks or activities.',
	},
	statusDescription: {
		id: 'fabric.editor.status.description',
		defaultMessage: 'Add a custom status label',
		description:
			'Menu description shown in the quick insert menu. Explains that users can add custom status labels.',
	},
	viewMore: {
		id: 'fabric.editor.viewMore',
		defaultMessage: 'View more',
		description:
			'Button label shown in the quick insert menu. Allows users to see additional elements beyond the primary display.',
	},
	viewMoreAriaLabel: {
		id: 'fabric.editor.viewMoreAriaLabel',
		defaultMessage: 'View all elements',
		description:
			'ARIA label for accessibility. Provides a more descriptive label to screen readers indicating users can view all insertable elements.',
	},
	insertMenu: {
		id: 'fabric.editor.insertMenu',
		defaultMessage: 'Insert elements',
		description:
			'Menu option or button label shown in the editor toolbar. Opens a menu of additional items that can be inserted.',
	},
	help: {
		id: 'fabric.editor.help',
		defaultMessage: 'Help',
		description:
			'Shown as a menu item label in the editor insert menu, used to open the help dialog where users can browse keyboard shortcuts and markdown options.',
	},
	helpDescription: {
		id: 'fabric.editor.help.description',
		defaultMessage: 'Browse all the keyboard shortcuts and markdown options',
		description:
			'Displayed as a description text for the help option in the editor insert menu, explaining that it opens a dialog where users can view all available keyboard shortcuts and markdown formatting options.',
	},
	recordVideo: {
		id: 'fabric.editor.recordVideo',
		defaultMessage: 'Record a Loom video',
		description:
			'Shown as a menu item label in the editor insert menu, used to trigger recording a Loom video to embed in the document.',
	},
	addLoomVideo: {
		id: 'fabric.editor.addLoomVideo',
		defaultMessage: 'Record a Loom video',
		description:
			'Shown as a button label in the editor toolbar, used to trigger recording a Loom video to add to the document.',
	},
	addLoomVideoComment: {
		id: 'fabric.editor.addLoomVideoComment',
		defaultMessage: 'Record a Loom video comment',
		description:
			'Shown as a button label in the editor comment toolbar, used to trigger recording a Loom video comment to attach to the document.',
	},
	recordVideoDescription: {
		id: 'fabric.editor.recordVideo.description',
		defaultMessage: 'Record and share your screen and thoughts',
		description:
			'Displayed as a description text for the Loom video recording option in the editor insert menu, explaining that users can record and share their screen and thoughts.',
	},
	recordLoomShortTitle: {
		id: 'fabric.editor.recordLoomShortTitle',
		defaultMessage: 'Record',
		description:
			'Shown as a short button label in the editor toolbar for recording a Loom video when space is limited.',
	},
	turnInto: {
		id: 'fabric.editor.turnInto',
		defaultMessage: 'Turn into',
		description:
			'Menu option shown when right-clicking or selecting text. Allows users to convert selected text into different element types.',
	},
});
