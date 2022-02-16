import { BlockProps, ElementItem } from '../types';

export type MetadataBlockProps = BlockProps & {
  maxLines?: number;
  primary?: ElementItem[];
  secondary?: ElementItem[];
};
