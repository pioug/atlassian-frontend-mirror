import { type ElementName, type SmartLinkSize } from '../../../../constants';

export type ElementProps = {
	/**
	 * Name of the element, can be used as a selector.
	 * E.g. [data-smart-element="Provider"]
	 * @internal
	 */
	name?: ElementName;

	/**
	 * For compiled css
	 */
	className?: string;

	/**
	 * The size of the element to display.
	 */
	size?: SmartLinkSize;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique
	 * string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests
	 */
	testId?: string;
};
