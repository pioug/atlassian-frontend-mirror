import { hideControlsClassName } from '../classNames';

export const getControlsWrapperClassName = (wasPlayedOnce: boolean) =>
  !wasPlayedOnce ? '' : hideControlsClassName;
