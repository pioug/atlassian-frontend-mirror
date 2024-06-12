import React, { forwardRef } from 'react';

import { Section as MenuSection } from '@atlaskit/menu';

import { sectionHeaderSpacingStyles } from '../../common/styles';
import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export interface SectionProps {
	/**
	 * The children of the section.
	 * These should generally be item or heading components.
	 */
	children: React.ReactNode;

	/**
	 * The text passed to heading.
	 * If you don't provide a title, then the heading won't be rendered.
	 */
	title?: string;

	/**
	 * This will render a border at the top of the section.
	 */
	hasSeparator?: boolean;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * Adds `<ul>` and `<li>` tags around the items for better semantic markup in a list of items.
	 *
	 */
	isList?: boolean;
}

// Type needed on props to extract types with extract react types.
/**
 * __Section__
 *
 * Used to separate items into sections. Using the title prop makes a section
 * implicitly group the items for screen readers with no additional work required.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#section)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const Section = forwardRef<HTMLElement, SectionProps>((props: SectionProps, ref) => {
	const { shouldRender } = useShouldNestedElementRender();
	if (!shouldRender) {
		return props.children as JSX.Element;
	}

	return (
		<MenuSection
			{...props}
			ref={ref}
			// eslint-disable-next-line @atlaskit/design-system/no-deprecated-apis, @repo/internal/react/no-unsafe-overrides
			overrides={{ HeadingItem: { cssFn: sectionHeaderSpacingStyles } }}
		/>
	);
});

export default Section;
