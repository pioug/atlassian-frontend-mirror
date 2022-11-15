import { SmartLinkSize } from '../../../../../../constants';
import { ActionProps } from '../types';

export type ActionButtonProps = ActionProps & {
  iconAfter?: React.ReactChild;
  iconBefore?: React.ReactChild;
  size: SmartLinkSize;
};
