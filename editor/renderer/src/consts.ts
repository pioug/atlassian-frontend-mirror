/* eslint-disable @atlaskit/editor/no-re-export */
// Entry file in package.json

const clPrefix = 'ak-renderer-';

export const RendererCssClassName = {
	FLEX_CENTER_WRAPPER: `${clPrefix}flex-center-wrapper`,
	DOCUMENT: `${clPrefix}document`,
	EXTENSION: `${clPrefix}extension`,
	EXTENSION_AS_INLINE: `${clPrefix}extension-as-inline`,
	EXTENSION_CENTER_ALIGN: `${clPrefix}extension-center-align`,
	EXTENSION_OVERFLOW_CONTAINER: `${clPrefix}extension-overflow-container`,
	EXTENSION_INNER_WRAPPER: `${clPrefix}extension-inner-wrapper`,
	/** Wrapper for center-aligned extensions/MBE; margin here so it participates in collapse */
	STICKY_SAFE_CENTER_WRAPPER: `${clPrefix}sticky-safe-center-wrapper`,
	/** Wrapper for center-aligned embed card (wide/full-width); margin here so it participates in collapse */
	EMBED_CARD_CENTER_WRAPPER: `${clPrefix}embed-card-center-wrapper`,
	/** Wrapper for center-aligned block card datasource (wide/full-width); margin here so it participates in collapse */
	BLOCK_CARD_DATASOURCE_CENTER_WRAPPER: `${clPrefix}block-card-datasource-center-wrapper`,
	/** Outer flex wrapper for sticky-safe breakout (has vertical margin); zero margin when first in doc */
	STICKY_SAFE_BREAKOUT_WRAPPER: `${clPrefix}sticky-safe-breakout-wrapper`,
	/** Flex item in sticky-safe breakout; zero first/last child margin so flex container height matches legacy */
	STICKY_SAFE_BREAKOUT_INNER: `${clPrefix}sticky-safe-breakout-inner`,
	NUMBER_COLUMN: `${clPrefix}table-number-column`,
	SORTABLE_COLUMN_WRAPPER: `${clPrefix}tableHeader-sortable-column__wrapper`,
	SORTABLE_COLUMN: `${clPrefix}tableHeader-sortable-column`,
	SORTABLE_COLUMN_ICON_WRAPPER: `${clPrefix}tableHeader-sorting-icon__wrapper`,
	SORTABLE_COLUMN_NO_ORDER: `${clPrefix}tableHeader-sorting-icon__no-order`,
};
