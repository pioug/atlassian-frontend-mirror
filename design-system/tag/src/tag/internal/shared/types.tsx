import { type ComponentType, type ReactNode } from 'react';

import { type AppearanceType, type TagColor } from '../../../types';

export interface SimpleTagProps {
	/**
	 * Set whether tags are rounded.
	 */
	appearance?: AppearanceType;
	/**
	 * The color theme to apply. This sets both the background and text color.
	 */
	color?: TagColor;
	/**
	 * The component to be rendered before the tag.
	 */
	elemBefore?: ReactNode;
	/**
	 * Text to be displayed in the tag.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	text: string;
	/**
	 * URI or path. If provided, the tag will be a link.
	 */
	href?: string;
	/* A link component to be used instead of our standard anchor. The styling of
  our link item will be applied to the link that is passed in. */
	linkComponent?: ComponentType<any>;

	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}
