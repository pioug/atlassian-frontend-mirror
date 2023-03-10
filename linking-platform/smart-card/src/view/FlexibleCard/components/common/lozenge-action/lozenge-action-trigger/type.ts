import type { ThemeAppearance } from '@atlaskit/lozenge';
import type { CustomTriggerProps } from '@atlaskit/dropdown-menu';

export type LozengeActionTriggerProps = {
  appearance?: ThemeAppearance;
  testId?: string;
  text: string;
} & CustomTriggerProps<HTMLButtonElement>;
