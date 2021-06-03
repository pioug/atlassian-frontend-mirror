import React, { Fragment } from 'react';

import { css, keyframes } from '@emotion/core';

import { N70A } from '@atlaskit/theme/colors';

import {
  transitionDuration,
  transitionTimingFunction,
} from '../../../common/constants';
import { applyDisabledProperties } from '../../../common/helpers';
import { light, ThemeProvider, withContentTheme } from '../../../theme';

/**
 * Component tree structure
 *  - ProductNavigation
 *  - ContainerNavigation
 *    - ContainerOverlay
 */

export const ScrollProviderRef = React.createContext();
const ScrollProvider = ({ isVisible, ...props }) => {
  const scrollProviderRef = React.createRef();

  return (
    <ScrollProviderRef.Provider value={scrollProviderRef}>
      <div
        css={{
          boxSizing: 'border-box',
          display: isVisible ? 'flex' : 'none',
          flexDirection: 'column',
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          width: '100%',
        }}
        tabIndex={-1}
        role="group"
        ref={scrollProviderRef}
        {...props}
      />
    </ScrollProviderRef.Provider>
  );
};

/**
 * ProductNavigation
 */
const ProductNavigationPrimitiveBase = ({
  children,
  isVisible,
  theme = { mode: light, context: 'product' },
}) => (
  <div
    css={{
      ...theme.mode.contentNav().product,
      '&:not(:only-child)': {
        // Setting z-index ensures ScrollHints stay below the container nav
        // &:not(:only-child) sets it only when both container and product
        // nav are rendered.
        zIndex: -1,
      },
    }}
  >
    <ScrollProvider isVisible={isVisible}>{children}</ScrollProvider>
  </div>
);

const ProductNavigationPrimitive = withContentTheme(
  ProductNavigationPrimitiveBase,
);

export const ProductNavigationTheme = ({ children }) => (
  <ThemeProvider
    theme={(oldTheme) => ({ mode: light, ...oldTheme, context: 'product' })}
  >
    <Fragment>{children}</Fragment>
  </ThemeProvider>
);

export const ProductNavigation = (props) => (
  <ProductNavigationTheme>
    <ProductNavigationPrimitive {...props} />
  </ProductNavigationTheme>
);

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

/**
 * ContainerNavigation
 */
const ContainerNavigationPrimitiveBase = ({
  children,
  isEntering,
  isExiting,
  theme,
  isVisible,
}) => {
  let animationName;
  if (isEntering) animationName = slideIn;

  const transform = isExiting ? 'translateX(100%)' : null;

  return (
    <div
      css={css`
        ${{
          ...theme.mode.contentNav().container,
          animationDuration: transitionDuration,
          animationFillMode: 'forwards',
          animationTimingFunction: transitionTimingFunction,
          transitionProperty: 'boxShadow, transform',
          transitionDuration,
          transitionTimingFunction,
          transform,
        }}
        animation-name: ${animationName};
      `}
    >
      <ScrollProvider isVisible={isVisible}>{children}</ScrollProvider>
    </div>
  );
};

const ContainerNavigationPrimitive = withContentTheme(
  ContainerNavigationPrimitiveBase,
);

export const ContainerNavigationTheme = ({ children }) => (
  <ThemeProvider theme={{ mode: light, context: 'container' }}>
    <Fragment>{children}</Fragment>
  </ThemeProvider>
);

export const ContainerNavigation = (props) => (
  <ContainerNavigationTheme>
    <ContainerNavigationPrimitive {...props} />
  </ContainerNavigationTheme>
);

/**
 * ContainerOverlay
 */

export const ContainerOverlay = ({ isVisible, onClick, ...props }) => (
  <div
    css={{
      backgroundColor: N70A,
      cursor: isVisible ? 'pointer' : 'default',
      height: '100%',
      left: 0,
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'all' : 'none',
      position: 'absolute',
      top: 0,
      transitionDuration,
      transitionProperty: 'opacity',
      transitionTimingFunction,
      width: '100%',
      zIndex: 5,
    }}
    onClick={onClick}
    role="presentation"
    {...props}
  />
);

export const ContentNavigationWrapper = ({
  innerRef,
  disableInteraction,
  ...props
}) => (
  <div
    ref={innerRef}
    css={{
      height: '100%',
      position: 'relative',
      ...applyDisabledProperties(!!disableInteraction),
    }}
    {...props}
  />
);

export const ContainerNavigationMask = ({ disableInteraction, ...props }) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
      height: '100%',
      ...applyDisabledProperties(!!disableInteraction),
    }}
    {...props}
  />
);
