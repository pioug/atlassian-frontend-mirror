import { SmartLinkSize } from '../../../../../../constants';
import { ActionProps } from '../types';

export type ActionButtonProps = ActionProps & {
  iconAfter?: React.ReactChild;
  iconBefore?: React.ReactChild;
  isLoading?: boolean;
  size: SmartLinkSize;
  isDisabled?: boolean;
  href?: string;
  ariaLabel?: string;
};
