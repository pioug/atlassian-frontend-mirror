import type { ThemeAppearance } from '@atlaskit/lozenge';
import type { InvokeAction } from '../../../../../state/hooks/use-invoke/types';

export type LozengeItem = {
  appearance?: ThemeAppearance;
  text: string;
};

export type LozengeActionProps = {
  action?: InvokeAction;
  appearance?: ThemeAppearance;
  testId?: string;
  text: string;
};
