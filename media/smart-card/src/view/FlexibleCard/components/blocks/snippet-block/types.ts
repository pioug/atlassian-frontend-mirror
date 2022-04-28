import { BlockProps } from '../types';

export type SnippetBlockProps = BlockProps & {
  /* Determines the maximum lines the text within the snippet block should spread over. Defaults to 3, maximum of 3. */
  maxLines?: number;
};
