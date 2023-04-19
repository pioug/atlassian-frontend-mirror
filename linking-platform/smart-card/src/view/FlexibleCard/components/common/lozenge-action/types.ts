import type { ThemeAppearance } from '@atlaskit/lozenge';
import type { InvokeActions } from '../../../../../state/hooks/use-invoke/types';

export type LozengeItem = {
  appearance?: ThemeAppearance;
  id: string;
  text: string;
};

export type LozengeActionProps = {
  action?: InvokeActions;
  appearance?: ThemeAppearance;
  testId?: string;
  text: string | React.ReactNode;
};
