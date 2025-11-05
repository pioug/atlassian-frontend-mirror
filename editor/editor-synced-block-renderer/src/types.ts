import { type RendererProps } from '@atlaskit/renderer';

export type SyncedBlockRendererOptions = Pick<
	RendererProps,
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
	| 'media'
	| 'smartLinks'
	| 'stickyHeaders'
>;
