const BLOCK_CONTROLS_SUPPRESSION_ATTRIBUTE = 'data-block-controls-suppression';
const BLOCK_CONTROLS_SUPPRESSION_SELECTOR = `[${BLOCK_CONTROLS_SUPPRESSION_ATTRIBUTE}]`;

/**
 * Marks external control surfaces where editor or renderer block controls must be hidden. This
 * prevents controls such as Remix and comment buttons from appearing underneath Rovo or the object
 * sidebar while those controls are being used.
 */
export const blockControlsSuppressionProps: {
	readonly 'data-block-controls-suppression': 'true';
} = {
	[BLOCK_CONTROLS_SUPPRESSION_ATTRIBUTE]: 'true',
} as const;

export const isBlockControlsSuppressionTarget = (target: EventTarget | null): boolean =>
	target instanceof Element && target.closest(BLOCK_CONTROLS_SUPPRESSION_SELECTOR) !== null;
