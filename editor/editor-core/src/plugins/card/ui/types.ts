import { CardAppearance } from '@atlaskit/editor-common/provider-factory';

import { Command } from '../../../types';

export interface OptionConfig {
  appearance?: CardAppearance;
  title: string;
  onClick: Command;
  selected: boolean;
  testId: string;
  disabled?: boolean;
  hidden?: boolean;
  tooltip?: string;
}
