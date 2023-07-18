export type MediaSingleWidthType = 'pixel' | 'percentage';

export type MediaSingleSize = {
  /**
   * The width attribute from mediaSingle node
   */
  width?: number;
  /**
   * The widthType attribute from mediaSingle node
   * @default percentage
   */
  widthType?: MediaSingleWidthType;
};
