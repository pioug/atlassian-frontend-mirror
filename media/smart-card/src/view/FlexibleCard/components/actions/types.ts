import { SmartLinkSize } from '../../../../constants';
import { Appearance } from '@atlaskit/button/types';

export type ActionProps = {
  size?: SmartLinkSize;
  testId?: string;
  content?: React.ReactNode;
  appearance?: Appearance;
  onClick: () => any;
};
