import type { Space, XCSS } from '@atlaskit/primitives';
import type { SmartLinkSize } from '../../../../../../constants';
import type { ActionProps } from '../types';

export type ActionStackItemProps = ActionProps & {
  isLoading?: boolean;
  size: SmartLinkSize;
  isDisabled?: boolean;
  space?: Space;
  xcss?: XCSS;
};
