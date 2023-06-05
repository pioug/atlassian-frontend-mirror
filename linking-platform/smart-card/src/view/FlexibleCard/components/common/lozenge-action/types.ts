import type { ThemeAppearance } from '@atlaskit/lozenge';
import type { LinkLozengeInvokeActions } from '../../../../../extractors/common/lozenge/types';

export type LozengeItem = {
  appearance?: ThemeAppearance;
  id: string;
  text: string;
};

export type LozengeActionProps = {
  action: LinkLozengeInvokeActions;
  appearance?: ThemeAppearance;
  testId?: string;
  text: string | React.ReactNode;
  zIndex?: number;
};
