import { defineMessages } from 'react-intl';

export const messages: {
	activityCategory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	addCustomEmojiLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	addEmojiLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	allUploadsCustomCategory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	cancelLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	categoriesSearchResults: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	categoriesSelectorLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	changeEmojiShortnameButtonLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	deleteEmojiDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	deleteEmojiFailed: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	deleteEmojiLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	deleteEmojiTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	deleteEmojiTooltip: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	deleteEmojiTooltipForScreenreader: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiButtonRoleDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiChooseFileDndTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiChooseFileScreenReaderDescription: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiChooseFileTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiDuplicateName: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiImageRequirements: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiImageTooBig: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiInvalidImage: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiNameAriaLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiNameLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiPickerAddCustomEmoji: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiPickerGrid: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiPickerNoResults: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiPickerListPanel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiPickerTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiPlaceholder: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiPreview: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiPreviewTitle: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiSelectSkinToneButtonAriaLabelText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiSelectColorButtonAriaLabelText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiSelectColorListAriaLabelText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiSelectSkinToneListAriaLabelText: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiUnsupportedFileType: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiUploadFailed: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	emojiUploadTimeout: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	error: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	flagsCategory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	foodsCategory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	frequentCategory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	natureCategory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	objectsCategory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	peopleCategory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	placesCategory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	productivityCategory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	retryLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	searchLabel: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	searchPlaceholder: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	searchResultsStatus: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	searchResultsStatusSeeAll: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	symbolsCategory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
	userUploadsCustomCategory: {
		defaultMessage: string;
		description: string;
		id: string;
	};
} = defineMessages({
	deleteEmojiTooltip: {
		id: 'fabric.emoji.delete.tooltip',
		defaultMessage: 'Delete',
		description: 'Tooltip content for delete emoji when focus on deletable emoji',
	},
	deleteEmojiTooltipForScreenreader: {
		id: 'fabric.emoji.delete.screenreader.tooltip',
		defaultMessage: 'To delete {shortName} emoji, press Backspace',
		description: 'Tooltip content for delete emoji when focus on deletable emoji',
	},
	deleteEmojiTitle: {
		id: 'fabric.emoji.delete.title',
		defaultMessage: 'Remove emoji',
		description:
			'Heading text shown at the top of the emoji removal confirmation dialog, prompting the user to confirm removing the selected custom emoji.',
	},
	deleteEmojiDescription: {
		id: 'fabric.emoji.delete.description',
		defaultMessage: 'All existing instances of this emoji will be replaced with {emojiShortName}',
		description:
			'Body text shown inside the emoji removal confirmation dialog. The placeholder {emojiShortName} will be substituted with the short name (e.g. ":smile:") of the replacement emoji.',
	},
	deleteEmojiLabel: {
		id: 'fabric.emoji.delete.label',
		defaultMessage: 'Remove',
		description:
			'Label for the primary action button in the emoji removal confirmation dialog that confirms and executes the removal.',
	},
	addCustomEmojiLabel: {
		id: 'fabric.emoji.add.custom.emoji.label',
		defaultMessage: 'Add your own emoji',
		description:
			'Label for the button in the emoji picker that opens the custom emoji upload panel, allowing users to add their own emoji.',
	},
	emojiPlaceholder: {
		id: 'fabric.emoji.placeholder',
		defaultMessage: 'e.g. hello',
		description: 'Placeholder for emoji that provides an example for emoji name',
	},
	emojiNameAriaLabel: {
		id: 'fabric.emoji.name.ariaLabel',
		defaultMessage: 'Enter a name for the new emoji',
		description: 'Explains to enter a name for a new emoji',
	},
	emojiNameLabel: {
		id: 'fabric.emoji.name.label',
		defaultMessage: 'Emoji name',
		description: 'Label for the emoji name input field in the custom emoji upload panel',
	},
	emojiChooseFileTitle: {
		id: 'fabric.emoji.choose.file.title',
		defaultMessage: 'Choose file',
		description:
			'Label for the file chooser button in the custom emoji upload panel where users select an image file for their emoji.',
	},
	emojiChooseFileDndTitle: {
		id: 'fabric.emoji.choose.file.dnd.title',
		defaultMessage: 'Select or drop an image',
		description:
			'Label for the file chooser button in the custom emoji upload panel where users select or drag and drop an image file for their emoji.',
	},
	emojiChooseFileScreenReaderDescription: {
		id: 'fabric.emoji.choose.file.screenReaderDescription',
		defaultMessage: 'Choose a file for the emoji. JPG, PNG or GIF. Max size 1 MB',
		description:
			'Message indicating the purpose of choosing the file and requirements for the file',
	},
	emojiSelectSkinToneButtonAriaLabelText: {
		id: 'fabric.emoji.select.skin.tone.ariaLabel',
		defaultMessage: 'Choose your skin tone, {selectedTone} selected',
		description:
			'Message indicating the purpose of the skin tone selection button and the selected tone',
	},
	emojiSelectColorButtonAriaLabelText: {
		id: 'fabric.emoji.select.color.ariaLabel',
		defaultMessage: 'Productivity emoji color selector',
		description:
			'Message indicating the purpose of the color selection button and the selected color',
	},
	emojiSelectColorListAriaLabelText: {
		id: 'fabric.emoji.select.color.list.ariaLabel',
		defaultMessage: 'Productivity emoji colour selector',
		description: 'Message indicating the purpose of the productivity emoji color list selector',
	},
	emojiSelectSkinToneListAriaLabelText: {
		id: 'fabric.emoji.select.skin.list.ariaLabel',
		defaultMessage: 'Skin tone selector',
		description:
			'Message indicating the purpose of the skin tone list and make user to choose one tone',
	},
	emojiImageRequirements: {
		id: 'fabric.emoji.image.requirements',
		defaultMessage: 'JPG, PNG or GIF. Max size 1 MB.',
		description: 'Message for emoji image requirements and maximum file size',
	},
	emojiPreviewTitle: {
		id: 'fabric.emoji.preview.title',
		defaultMessage: 'Preview',
		description:
			'Section heading shown above the emoji preview area in the custom emoji upload panel.',
	},
	emojiPreview: {
		id: 'fabric.emoji.preview',
		defaultMessage: 'Your new emoji {emoji} looks great',
		description:
			'Success text shown in the emoji preview area after the user uploads a new emoji image. The placeholder {emoji} will be substituted with the rendered emoji image.',
	},
	addEmojiLabel: {
		id: 'fabric.emoji.add.label',
		defaultMessage: 'Add emoji',
		description:
			'Label for the submit button in the custom emoji upload panel that saves the new emoji to the workspace.',
	},
	retryLabel: {
		id: 'fabric.emoji.retry.label',
		defaultMessage: 'Retry',
		description:
			'Label for the button in the custom emoji upload panel that retries a previously failed upload attempt.',
	},
	cancelLabel: {
		id: 'fabric.emoji.cancel.label',
		defaultMessage: 'Cancel',
		description:
			'Label for the cancel button in the custom emoji upload panel that dismisses the panel without saving.',
	},
	searchPlaceholder: {
		id: 'fabric.emoji.search.placeholder',
		defaultMessage: 'Search',
		description:
			'Placeholder text shown inside the emoji search input field in the emoji picker before the user types a query.',
	},
	searchLabel: {
		id: 'fabric.emoji.search.label',
		defaultMessage: 'Emoji name',
		description:
			'Accessible label for the emoji name search input field in the emoji picker, used by screen readers.',
	},
	searchResultsStatus: {
		id: 'fabric.emoji.search.status.count',
		defaultMessage: 'Found {count} emojis',
		description: 'search results status for screenreader to read out',
	},
	searchResultsStatusSeeAll: {
		id: 'fabric.emoji.search.status',
		defaultMessage: 'Seeing all emojis',
		description: 'search results status when no search query for screenreader to read out',
	},
	categoriesSelectorLabel: {
		id: 'fabric.emoji.categories.label',
		defaultMessage: 'Choose an emoji category',
		description: 'Aria label for Emoji categories selector at the top of emoji picker',
	},
	categoriesSearchResults: {
		id: 'fabric.emoji.categories.search.results',
		defaultMessage: 'Search results',
		description:
			'Category heading label shown in the emoji picker category bar when displaying results from a search query.',
	},
	frequentCategory: {
		id: 'fabric.emoji.category.frequent',
		defaultMessage: 'Frequent',
		description:
			'Label for the Frequent category tab in the emoji picker, showing recently used emojis.',
	},
	peopleCategory: {
		id: 'fabric.emoji.category.people',
		defaultMessage: 'People',
		description:
			'Label for the People category tab in the emoji picker, showing face and person emojis.',
	},
	natureCategory: {
		id: 'fabric.emoji.category.nature',
		defaultMessage: 'Nature',
		description:
			'Label for the Nature category tab in the emoji picker, showing animal and nature emojis.',
	},
	foodsCategory: {
		id: 'fabric.emoji.category.foods',
		defaultMessage: 'Food & Drink',
		description: 'Label for the Food and Drink category tab in the emoji picker.',
	},
	activityCategory: {
		id: 'fabric.emoji.category.activity',
		defaultMessage: 'Activity',
		description:
			'Label for the Activity category tab in the emoji picker, showing sports and activity emojis.',
	},
	placesCategory: {
		id: 'fabric.emoji.category.places',
		defaultMessage: 'Travel & Places',
		description:
			'Label for the Travel and Places category tab in the emoji picker, showing location and travel emojis.',
	},
	objectsCategory: {
		id: 'fabric.emoji.category.objects',
		defaultMessage: 'Objects',
		description:
			'Label for the Objects category tab in the emoji picker, showing everyday object emojis.',
	},
	symbolsCategory: {
		id: 'fabric.emoji.category.symbols',
		defaultMessage: 'Symbols',
		description:
			'Label for the Symbols category tab in the emoji picker, showing symbol and sign emojis.',
	},
	flagsCategory: {
		id: 'fabric.emoji.category.flags',
		defaultMessage: 'Flags',
		description:
			'Label for the Flags category tab in the emoji picker, showing country and regional flag emojis.',
	},
	productivityCategory: {
		id: 'fabric.emoji.category.productivity',
		defaultMessage: 'Atlassian & productivity',
		description:
			'Label for the Atlassian and productivity category tab in the emoji picker, showing Atlassian product and productivity emojis.',
	},
	userUploadsCustomCategory: {
		id: 'fabric.emoji.category.user.uploads',
		defaultMessage: 'Your uploads',
		description:
			'Label for the Your Uploads category tab in the emoji picker, showing custom emojis uploaded by the current user.',
	},
	allUploadsCustomCategory: {
		id: 'fabric.emoji.category.all.uploads',
		defaultMessage: 'All uploads',
		description:
			'Label for the All Uploads category tab in the emoji picker, showing all custom emojis uploaded across the workspace.',
	},
	deleteEmojiFailed: {
		id: 'fabric.emoji.error.delete.failed',
		defaultMessage: 'Remove failed',
		description: 'Error message when custom emoji failed to be removed',
	},
	emojiInvalidImage: {
		id: 'fabric.emoji.error.invalid.image',
		defaultMessage: 'Selected image is invalid',
		description: 'Error message for invalid selected image',
	},
	emojiUploadFailed: {
		id: 'fabric.emoji.error.upload.failed',
		defaultMessage: 'Upload failed',
		description:
			'Error message shown in the custom emoji upload panel when the image upload fails due to an error.',
	},
	emojiUploadTimeout: {
		id: 'fabric.emoji.error.upload.timeout',
		defaultMessage: 'Upload timed out',
		description:
			'Error message shown in the custom emoji upload panel when the image upload fails because it timed out.',
	},
	emojiImageTooBig: {
		id: 'fabric.emoji.error.image.too.big',
		defaultMessage: 'Selected image is more than 1 MB',
		description: 'Error message for image too big, beyond the size limit',
	},
	emojiUnsupportedFileType: {
		id: 'fabric.emoji.error.unsupported.file.type',
		defaultMessage:
			"This file type isn't supported. Select a PNG, JPEG, or GIF to create your emoji.",
		description: 'Error message shown when the selected emoji upload file type is not supported',
	},
	emojiDuplicateName: {
		id: 'fabric.emoji.error.duplicate.name',
		defaultMessage: 'An emoji with this name exists already',
		description:
			'Error message shown when the user tries to upload an emoji with a name that already exists in the custom emoji set',
	},
	emojiPickerNoResults: {
		id: 'fabric.emoji.picker.no.results',
		defaultMessage: 'No results',
		description:
			'Heading shown in the emoji picker when a search query returns no matching emojis.',
	},
	emojiPickerAddCustomEmoji: {
		id: 'fabric.emoji.picker.add.custom.emoji',
		defaultMessage: 'Add custom emoji',
		description:
			'Label for the button shown in the emoji picker no-results screen that opens the custom emoji upload panel.',
	},
	emojiPickerTitle: {
		id: 'fabric.emoji.picker',
		defaultMessage: 'Emoji picker',
		description:
			'Accessible aria-label for the emoji picker dialog, used by screen readers to identify the picker.',
	},
	emojiPickerListPanel: {
		id: 'fabric.emoji.pickerlist.tabpanel',
		defaultMessage: 'Emojis actions and list panel',
		description: 'Aria lable for tabpanel of emoji picker, which shows emojis actions and list',
	},
	emojiPickerGrid: {
		id: 'fabric.emoji.pickerlist.grid',
		defaultMessage: '{showSearchResults, select, true{Search results} other{Emojis}}',
		description: `Aria label for emoji picker grid, showSearchResults is a boolean variable, message will be "Entering Emojis table", or "Leaving Emojis"`,
	},
	emojiButtonRoleDescription: {
		id: 'fabric.emoji.emojipicker.emoi.roledescription',
		defaultMessage: 'emoji button',
		description: `Aria roledescription for emoji button, used in emoji picker.`,
	},
	changeEmojiShortnameButtonLabel: {
		id: 'fabric.emoji.change.shortname.button.label',
		defaultMessage: 'Change emoji, currently {shortName}',
		description: 'Aria label for the button in page title used to change emoji',
	},
	error: {
		id: 'fabric.emoji.emojipicker.error',
		defaultMessage: 'Error!',
		description: `Aria label for error icon, apperaed in emoji uploader screens and delete emoji screens of emoji picker`,
	},
});
