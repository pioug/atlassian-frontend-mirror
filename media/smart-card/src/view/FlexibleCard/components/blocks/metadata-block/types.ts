import { BlockProps, ElementItem } from '../types';

export type MetadataBlockProps = BlockProps & {
  /* Determines the number of lines the metadata should spread over. Maximum of 2. */
  maxLines?: number;
  /* An array of metadata that should render to the before (right) the center. */
  primary?: ElementItem[];
  /* An array of metadata that should render to the after (left) the center. */
  secondary?: ElementItem[];
};
