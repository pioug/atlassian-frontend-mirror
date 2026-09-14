export type Layout =
	| 'wrap-right'
	| 'center'
	| 'wrap-left'
	| 'wide'
	| 'full-width'
	| 'align-end'
	| 'align-start';

export interface RichMediaAttributes {
	layout: Layout;
	localId?: string;
	/**
	 * @minimum 0
	 * @maximum 100
	 */
	width?: number;
}

export interface OptionalRichMediaAttributes {
	layout?: Layout;
	width?: number;
}
interface DefaultMediaAttributes extends RichMediaAttributes {
	/**
	 * @description optional widthType attribute for media with percentage layout
	 */
	widthType?: 'percentage';
}

/**
 * @description The widthType attribute is used to support fixed with media single
 */
interface FixedLayoutMediaAttributes {
	layout: Layout;
	/**
	 * @minimum 0
	 */
	width: number;
	widthType: 'pixel';
}

export enum WidthType {
	PIXEL = 'pixel',
	PERCENTAGE = 'percentage',
}

export type ExtendedMediaAttributes = DefaultMediaAttributes | FixedLayoutMediaAttributes;

// Public API aliases preserved from an eliminated entry-point (volt-migrate-package).
export { type Layout as RichMediaLayout };
