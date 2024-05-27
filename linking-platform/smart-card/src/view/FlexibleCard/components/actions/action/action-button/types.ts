import { type SmartLinkSize } from '../../../../../../constants';
import { type ActionProps } from '../types';

export type ActionButtonProps = ActionProps & {
  iconAfter?: React.ReactChild;
  iconBefore?: React.ReactChild;
  isLoading?: boolean;
  size: SmartLinkSize;
  isDisabled?: boolean;
  href?: string;
  ariaLabel?: string;
};
