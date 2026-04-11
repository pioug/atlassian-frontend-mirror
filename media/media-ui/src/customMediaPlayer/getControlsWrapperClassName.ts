import { hideControlsClassName } from '../classNames';

export const getControlsWrapperClassName = (wasPlayedOnce: boolean): '' | 'mvng-hide-controls' =>
	!wasPlayedOnce ? '' : hideControlsClassName;
