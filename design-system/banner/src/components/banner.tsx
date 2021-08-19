/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

import {
  getBackgroundColor,
  getTextColor,
  TRANSITION_DURATION,
} from '../styles';

const iconStyles = css({
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
  flexDirection: 'column',
  '@media screen and (forced-colors: active)': {
    fill: 'CanvasText',
    filter: 'grayscale(100%)',
  },
});

const visibilityStyles = css({
  overflow: 'hidden',
  transition: `max-height ${TRANSITION_DURATION}`,
});

const contentStyles = css({
  display: 'flex',
  margin: 'auto',
  padding: gridSize() * 1.5,
  alignItems: 'center',
  justifyContent: 'center',
  color: 'currentColor',
  fontWeight: 500,
  textAlign: 'center',
  transition: `color ${TRANSITION_DURATION}`,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  'a, a:visited, a:hover, a:focus, a:active': {
    color: 'currentColor',
    textDecoration: 'underline',
  },
});

const cappedWidthStyles = css({
  maxWidth: 876,
});

const childrenTextStyles = css({
  padding: gridSize() / 2,
  flex: '0 1 auto',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const noOverflowStyles = css({
  textOverflow: 'none',
});

const containerStyles = css({
  maxHeight: 52,
  overflow: 'visible',
});

const scrollStyles = css({
  maxHeight: 88,
  overflow: 'scroll',
});

interface BannerProps {
  /**
   * Visual style to be used for the banner
   */
  appearance?: 'warning' | 'error' | 'announcement';
  /**
   * Content to be shown next to the icon. Typically text content but can contain links.
   */
  children?: React.ReactNode;
  /**
   * Icon to be shown left of the main content. Typically an Atlaskit [@atlaskit/icon](packages/design-system/icon)
   */
  icon?: React.ReactChild;
  /**
   * Defines whether the banner is shown. An animation is used when the value is changed.
   */
  isOpen?: boolean;
  /**
   * Returns the inner ref of the component. This is exposed so the height can be used in page.
   */
  innerRef?: (element: HTMLElement) => void;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   */
  testId?: string;
}

class Banner extends React.Component<BannerProps, { height: number }> {
  state = {
    height: 0,
  };

  static defaultProps = {
    appearance: 'warning',
    isOpen: false,
  };

  containerRef?: HTMLElement;

  getHeight = () => {
    if (this.containerRef) {
      this.setState({ height: this.containerRef.clientHeight });
    }
  };

  innerRef = (ref: HTMLElement | null) => {
    if (!ref) {
      return;
    }
    this.containerRef = ref;
    if (this.props.innerRef) {
      this.props.innerRef(ref);
    }
    this.getHeight();
  };

  getA11yProps = (
    appearance?: 'warning' | 'error' | 'announcement',
  ): {
    role: string;
    'aria-hidden': boolean;
    tabIndex?: number;
    'aria-label'?: string;
  } => {
    const { isOpen } = this.props;

    const defaultProps = {
      'aria-hidden': !isOpen,
      role: 'alert',
    };

    if (appearance === 'announcement') {
      return {
        ...defaultProps,
        'aria-label': 'announcement',
        tabIndex: 0,
        role: 'region',
      };
    }
    return defaultProps;
  };

  render() {
    const { appearance, children, icon, isOpen, testId } = this.props;
    const allyProps = this.getA11yProps(appearance);
    const isAnnouncementAppearance = appearance === 'announcement';
    const backgroundColorByAppearance = getBackgroundColor({ appearance });
    const textColorByAppearance = getTextColor({ appearance });

    return (
      <div
        css={visibilityStyles}
        style={{ maxHeight: `${isOpen ? this.state.height : 0}px` }}
      >
        <div
          css={[containerStyles, isAnnouncementAppearance && scrollStyles]}
          style={{
            backgroundColor: backgroundColorByAppearance,
            color: textColorByAppearance,
          }}
          ref={this.innerRef}
          data-testid={testId}
          {...allyProps}
        >
          <div
            css={[contentStyles, isAnnouncementAppearance && cappedWidthStyles]}
          >
            <span
              css={iconStyles}
              style={{
                fill: backgroundColorByAppearance,
              }}
            >
              {icon}
            </span>
            <div
              css={[
                childrenTextStyles,
                isAnnouncementAppearance && noOverflowStyles,
              ]}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Banner;
