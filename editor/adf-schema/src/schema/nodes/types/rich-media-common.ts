export type Layout =
  | 'wrap-right'
  | 'center'
  | 'wrap-left'
  | 'wide'
  | 'full-width'
  | 'align-end'
  | 'align-start';

export interface RichMediaAttributes {
  /**
   * @minimum 0
   * @maximum 100
   */
  width?: number;
  layout: Layout;
}

export interface OptionalRichMediaAttributes {
  width?: number;
  layout?: Layout;
}
interface DefaultMediaAttributes extends RichMediaAttributes {
  /**
   * @stage 0
   * @description optional widthType attribute for media with percentage layout
   */
  widthType?: 'percentage';
}

/**
 * @stage 0
 * @description The widthType attribute is used to support fixed with media single
 */
interface FixedLayoutMediaAttributes {
  /**
   * @minimum 0
   */
  width: number;
  widthType: 'pixel';
  layout: Layout;
}

export enum WidthType {
  PIXEL = 'pixel',
  PERCENTAGE = 'percentage',
}

export type ExtendedMediaAttributes =
  | DefaultMediaAttributes
  | FixedLayoutMediaAttributes;
