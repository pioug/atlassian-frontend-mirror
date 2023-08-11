import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { BaseProps } from '../types';

import { getIfVisuallyHiddenChildren } from './get-if-visually-hidden-children';

export default function getIsOnlySingleIcon({
  children,
  iconBefore,
  iconAfter,
}: Pick<BaseProps, 'children' | 'iconBefore' | 'iconAfter'>): boolean {
  if (
    getBooleanFF('platform.design-system-team.icon-button-spacing-fix_o1zc5') &&
    getIfVisuallyHiddenChildren(children)
  ) {
    return true;
  }
  if (children) {
    return false;
  }
  if (iconBefore && !iconAfter) {
    return true;
  }
  if (!iconBefore && iconAfter) {
    return true;
  }
  return false;
}
