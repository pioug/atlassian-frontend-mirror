import type { Appearance, Spacing } from '../../variants/types';

export type SplitButtonAppearance = Extract<
  Appearance,
  'default' | 'primary' | 'danger' | 'warning'
>;

export type SplitButtonContextAppearance = SplitButtonAppearance | 'navigation';

export type SplitButtonSpacing = Extract<Spacing, 'default' | 'compact'>;
