// TODO: Remove this eslint-disable when prop names have been renamed.
// This rule is here as prop name changes are a major as they are used
// by our consumers. The prop name concerned here is truncateTitle.
// This can be done in the next lite-mode conversion.
/* eslint-disable @repo/internal/react/boolean-prop-naming-convention */
/** @jsx jsx */

import React from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize as getGridSize } from '@atlaskit/theme/constants';
import { h700 } from '@atlaskit/theme/typography';

const gridSize = getGridSize();

const truncateStyles = css({
  overflowX: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const outerStyles = css({
  margin: `${gridSize * 3}px 0 ${gridSize * 2}px 0`,
});

const styledTitleStyles = css({
  marginTop: 0,
  lineHeight: `${gridSize * 4}px`,
  outline: 'none',
});

const titleWrapperStyles = css({
  display: 'flex',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
});

const titleWrapperTruncateStyles = css({
  flexWrap: 'nowrap',
});

const titleContainerStyles = css({
  minWidth: 0,
  maxWidth: '100%',
  marginBottom: `${gridSize}px`,
  flex: '1 0 auto',
  flexShrink: undefined,
});

const actionStyles = css({
  maxWidth: '100%',
  marginBottom: `${gridSize}px`,
  marginLeft: 'auto',
  paddingLeft: `${gridSize * 4}px`,
  flex: '0 0 auto',
  whiteSpace: 'nowrap',
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '>': {
    textAlign: 'right',
  },
});

const titleContainerTruncateStyles = css({
  flexShrink: 1,
});

const bottomBarStyles = css({
  marginTop: `${gridSize * 2}px`,
});

/**
 * __Outer wrapper__
 *
 * An outer wrapper that is the outermost component of the PageHeader component. It wraps around the PageHeader, its Actions,
 * the BottomBar and its Breadcrumbs.
 *
 */
export const OuterWrapper: React.FC<React.ReactNode> = ({ children }) => {
  return <div css={outerStyles}>{children}</div>;
};

// eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
const h700Styles = css(h700());

interface StyledTitleWrapperProps {
  children?: React.ReactNode;
  id?: string;
  truncateTitle?: boolean;
}

/**
 * __Styled title wrapper__
 *
 * A styled title wrapper is a wrapper around the title that controls its the styles exclusively.
 *
 */
export const StyledTitleWrapper = React.forwardRef<
  HTMLHeadingElement,
  StyledTitleWrapperProps
>(({ children, id, truncateTitle }, ref) => {
  return (
    <h1
      css={[h700Styles, styledTitleStyles, truncateTitle && truncateStyles]}
      ref={ref}
      tabIndex={-1}
      id={id}
    >
      {children}
    </h1>
  );
});

interface TitleProps {
  truncateTitle?: boolean;
}

/**
 * __Title wrapper__
 *
 * A title wrapper is a wrapper around the title and the actions.
 *
 */
export const TitleWrapper: React.FC<TitleProps> = ({
  children,
  truncateTitle,
}) => {
  return (
    <div
      css={[titleWrapperStyles, truncateTitle && titleWrapperTruncateStyles]}
    >
      {children}
    </div>
  );
};

/**
 * Title container
 *
 * A title container is a container that wraps around the title and its styles (if applied).
 *
 */
export const TitleContainer: React.FC<TitleProps> = ({
  children,
  truncateTitle,
}) => {
  return (
    <div
      css={[
        titleContainerStyles,
        truncateTitle && titleContainerTruncateStyles,
      ]}
    >
      {children}
    </div>
  );
};

/**
 * __Actions wrapper__
 *
 * An actions wrapper is a wrapper for the actions, which appear on the top right of the PageHeader component.
 *
 */
export const ActionsWrapper: React.FC = ({ children }) => {
  return <div css={actionStyles}>{children}</div>;
};

/**
 * __Bottom bar wrapper__
 *
 * A bottom bar wrapper is a wrapper for the bottom bar, which appears at the bottom of the PageHeader component.
 *
 */
export const BottomBarWrapper: React.FC = ({ children }) => {
  return <div css={bottomBarStyles}>{children}</div>;
};
