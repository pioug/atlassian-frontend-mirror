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
