import { BaseProps } from '../types';

export default function getIsOnlySingleIcon({
  children,
  iconBefore,
  iconAfter,
}: Pick<BaseProps, 'children' | 'iconBefore' | 'iconAfter'>): boolean {
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
