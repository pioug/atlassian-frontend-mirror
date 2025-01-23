// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type SerializedStyles } from '@emotion/react';

import { type ElementName, type SmartLinkSize } from '../../../../constants';

export type ElementProps = {
	/**
	 * Name of the element, can be used as a selector.
	 * E.g. [data-smart-element="Provider"]
	 * @internal
	 */
	name?: ElementName;

	/**
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-24430 Internal documentation for deprecation (no external access)}
	 * use css with compiled instead
	 * Any additional CSS properties to apply to the element.
	 */
	overrideCss?: SerializedStyles;

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
