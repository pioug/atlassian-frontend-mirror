import { defineMessages } from 'react-intl';

export const mediaResizeAnnouncerMessMessages: {
	MediaWidthIsMax: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	MediaWidthIsMin: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	DefaultMediaWidthIncreased: {
		id: string;
		defaultMessage: string;
		description: string;
	};
	DefaultMediaWidthDecreased: {
		id: string;
		defaultMessage: string;
		description: string;
	};
} = defineMessages({
	MediaWidthIsMax: {
		id: 'fabric.editor.media.pixelEntry.MediaWidthIsMax',
		defaultMessage: 'Media increased to the maximum size',
		description:
			'Assistive announcement text read by screen readers when the user resizes a media item and it reaches the maximum allowed size.',
	},
	MediaWidthIsMin: {
		id: 'fabric.editor.media.MediaWidthIsMin',
		defaultMessage: 'Media decreased to the minimum size',
		description:
			'Assistive announcement text read by screen readers when the user resizes a media item and it reaches the minimum allowed size.',
	},
	DefaultMediaWidthIncreased: {
		id: 'fabric.editor.media.DefaultMediaWidthIncreased',
		defaultMessage:
			'{newMediaWidth, plural, one {Media width increased to # pixel.} other {Media width increased to # pixels.}}',
		description: 'Media width increased to {newMediaWidth} pixels.',
	},
	DefaultMediaWidthDecreased: {
		id: 'fabric.editor.media.DefaultMediaWidthDecreased',
		defaultMessage:
			'{newMediaWidth, plural, one {Media width decreased to # pixel.} other {Media width decreased to # pixels.}}',
		description: 'Media width decreased to {newMediaWidth} pixels.',
	},
});
