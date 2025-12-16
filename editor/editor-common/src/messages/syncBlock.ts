import { defineMessages } from 'react-intl-next';

export const syncBlockMessages = defineMessages({
	copySyncBlockLabel: {
		id: 'fabric.editor.copySyncBlock',
		defaultMessage: 'Copy',
		description: 'Button label for copying the reference of sync block element to your clipboard',
	},
	copySyncBlockTooltip: {
		id: 'fabric.editor.copySyncBlockTooltip',
		defaultMessage: 'Copy reference to clipboard',
		description:
			'Tooltip for the button to copy the reference of sync block element to your clipboard',
	},

	editSourceLabel: {
		id: 'fabric.editor.editSourceLabel',
		defaultMessage: 'Edit source',
		description: 'Button label for editing the source of sync block element',
	},
	editSourceTooltip: {
		id: 'fabric.editor.editSourceTooltip',
		defaultMessage: 'Edit at the source location',
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
	permissionDeniedHeading: {
		id: 'fabric.editor.syncedBlockPermissionDeniedHeading',
		defaultMessage: "Request access to view synced block",
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
	deleteConfirmationModalTitle: {
		id: 'fabric.editor.deleteConfirmationModalTitle',
		defaultMessage: "You're about to delete synced content",
		description:
			'Title of delete confirmation modal that appears when user tries to delete source synced block',
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
	deleteConfirmationModalDescription: {
		id: 'fabric.editor.deleteConfirmationModalDescriptionSingle',
		defaultMessage:
			'Deleting this content will also remove {syncBlockCount, plural, one {a synced block. References to this block} other {# synced blocks. References to these blocks}} in other locations will show an error. Continue with deletion?',
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
		id: 'fabric.editor.error.title.cannotDelete',
		defaultMessage: "We couldn't delete the synced block",
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
	retryButton: {
		id: 'fabric.editor.retrySyncedBlock',
		defaultMessage: 'Try again',
		description: 'Label for button which retries loading the synced block',
	},

	offlineError: {
		id: 'fabric.editor.error.description.offline',
		defaultMessage: `We're unable to display this content at the moment because you are offline.`,
		description: 'Error message which is shown over sync block when the editor is offline'
	},
	syncBlockCopiedTitle: {
		id: 'fabric.editor.syncBlockCopiedTitle',
		defaultMessage: 'Synced block copied to clipboard',
		description: 'Title in flag which appears when a sync block is copied',
	},
	syncBlockCopiedDescription: {
		id: 'fabric.editor.syncBlockCopiedDescription',
		defaultMessage: 'Paste your synced block to keep content auto-updated. Permissions are the same.',
		description: 'Description in flag which appears when a sync block is copied',
	},
	syncBlockCopiedAction: {
		id: 'fabric.editor.syncBlockCopiedAction',
		defaultMessage: 'Learn more',
		description: 'Action in flag which appears when a sync block is copied to learn more',
	},
});
