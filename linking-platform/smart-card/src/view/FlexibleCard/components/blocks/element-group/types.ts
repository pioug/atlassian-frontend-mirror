import { type PropsWithChildren } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type SerializedStyles } from '@emotion/react';

import {
	type SmartLinkAlignment,
	type SmartLinkDirection,
	type SmartLinkPosition,
	type SmartLinkSize,
	type SmartLinkWidth,
} from '../../../../../constants';

export type ElementGroupProps = PropsWithChildren<{
	/* Determines the alignment of the Elements within. Can be left or right aligned. */
	align?: SmartLinkAlignment;
	/* Determines the direction that the Elements are rendered. Can be Vertical or Horizontal. */
	direction?: SmartLinkDirection;
	/* Additional CSS properties on the Element Group. */
	overrideCss?: SerializedStyles;
	/* Determines the default size of the Elements in the group. */
	size?: SmartLinkSize;
	/* Determines whether the container size will fit to the content or expand to the available width or the parent component. Similar to flex's flex-grow concept. */
	width?: SmartLinkWidth;
	/* A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
	testId?: string;
	/* Determines the position of the elements within. Can be top or center position. */
	position?: SmartLinkPosition;
}>;
