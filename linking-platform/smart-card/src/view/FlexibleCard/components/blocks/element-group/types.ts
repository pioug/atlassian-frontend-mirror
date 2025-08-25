import { type PropsWithChildren } from 'react';

import {
	type SmartLinkAlignment,
	type SmartLinkDirection,
	type SmartLinkPosition,
	type SmartLinkSize,
	type SmartLinkWidth,
} from '../../../../../constants';

export type ElementGroupProps = PropsWithChildren<{
	/**
	 * Determines the alignment of the Elements within. Can be left or right aligned.
	 */
	align?: SmartLinkAlignment;
	/**
	 * For compiled css
	 */
	className?: string;
	/**
	 * Determines the direction that the Elements are rendered. Can be Vertical or Horizontal.
	 */
	direction?: SmartLinkDirection;
	/**
	 * Determines the position of the elements within. Can be top or center position.
	 */
	position?: SmartLinkPosition;
	/**
	 * Determines the default size of the Elements in the group.
	 */
	size?: SmartLinkSize;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid`
	 * in the rendered code, serving as a hook for automated tests
	 */
	testId?: string;
	/**
	 * Determines whether the container size will fit to the content or expand to the available width or the parent component.
	 * Similar to flex's flex-grow concept.
	 */
	width?: SmartLinkWidth;
}>;
