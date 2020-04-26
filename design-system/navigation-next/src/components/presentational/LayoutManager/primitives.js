import React from 'react';

import { layers } from '@atlaskit/theme/constants';

export const LayoutContainer = ({ topOffset = 0, ...props }) => {
  return (
    <div
      // Used as a CSS selector in Confluence
      // https://ecosystem.atlassian.net/browse/DS-7189
      data-layout-container
      css={{
        display: 'flex',
        flexDirection: 'row',
        height: `calc(100vh - ${topOffset}px)`,
        marginTop: `${topOffset}px`,
      }}
      {...props}
    />
  );
};

export const HorizontalNavigationContainer = ({ children, topOffset }) => (
  <div
    css={{
      position: 'fixed',
      top: topOffset,
      left: 0,
      right: 0,
      zIndex: layers.navigation() + 1,
    }}
  >
    {children}
  </div>
);

export const NavigationContainer = ({ topOffset, innerRef, ...props }) => (
  <div
    ref={innerRef}
    css={{
      bottom: 0,
      left: 0,
      position: 'fixed',
      top: topOffset,
      zIndex: layers.navigation(),
      '&:hover .ak-navigation-resize-button': {
        opacity: 1,
      },
    }}
    {...props}
  />
);
