import { defineMessages } from 'react-intl-next';
export const mediaEditingMessages = defineMessages({
	aspectRatioSelectionOriginal: {
		id: 'editor.imageEditor.aspectRatio.original',
		defaultMessage: 'Original',
		description: 'Display this message when user selects original as their cropper aspect ratio',
	},
	aspectRatioSelectionCustom: {
		id: 'editor.imageEditor.aspectRatio.custom',
		defaultMessage: 'Custom',
		description: 'Display this message when user selects custom as their cropper aspect ratio',
	},
	aspectRatioSelectionSquare: {
		id: 'editor.imageEditor.aspectRatio.square',
		defaultMessage: 'Square',
		description: 'Display this message when user selects square as their cropper aspect ratio',
	},
	aspectRatioSelectionCircle: {
		id: 'editor.imageEditor.aspectRatio.circle',
		defaultMessage: 'Circle',
		description: 'Display this message when user selects circle as their cropper aspect ratio',
	},
	aspectRatioSelectionLandscape: {
		id: 'editor.imageEditor.aspectRatio.landscape',
		defaultMessage: 'Landscape',
		description: 'Display this message when user selects landscape as their cropper aspect ratio',
	},
	aspectRatioSelectionPortrait: {
		id: 'editor.imageEditor.aspectRatio.portrait',
		defaultMessage: 'Portrait',
		description: 'Display this message when user selects portrait as their cropper aspect ratio',
	},
	aspectRatioSelectionWide: {
		id: 'editor.imageEditor.aspectRatio.wide',
		defaultMessage: 'Wide',
		description: 'Display this message when user selects wide as their cropper aspect ratio',
	},
	squareButton: {
		id: 'editor.imageEditor.aspectRatio.squareButton',
		defaultMessage: 'Square 1:1',
		description:
			'Label shown on a button in the image editor aspect ratio selector when the user selects a square 1:1 crop ratio',
	},
	circleButton: {
		id: 'editor.imageEditor.aspectRatio.circleButton',
		defaultMessage: 'Circle 1:1',
		description:
			'Label shown on a button in the image editor aspect ratio selector when the user selects a circle 1:1 crop ratio',
	},
	landscapeButton: {
		id: 'editor.imageEditor.aspectRatio.landscapeButton',
		defaultMessage: 'Landscape 4:3',
		description:
			'Label shown on a button in the image editor aspect ratio selector when the user selects a landscape 4:3 crop ratio',
	},
	portraitButton: {
		id: 'editor.imageEditor.aspectRatio.portraitButton',
		defaultMessage: 'Portrait 3:4',
		description:
			'Label shown on a button in the image editor aspect ratio selector when the user selects a portrait 3:4 crop ratio',
	},
	wideButton: {
		id: 'editor.imageEditor.aspectRatio.wideButton',
		defaultMessage: 'Wide 16:9',
		description:
			'Label shown on a button in the image editor aspect ratio selector when the user selects a wide 16:9 crop ratio',
	},
	cancelButton: {
		id: 'editor.imageEditor.cancel',
		defaultMessage: 'Cancel',
		description:
			'Label shown on a button in the image editor that allows the user to cancel the current editing operation and discard changes',
	},
	doneButton: {
		id: 'editor.imageEditor.done',
		defaultMessage: 'Done',
		description:
			'Label shown on a button in the image editor that allows the user to confirm and apply the current editing changes',
	},
	savingButton: {
		id: 'editor.imageEditor.saving',
		defaultMessage: 'Saving...',
		description: 'Saving button display when upload is in progress',
	},
});
