/** @jsx jsx */
import { forwardRef, Ref } from 'react';

import { jsx } from '@emotion/core';

import { sectionCSS } from '../internal/styles/menu-section/section';
import HeadingItem from '../menu-item/heading-item';
import type { SectionBaseProps, SectionProps } from '../types';

/**
 * __Section__
 *
 * A section includes related actions or items in a menu.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/section)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const Section = forwardRef<HTMLElement, SectionProps>(
  // Type needed on props to extract types with extract react types.
  ({ children, overrides, title, testId, ...rest }: SectionProps, ref) => {
    return title !== undefined ? (
      <SectionBase {...rest} testId={testId} ref={ref} aria-label={title}>
        <HeadingItem
          // eslint-disable-next-line @repo/internal/react/no-unsafe-overrides
          cssFn={
            overrides && overrides.HeadingItem && overrides.HeadingItem.cssFn
          }
          testId={testId && `${testId}--heading`}
          aria-hidden
        >
          {title}
        </HeadingItem>
        {children}
      </SectionBase>
    ) : (
      <SectionBase {...rest} ref={ref}>
        {children}
      </SectionBase>
    );
  },
);

const SectionBase = forwardRef<HTMLElement, SectionBaseProps>(
  // Type needed on props to extract types with extract react types.
  ({ isScrollable, hasSeparator, testId, ...rest }: SectionBaseProps, ref) => (
    <div
      // NOTE: Firefox allows elements that have "overflow: auto" to gain focus (as if it had tab-index="0")
      // We have made a deliberate choice to leave this behaviour as is.
      // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
      css={sectionCSS(isScrollable, hasSeparator)}
      data-testid={testId}
      role="group"
      // this is being used to target CSS selectors
      // where emotion's API was falling a little short.
      data-section
      {...rest}
      ref={ref as Ref<HTMLDivElement>}
    />
  ),
);

export default Section;
