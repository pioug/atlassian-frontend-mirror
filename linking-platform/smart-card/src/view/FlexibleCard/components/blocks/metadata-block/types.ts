import { BlockProps, ElementItem } from '../types';

export type MetadataBlockProps = {
  /**
   * Determines the number of lines the metadata should span across.
   * Default is 2. Maximum is 2.
   */
  maxLines?: number;

  /**
   * An array of metadata elements to display on the left.
   * By default elements will be shown to the right of the TitleBlock.
   * The visibility of the element is determine by the link data.
   * If link contain no data to display a particular element, the element
   * will simply not show up.
   * @see ElementItem
   */
  primary?: ElementItem[];

  /**
   * An array of metadata elements to display on the right.
   * By default elements will be shown to the right of the TitleBlock.
   * The visibility of the element is determine by the link data.
   * If link contain no data to display a particular element, the element
   * will simply not show up.
   * @see ElementItem
   */
  secondary?: ElementItem[];
} & BlockProps;
