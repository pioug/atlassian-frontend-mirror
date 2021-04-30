import { DiscoverMoreCallback, TriggerXFlowCallback } from '../../types';

export const getIsDiscoverMoreClickable = (
  onDiscoverMoreClicked: DiscoverMoreCallback,
  triggerXFlow: TriggerXFlowCallback,
) =>
  typeof onDiscoverMoreClicked === 'function' &&
  typeof triggerXFlow === 'function';
