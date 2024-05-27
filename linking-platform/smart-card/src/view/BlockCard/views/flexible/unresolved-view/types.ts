import { type PropsWithChildren } from 'react';
import type { ActionItem } from '../../../../FlexibleCard/components/blocks/types';
import type { FlexibleBlockCardProps } from '../types';

export type UnresolvedViewProps = PropsWithChildren<
  FlexibleBlockCardProps & {
    actions?: ActionItem[];
    showPreview?: boolean;
    title?: string;
  }
>;
