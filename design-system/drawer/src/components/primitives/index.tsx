/** @jsx jsx */

import { Component, CSSProperties, FC, ReactChildren } from 'react';

import { css, jsx } from '@emotion/core';

import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import { N0 } from '@atlaskit/theme/colors';
import { gridSize, layers } from '@atlaskit/theme/constants';

import { Slide } from '../transitions';
import {
  DrawerPrimitiveDefaults,
  DrawerPrimitiveOverrides,
  DrawerPrimitiveProps,
  DrawerWidth,
  Widths,
} from '../types';
import { createExtender } from '../utils';

import ContentOverrides from './content';
import IconButton from './icon-button';
import SidebarOverrides from './sidebar';

// Misc.
// ------------------------------

const widths: Widths = {
  full: '100vw',
  extended: '95vw',
  narrow: 45 * gridSize(),
  medium: 60 * gridSize(),
  wide: 75 * gridSize(),
};

interface WrapperProps {
  style?: CSSProperties;
  children?: ReactChildren;
  shouldUnmountOnExit?: boolean;
  width: DrawerWidth;
}

const wrapperStyles = css({
  display: 'flex',
  height: '100vh',
  position: 'fixed',
  zIndex: layers.blanket() + 1,
  top: 0,
  left: 0,
  backgroundColor: N0,
  overflow: 'hidden',
});

const Wrapper: FC<WrapperProps> = ({
  width = 'narrow',
  shouldUnmountOnExit,
  style,
  ...props
}) => {
  return (
    <div
      style={{ ...style, width: widths[width] }}
      css={wrapperStyles}
      {...props}
    />
  );
};

const defaults: DrawerPrimitiveDefaults = {
  Sidebar: SidebarOverrides,
  Content: ContentOverrides,
};

export default class DrawerPrimitive extends Component<DrawerPrimitiveProps> {
  render() {
    const {
      children,
      icon: Icon,
      onClose,
      onCloseComplete,
      onOpenComplete,
      overrides,
      testId,
      ...props
    } = this.props;

    const getOverrides = createExtender<
      DrawerPrimitiveDefaults,
      DrawerPrimitiveOverrides
    >(defaults, overrides);

    const { component: Sidebar, ...sideBarOverrides } = getOverrides('Sidebar');
    const { component: Content, ...contentOverrides } = getOverrides('Content');

    return (
      <Slide
        component={Wrapper}
        onExited={onCloseComplete}
        onEntered={onOpenComplete}
        data-testid={testId}
        {...props}
      >
        <Sidebar {...sideBarOverrides}>
          <IconButton
            onClick={onClose}
            testId={testId && 'DrawerPrimitiveSidebarCloseButton'}
          >
            {Icon ? <Icon size="large" /> : <ArrowLeft label="Close drawer" />}
          </IconButton>
        </Sidebar>
        <Content {...contentOverrides}>{children}</Content>
      </Slide>
    );
  }
}
