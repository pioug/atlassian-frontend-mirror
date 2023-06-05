import type { ThemeAppearance } from '@atlaskit/lozenge';
import type { CustomTriggerProps } from '@atlaskit/dropdown-menu';

export type LozengeActionTriggerProps = {
  appearance?: ThemeAppearance;
  showFeatureDiscovery?: boolean;
  testId?: string;
  text: string | React.ReactNode;
} & CustomTriggerProps<HTMLButtonElement>;
