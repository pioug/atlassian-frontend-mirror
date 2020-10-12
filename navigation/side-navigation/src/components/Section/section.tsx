import React, { forwardRef } from 'react';

import { Section as MenuSection } from '@atlaskit/menu';

import { sectionHeaderStyle } from '../../common/styles';
import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export interface SectionProps {
  /**
   * Children of the section,
   * should generally be item or heading components.
   */
  children: React.ReactNode;

  /**
   * The text passed to heading.
   * If a title is not provided no heading will be rendered.
   */
  title?: string;

  /**
   * Will render a border at the top of the section.
   */
  hasSeparator?: boolean;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

// Type needed on props to extract types with extract react types.
const Section = forwardRef<HTMLElement, SectionProps>(
  (props: SectionProps, ref) => {
    const { shouldRender } = useShouldNestedElementRender();
    if (!shouldRender) {
      return props.children as JSX.Element;
    }

    return (
      <MenuSection
        {...props}
        ref={ref}
        overrides={{ HeadingItem: { cssFn: sectionHeaderStyle } }}
      />
    );
  },
);

export default Section;
