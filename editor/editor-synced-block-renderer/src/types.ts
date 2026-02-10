import { type RendererProps } from '@atlaskit/renderer';

export type SyncedBlockRendererOptions = Pick<
	RendererProps,
	| 'appearance'
	| 'allowAltTextOnImages'
	| 'allowAnnotations'
	| 'allowColumnSorting'
	| 'allowCopyToClipboard'
	| 'allowCustomPanels'
	| 'allowHeadingAnchorLinks'
	| 'allowPlaceholderText'
	| 'allowRendererContainerStyles'
	| 'allowSelectAllTrap'
	| 'allowUgcScrubber'
	| 'allowWrapCodeBlock'
	| 'emojiResourceConfig'
	| 'eventHandlers'
	| 'media'
	| 'smartLinks'
	| 'stickyHeaders'
>;
