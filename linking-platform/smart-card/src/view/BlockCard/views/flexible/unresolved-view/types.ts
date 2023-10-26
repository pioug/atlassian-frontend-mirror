import type { ActionItem } from '../../../../FlexibleCard/components/blocks/types';
import type { FlexibleBlockCardProps } from '../types';

export type UnresolvedViewProps = FlexibleBlockCardProps & {
  actions?: ActionItem[];
  showPreview?: boolean;
  title?: string;
};
