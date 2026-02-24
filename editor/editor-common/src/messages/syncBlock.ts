import { defineMessages } from 'react-intl-next';

export const syncBlockMessages = defineMessages({
	copySyncBlockLabel: {
		id: 'fabric.editor.copySyncBlock',
		defaultMessage: 'Copy',
		description: 'Button label for copying the reference of sync block element to your clipboard',
	},
	copySyncedBlockTooltip: {
		id: 'fabric.editor.copySyncedBlockTooltip',
		defaultMessage: 'Copy synced block',
		description: 'Tooltip for the button to copy synced block element ',
	},
	editSourceLabel: {
		id: 'fabric.editor.editSourceLabel',
		defaultMessage: 'Edit source',
		description: 'Button label for editing the source of sync block element',
	},
	editSourceTooltip: {
		id: 'fabric.editor.editSourceTooltipEnabled',
		defaultMessage: 'Edit synced content at source location',
		description: 'Tooltip for the button to navigate to the source page of the sync block element',
	},
	editSourceTooltipDisabled: {
		id: 'fabric.editor.editSourceTooltipDisabled',
		defaultMessage: 'Source link is not currently available',
		description: 'Tooltip for the button to navigate to the source page, when URL is not available',
	},
	syncBlockGroup: {
		id: 'fabric.editor.syncBlockGroup',
		defaultMessage: 'Sync Block Types',
		description: 'aria-label for group of sync block the floating toolbar',
	},
	syncedBlockLabel: {
		id: 'fabric.editor.syncedBlock.label.text',
		defaultMessage: 'Synced block',
		description: 'Label which appears above the synced block when it is selected',
	},
	unsyncedBlockLabel: {
		id: 'fabric.editor.unsyncedBlock.label.text',
		defaultMessage: 'Unsynced block',
		description: 'Label which appears above the unsynced block when it is selected',
	},
	permissionDeniedHeading: {
		id: 'fabric.editor.syncedBlockPermissionDeniedHeading',
		defaultMessage: 'Request access to view synced block',
		description:
			'Heading for error state where the user does not have permission to view the synced block',
	},
	permissionDeniedDescription: {
		id: 'fabric.editor.syncedBlockPermissionDeniedDescription',
		defaultMessage: "You don't have access to view the source content of this synced block.",
		description:
			'Description for error state where the user does not have permission to view the synced block',
	},
	permissionDeniedAltText: {
		id: 'fabric.editor.syncedBlockPermissionDeniedIconAltText',
		defaultMessage: 'Permission denied.',
		description:
			'Alt text for icon on error state where the user does not have permission to view the synced block',
	},
	requestAccessButton: {
		id: 'fabric.editor.requestAccessToSyncedBlock',
		defaultMessage: 'Request access',
		description: 'Label for button which requests access to view the source page of the sync block',
	},
	accessRequested: {
		id: 'fabric.editor.accessToSyncedBlockRequested',
		defaultMessage: 'Access requested',
		description:
			'Text which displays after the request to view the source page of the sync block has been sent and is still pending',
	},
	requestAccessError: {
		id: 'fabric.editor.requestAccessToSyncedBlockError',
		defaultMessage: 'Something went wrong. Click to try again',
		description:
			'Text which displays next to the request access button after something went wrong after clicking the button.',
	},

	sourceSyncBlockTooltip: {
		id: 'fabric.editor.sourceSyncBlockTooltip',
		defaultMessage: 'When you edit this source block it will update across synced locations.',
		description: 'Description in tooltip which appears when you hover over the synced block label',
	},
	defaultSyncBlockTooltip: {
		id: 'fabric.editor.sourceSyncBlockTooltip',
		defaultMessage: 'Synced block',
		description:
			"Description in tooltip which appears when we haven't been able to fetch other information about the sync block",
	},
	referenceSyncBlockTooltip: {
		id: 'fabric.editor.referenceSyncBlockTooltip',
		defaultMessage: 'Synced from: {title}',
		description: 'Tooltip that shows the source page title of the synced block',
	},
	referenceSyncBlockLastEdited: {
		id: 'fabric.editor.referenceSyncBlockLastEdited',
		defaultMessage: 'Last edited: ',
		description: 'Tooltip that shows the last edited time of the synced block',
	},
	taskInDestinationSyncedBlockTooltip: {
		id: 'fabric.editor.taskInDestinationSyncedBlockTooltip',
		defaultMessage: 'This content is synced. Edit it at the source.',
		description: 'Tooltip that shows when you hover over a task in the destination synced block',
	},
	deletionConfirmationModalTitleSingle: {
		id: 'fabric.editor.deletionConfirmationModalTitleSingle',
		defaultMessage: 'Delete synced content?',
		description:
			'Title of delete confirmation modal that appears when user tries to delete source synced block that has no reference',
	},
	deleteConfirmationModalTitleMultiple: {
		id: 'fabric.editor.deleteConfirmationModalTitleMultiple',
		defaultMessage: 'Delete content in {count, plural, one {1 location} other {# locations}}?',
		description:
			'Title of delete confirmation modal that appears when user tries to delete source synced block that has references',
	},
	deleteConfirmationModalCancelButton: {
		id: 'fabric.editor.deleteConfirmationModalCancelButton',
		defaultMessage: 'Cancel',
		description:
			'Text on button which cancels deleting when user was trying to delete source synced block',
	},
	deleteConfirmationModalDeleteButton: {
		id: 'fabric.editor.deleteConfirmationModalDeleteButton',
		defaultMessage: 'Delete',
		description:
			'Text on button which confirms deleting the sync block when user was trying to delete source synced block',
	},
	deleteRetryButton: {
		id: 'fabric.editor.deleteConfirmationModalRetryButton',
		defaultMessage: 'Try again',
		description:
			'Text on button which retries deleting the sync block when the previous deletion failed',
	},
	deletionConfirmationModalDescription: {
		id: 'fabric.editor.deletionConfirmationModalDescription',
		defaultMessage:
			'If you delete this synced block, it will become an “Unsynced block” in other locations. This action is permanent and cannot be undone.',
		description:
			'Description of delete confirmation modal that appears when user tries to delete source synced block',
	},
	deletionConfirmationModalDescriptionNoRef: {
		id: 'fabric.editor.deletionConfirmationModalDescriptionNoRef',
		defaultMessage:
			'Your content will no longer appear, and the synced block will be deleted. This action is permanent and cannot be undone.',
		description:
			'Description of delete confirmation modal that appears when user tries to delete source synced block',
	},
	createSyncBlockLabel: {
		id: 'fabric.editor.createSyncBlockLabel',
		defaultMessage: 'Create synced block',
		description: 'Label for button which creates a new synced block',
	},
	newLozenge: {
		id: 'fabric.editor.syncBlock.toolbar.newLozenge',
		defaultMessage: 'New',
		description:
			'Text in lozenge that appears next to the create synced block button in the toolbar dropdown menu to show that it is a new feature',
	},
	failToDeleteTitle: {
		id: 'fabric.editor.error.title.failToDelete',
		defaultMessage: 'Failed to delete',
		description: 'Title in flag which appears when a sync block cannot be deleted',
	},
	failToDeleteWhenOfflineDescription: {
		id: 'fabric.editor.error.description.failToDeleteWhenOffline',
		defaultMessage:
			'You appear to be offline. Please connect to the internet to delete synced content.',
		description:
			'Description in flag which appears when a sync block cannot be deleted in offline mode',
	},
	cannotDeleteTitle: {
		id: 'fabric.editor.error.flag.title.cannotDelete',
		defaultMessage: 'Failed to delete synced block',
		description: 'Title in flag which appears when a sync block cannot be deleted',
	},
	cannotDeleteDescription: {
		id: 'fabric.editor.error.description.cannotDelete',
		defaultMessage: 'An error occurred while trying to delete this synced block. ',
		description: 'Description in flag which appears when a sync block fails to be deleted',
	},
	failToEditTitle: {
		id: 'fabric.editor.error.title.failToEdit',
		defaultMessage: 'Cannot edit synced content offline',
		description: 'Title in flag which appears when a sync block cannot be edited',
	},
	failToEditWhenOfflineDescription: {
		id: 'fabric.editor.error.description.failToEditWhenOffline',
		defaultMessage:
			'You appear to be offline. Please connect to the internet to edit synced content.',
		description:
			'Description in flag which appears when a sync block cannot be edited in offline mode',
	},
	failToCreateTitle: {
		id: 'fabric.editor.error.title.failToCreate',
		defaultMessage: 'Cannot create synced content offline',
		description: 'Title in flag which appears when a sync block cannot be created',
	},
	failToCreateWhenOfflineDescription: {
		id: 'fabric.editor.error.description.failToCreateWhenOffline',
		defaultMessage:
			'You appear to be offline. Please connect to the internet to create synced content.',
		description:
			'Description in flag which appears when a sync block cannot be created in offline mode',
	},
	loadingSyncedContent: {
		id: 'fabric.editor.syncedBlockLoadingSyncedContent',
		defaultMessage: 'Loading synced content',
		description: 'Accessible label for the loading spinner shown while synced block content is being fetched',
	},
	generalErrorDescription: {
		id: 'fabric.editor.syncedBlockGeneralErrorDescription',
		defaultMessage: `We're unable to display this content at the moment.`,
		description: 'Description for general error state of the synced block',
	},
	notFoundAltText: {
		id: 'fabric.editor.syncedBlockNotFoundIconAltText',
		defaultMessage: 'Synced block not found.',
		description:
			'Alt text for icon on error state where the synced block cannot be found or no longer exists',
	},
	notFoundDescription: {
		id: 'fabric.editor.syncedBlockNotFoundDescription.non-final',
		defaultMessage:
			"We're unable to display this content as its source has been deleted or archived.",
		description: 'Description for error state where the synced block cannot be found',
	},
	sourceUnsyncedDescription: {
		id: 'fabric.editor.syncedBlockSourceUnsyncedDescription',
		defaultMessage:
			"We're unable to display this content as it's been unsynced from <a>{title}</a>.",
		description: 'Description for error state where the synced block has its source unsynced',
	},
	sourceDeletedDescription: {
		id: 'fabric.editor.syncedBlockSourceDeletedDescription',
		defaultMessage:
			"We're unable to display this content as it's been deleted from <a>{title}</a>.",
		description: 'Description for error state where the synced block has its source unsynced',
	},
	genericNotFoundDescription: {
		id: 'fabric.editor.syncedBlockGenericNotFoundDescription',
		defaultMessage: "We're unable to display this synced content as it's been deleted or unsynced.",
		description:
			'Description for error state where the synced block has its source unsynced or deleted',
	},
	retryButton: {
		id: 'fabric.editor.retrySyncedBlock',
		defaultMessage: 'Try again',
		description: 'Label for button which retries loading the synced block',
	},
	offlineError: {
		id: 'fabric.editor.error.description.reference.offline',
		defaultMessage: `We're unable to display synced blocks when you're offline`,
		description: 'Error message which is shown over sync block when the editor is offline',
	},
	unpublishedError: {
		id: 'fabric.editor.error.description.reference.unpublished',
		defaultMessage: 'Synced content will display <link>when the page is published</link>',
		description:
			'Error message which is shown over sync block when the source page is unpublished.',
	},
	syncBlockCopiedTitle: {
		id: 'fabric.editor.syncBlockCopiedTitle',
		defaultMessage: 'Synced block copied to clipboard',
		description: 'Title in flag which appears when a sync block is copied',
	},
	syncBlockCopiedDescription: {
		id: 'fabric.editor.syncBlockCopiedDescription',
		defaultMessage:
			'Paste your synced block to keep content auto-updated. Permissions are the same.',
		description: 'Description in flag which appears when a sync block is copied',
	},
	syncBlockCopiedAction: {
		id: 'fabric.editor.syncBlockCopiedAction',
		defaultMessage: 'Learn more',
		description: 'Action in flag which appears when a sync block is copied to learn more',
	},
	syncedLocationDropdownTitle: {
		id: 'fabric.editor.syncedLocationDropdownTitle',
		defaultMessage: 'Synced locations',
		description:
			'Title for the dropdown menu that shows the synced (referenced) locations of the source sync block',
	},
	syncedLocationDropdownHeading: {
		id: 'fabric.editor.syncedLocationDropdownHeading',
		defaultMessage: '{count} locations:',
		description:
			'Heading for the dropdown menu that shows the synced (referenced) locations of the source sync block',
	},
	syncedLocationDropdownError: {
		id: 'fabric.editor.syncedLocationDropdownError',
		defaultMessage:
			"We can't load locations right now. Please wait a few minutes and refresh your browser.",
		description:
			'Error message shown in the synced location dropdown menu when fail to fetch the synced (referenced) locations of the source sync block',
	},
	syncedLocationDropdownNoResults: {
		id: 'fabric.editor.syncedLocationDropdownNoResults',
		defaultMessage: 'Copy and paste synced blocks to reuse in other locations.',
		description:
			'Message shown in the synced location dropdown menu when no shared locations are found',
	},
	syncedLocationDropdownLearnMoreLink: {
		id: 'fabric.editor.syncedLocationDropdownLearnMoreLink',
		defaultMessage: 'Learn more about synced blocks',
		description:
			'Link shown in the synced location dropdown menu to learn more about synced blocks',
	},
	syncedLocationDropdownSamePage: {
		id: 'fabric.editor.syncedLocationDropdownSamePage',
		defaultMessage: 'This page',
		description:
			'Message shown in the synced location dropdown option when the reference sync block is on the same page',
	},
	syncedLocationDropdownTitleBlockIndex: {
		id: 'fabric.editor.syncedLocationDropdownTitleNote',
		defaultMessage: 'block {index}',
		description:
			'Suffix for page title shown in synced location dropdown option when there are multiple references to the same page',
	},
	syncedLocationDropdownTitleNoteForConfluencePage: {
		id: 'fabric.editor.syncedLocationDropdownTitleNoteForConfluencePage',
		defaultMessage: 'This page',
		description:
			'Note shown next to the page title in the synced location dropdown option when the sync block is on the current page',
	},
	syncedLocationDropdownTitleNoteForJiraWorkItem: {
		id: 'fabric.editor.syncedLocationDropdownTitleNoteForJiraWorkItem',
		defaultMessage: 'This work item',
		description:
			'Note shown next to the work item title in the synced location dropdown option when the sync block is on the current work item',
	},
	syncedLocationDropdownSourceLozenge: {
		id: 'fabric.editor.syncedLocationDropdownSourceLozenge',
		defaultMessage: 'Source',
		description:
			'Lozenge label shown in the synced location dropdown option when the sync block is source',
	},
	syncedLocationDropdownRequestAccess: {
		id: 'fabric.editor.syncedLocationDropdownRequestAccess',
		defaultMessage: 'Request access',
		description:
			'Label shown in the synced location dropdown option when the sync block is not accessible to the user',
	},
	unpublishedSyncBlockPastedTitle: {
		id: 'fabric.editor.unpublishedSyncBlockPastedTitle',
		defaultMessage: 'Pasted from unpublished page',
		description:
			'Title in flag which appears when a reference to an unpublished sync block is pasted',
	},
	unpublishedSyncBlockPastedDescription: {
		id: 'fabric.editor.unpublishedSyncBlockPastedDescription',
		defaultMessage: 'When the page is published, the content will be displayed.',
		description:
			'Description in flag which appears when a reference to an unpublished sync block is pasted',
	},
	unsyncButton: {
		id: 'fabric.editor.syncedBlock.unsync',
		defaultMessage: 'Unsync',
		description: 'Text on the button which unsyncs the sync block',
	},
	deleteConfirmationModalUnsyncButton: {
		id: 'fabric.editor.deleteConfirmationModalUnsyncButton',
		defaultMessage: 'Unsync',
		description:
			'Text on button which confirms unsyncing the sync block when user was trying to unsync source synced block',
	},
	unsyncConfirmationModalTitle: {
		id: 'fabric.editor.unsyncConfirmationModalTitle',
		defaultMessage: 'Unsync this content?',
		description:
			'Title of unsync confirmation modal that appears when user tries to unsync source synced block',
	},
	unsyncConfirmModalDescriptionSingle: {
		id: 'fabric.editor.unsyncConfirmModalDescriptionSingle',
		defaultMessage:
			'Your content will stay here. It will no longer be a synced block. This action is permanent and cannot be undone.',
		description:
			'Description of unsync confirmation modal that appears when user tries to unsync source synced block with no reference',
	},
	unsyncConfirmModalDescriptionMultiple: {
		id: 'fabric.editor.unsyncConfirmModalDescriptionMultiple',
		defaultMessage:
			'Your content will stay here. In {syncBlockCount, plural, one {1 other synced location} other {# other synced locations}} it will appear as an “Unsynced block”. This action is permanent and cannot be undone.',
		description:
			'Description of unsync confirmation modal that appears when user tries to unsync source synced block with multiple references',
	},
	cannotPasteSyncedBlockTitle: {
		id: 'fabric.editor.cannotPasteSyncedBlockTitle',
		defaultMessage: 'Unable to paste',
		description: 'Title in flag which appears when a synced block cannot be pasted',
	},
	cannotPasteSyncedBlockDescription: {
		id: 'fabric.editor.cannotPasteSyncedBlockDescription',
		defaultMessage:
			'We’re still building this feature. Currently, you can only paste synced content once your work item has been created. ',
		description: 'Description in flag which appears when a synced block cannot be pasted',
	},
	cannotPasteSyncedBlockAction: {
		id: 'fabric.editor.cannotPasteSyncedBlockAction',
		defaultMessage: 'Learn more',
		description: 'Action in flag which appears when a synced block cannot be pasted to learn more',
	},
	cannotCreateSyncBlockTitle: {
		id: 'fabric.editor.cannotCreateSyncBlockTitle',
		defaultMessage: 'Unable to create synced block',
		description: 'Title in flag which appears when a synced block cannot be created',
	},
	CannotCreateSyncBlockDescription: {
		id: 'fabric.editor.cannotCreateSyncBlockDescription',
		defaultMessage: 'An error occurred while trying to create this synced block. ',
		description: 'Description in flag which appears when a synced block cannot be created',
	},
	inlineExtensionInSyncBlockTitle: {
		id: 'fabric.editor.inlineExtensionInSyncBlockTitle',
		defaultMessage: 'Some macros may not work when adding synced blocks to new locations',
		description:
			'Title in flag which appears when an inline extension is inserted into a synced block',
	},
	inlineExtensionInSyncBlockDescription: {
		id: 'fabric.editor.inlineExtensionInSyncBlockDescription',
		defaultMessage:
			"This may happen if your synced block is used in places that don't support certain macros.",
		description:
			'Description in flag which appears when an inline extension is inserted into a synced block',
	},
});
