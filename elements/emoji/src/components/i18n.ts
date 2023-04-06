import { defineMessages } from 'react-intl-next';

export const messages = defineMessages({
  deleteEmojiTooltip: {
    id: 'fabric.emoji.delete.tooltip',
    defaultMessage: 'Delete',
    description:
      'Tooltip content for delete emoji when focus on deletable emoji',
  },
  deleteEmojiTooltipForScreenreader: {
    id: 'fabric.emoji.delete.screenreader.tooltip',
    defaultMessage: 'To delete {shortName} emoji, press Backspace',
    description:
      'Tooltip content for delete emoji when focus on deletable emoji',
  },
  deleteEmojiTitle: {
    id: 'fabric.emoji.delete.title',
    defaultMessage: 'Remove emoji',
    description: 'Title for emoji removal dialog',
  },
  deleteEmojiDescription: {
    id: 'fabric.emoji.delete.description',
    defaultMessage:
      'All existing instances of this emoji will be replaced with {emojiShortName}',
    description: 'Description for emoji removal dialog',
  },
  deleteEmojiLabel: {
    id: 'fabric.emoji.delete.label',
    defaultMessage: 'Remove',
    description: 'Button label to remove emoji',
  },
  addCustomEmojiLabel: {
    id: 'fabric.emoji.add.custom.emoji.label',
    defaultMessage: 'Add your own emoji',
    description: 'Button label to add custom emoji',
  },
  emojiPlaceholder: {
    id: 'fabric.emoji.placeholder',
    defaultMessage: 'e.g. hello',
    description:
      'Placeholder for emoji that provides an example for emoji name',
  },
  emojiNameAriaLabel: {
    id: 'fabric.emoji.name.ariaLabel',
    defaultMessage: 'Enter a name for the new emoji',
    description: 'Explains to enter a name for a new emoji',
  },
  emojiChooseFileTitle: {
    id: 'fabric.emoji.choose.file.title',
    defaultMessage: 'Choose file',
    description: 'Choose custom emoji file',
  },
  emojiChooseFileScreenReaderDescription: {
    id: 'fabric.emoji.choose.file.screenReaderDescription',
    defaultMessage:
      'Choose a file for the emoji. JPG, PNG or GIF. Max size 1 MB',
    description:
      'Message indicating the purpose of choosing the file and requirements for the file',
  },
  emojiSelectSkinToneButtonAriaLabelText: {
    id: 'fabric.emoji.select.skin.tone.ariaLabel',
    defaultMessage: 'Choose your skin tone, {selectedTone} selected',
    description:
      'Message indicating the purpose of the skin tone selection button and the selected tone',
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
    description: 'Emoji preview title',
  },
  emojiPreview: {
    id: 'fabric.emoji.preview',
    defaultMessage: 'Your new emoji {emoji} looks great',
    description: 'Emoji preview',
  },
  addEmojiLabel: {
    id: 'fabric.emoji.add.label',
    defaultMessage: 'Add emoji',
    description: 'verb - Button label to add emoji',
  },
  retryLabel: {
    id: 'fabric.emoji.retry.label',
    defaultMessage: 'Retry',
    description: 'verb - Button label to retry upload',
  },
  cancelLabel: {
    id: 'fabric.emoji.cancel.label',
    defaultMessage: 'Cancel',
    description: 'verb - button label to cancel operation',
  },
  searchPlaceholder: {
    id: 'fabric.emoji.search.placeholder',
    defaultMessage: 'Search',
    description: 'Placeholder for search emoji field',
  },
  searchLabel: {
    id: 'fabric.emoji.search.label',
    defaultMessage: 'Emoji name',
    description: 'verb - button label to search',
  },
  searchResultsStatus: {
    id: 'fabric.emoji.search.status',
    defaultMessage: 'Found {count} emojis',
    description: 'search results status for screenreader to read out',
  },
  searchResultsStatusSeeAll: {
    id: 'fabric.emoji.search.status',
    defaultMessage: 'Seeing all emojis',
    description:
      'search results status when no search query for screenreader to read out',
  },
  categoriesSelectorLabel: {
    id: 'fabric.emoji.categories.label',
    defaultMessage: 'Choose an emoji category',
    description:
      'Aria label for Emoji categories selector at the top of emoji picker',
  },
  categoriesSearchResults: {
    id: 'fabric.emoji.categories.search.results',
    defaultMessage: 'Search results',
    description: 'Emoji categories search results',
  },
  frequentCategory: {
    id: 'fabric.emoji.category.frequent',
    defaultMessage: 'Frequent',
    description: 'Emoji frequent category',
  },
  peopleCategory: {
    id: 'fabric.emoji.category.people',
    defaultMessage: 'People',
    description: 'Emoji frequent category',
  },
  natureCategory: {
    id: 'fabric.emoji.category.nature',
    defaultMessage: 'Nature',
    description: 'Emoji nature category',
  },
  foodsCategory: {
    id: 'fabric.emoji.category.foods',
    defaultMessage: 'Food & Drink',
    description: 'Emoji Foods category',
  },
  activityCategory: {
    id: 'fabric.emoji.category.activity',
    defaultMessage: 'Activity',
    description: 'Emoji activity category',
  },
  placesCategory: {
    id: 'fabric.emoji.category.places',
    defaultMessage: 'Travel & Places',
    description: 'Emoji Places category',
  },
  objectsCategory: {
    id: 'fabric.emoji.category.objects',
    defaultMessage: 'Objects',
    description: 'Emoji objects category',
  },
  symbolsCategory: {
    id: 'fabric.emoji.category.symbols',
    defaultMessage: 'Symbols',
    description: 'Emoji symbols category',
  },
  flagsCategory: {
    id: 'fabric.emoji.category.flags',
    defaultMessage: 'Flags',
    description: 'Emoji flags category',
  },
  productivityCategory: {
    id: 'fabric.emoji.category.productivity',
    defaultMessage: 'Productivity',
    description: 'Emoji productivity category',
  },
  userUploadsCustomCategory: {
    id: 'fabric.emoji.category.user.uploads',
    defaultMessage: 'Your uploads',
    description: 'User uploads in the custom category',
  },
  allUploadsCustomCategory: {
    id: 'fabric.emoji.category.all.uploads',
    defaultMessage: 'All uploads',
    description: 'All uploads in the custom category',
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
    description: 'Failed to upload emoji image',
  },
  emojiImageTooBig: {
    id: 'fabric.emoji.error.image.too.big',
    defaultMessage: 'Selected image is more than 1 MB',
    description: 'Error message for image too big, beyond the size limit',
  },
  emojiPickerTitle: {
    id: 'fabric.emoji.picker',
    defaultMessage: 'Emoji picker',
    description: 'Aria label for emoji picker',
  },
  emojiPickerListPanel: {
    id: 'fabric.emoji.pickerlist.tabpanel',
    defaultMessage: 'Emojis actions and list panel',
    description:
      'Aria lable for tabpanel of emoji picker, which shows emojis actions and list',
  },
  emojiPickerGrid: {
    id: 'fabric.emoji.pickerlist.grid',
    defaultMessage:
      '{showSearchResults, select, true{Search results} other{Emojis}}',
    description: `Aria label for emoji picker grid, showSearchResults is a boolean variable, message will be "Entering Emojis table", or "Leaving Emojis"`,
  },
  emojiButtonRoleDescription: {
    id: 'fabric.emoji.emojipicker.emoi.roledescription',
    defaultMessage: 'emoji button',
    description: `Aria roledescription for emoji button, used in emoji picker.`,
  },
  error: {
    id: 'fabric.emoji.emojipicker.error',
    defaultMessage: 'Error!',
    description: `Aria label for error icon, apperaed in emoji uploader screens and delete emoji screens of emoji picker`,
  },
});
