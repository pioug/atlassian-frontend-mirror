/** @jsx jsx */
import { forwardRef } from 'react';

import { jsx } from '@emotion/core';

import { N10, N500 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

export interface SideNavigationProps {
  /**
   *  Describes the specific role of this navigation component for users viewing the page with a screen reader.
   *  Differentiates from other navigation components on a page.
   */
  label: string;

  /**
   * Child navigation elements.
   * You'll want to compose children from [navigation header](/packages/navigation/side-navigation/docs/navigation-header),
   * [navigation content](/packages/navigation/side-navigation/docs/navigation-content) or [nestable navigation content](/packages/navigation/side-navigation/docs/nestable-navigation-content),
   * and [navigation footer](/packages/navigation/side-navigation/docs/navigation-footer).
   */
  children: JSX.Element[] | JSX.Element;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

const SideNavigation = forwardRef<HTMLElement, SideNavigationProps>(
  (props: SideNavigationProps, ref) => {
    const { children, testId, label } = props;
    return (
      <nav
        ref={ref}
        data-testid={testId}
        aria-label={label}
        css={{
          width: '100%',
          height: '100%',
          color: token('color.text.mediumEmphasis', N500),
          minWidth: gridSize() * 30,
          backgroundColor: token('color.background.default', N10),
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {children}
      </nav>
    );
  },
);

export default SideNavigation;
