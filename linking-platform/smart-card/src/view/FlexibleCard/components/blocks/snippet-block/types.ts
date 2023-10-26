import { BlockProps } from '../types';

export type SnippetBlockProps = {
  /**
   * Determines the maximum lines the text within the snippet block should
   * spread over. Default is 3. Maximum is 3.
   */
  maxLines?: number;

  /**
   * The text to display. Overrides the default link description.
   */
  text?: string;
} & BlockProps;
