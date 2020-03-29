/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import { WithRootTheme } from '../../theme/util';
import ContainerHeader from './ContainerHeader';
import ContainerNavigationChildren from './ContainerNavigationChildren';
import DefaultLinkComponent from './DefaultLinkComponent';
import GlobalPrimaryActions from './GlobalPrimaryActions';
import GlobalSecondaryActions from './GlobalSecondaryActions';
import Reveal from './Reveal';
import ContainerNavigationInner from '../styled/ContainerNavigationInner';
import GlobalNavigationSecondaryContainer from '../styled/GlobalNavigationSecondaryContainer';
import {
  globalPrimaryActions as globalPrimaryActionsSizes,
  globalSecondaryActions as globalSecondaryActionsSizes,
} from '../../shared-variables';
import { container } from '../../theme/presets';

export default class ContainerNavigation extends Component {
  static defaultProps = {
    showGlobalActions: false,
    globalSecondaryActions: [],
    isCollapsed: false,
    linkComponent: DefaultLinkComponent,
    theme: container,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isInitiallyRendered: false,
    };
  }

  UNSAFE_componentWillReceiveProps() {
    // After any update we are going to start animating.
    // Not doing this in componentDidMount to prevent an
    // unneeded second render on mount.
    if (!this.state.isInitiallyRendered) {
      this.setState({
        isInitiallyRendered: true,
      });
    }
  }

  render() {
    const {
      scrollRef,
      showGlobalActions,
      globalPrimaryActions,
      globalSecondaryActions,
      children,
      globalCreateIcon,
      globalPrimaryIcon,
      globalPrimaryItemHref,
      globalSearchIcon,
      hasScrollHintTop,
      headerComponent,
      linkComponent,
      onGlobalCreateActivate,
      onGlobalSearchActivate,
      isCollapsed,
      theme,
    } = this.props;

    // Only animating the revealing of GlobalPrimaryActions and GlobalSecondaryActions
    // after the first render. Before that it is rendered without animation.
    const { isInitiallyRendered } = this.state;

    return (
      <WithRootTheme provided={theme} isCollapsed={isCollapsed}>
        {/* This div is needed for legacy reasons.
        All children should use isCollapsed on the theme */}
        <ContainerNavigationInner>
          <Reveal
            shouldAnimate={isInitiallyRendered}
            isOpen={showGlobalActions}
            openHeight={
              globalPrimaryActionsSizes.height(
                globalPrimaryActions
                  ? React.Children.count(globalPrimaryActions)
                  : 2,
              ).outer
            }
          >
            <GlobalPrimaryActions
              actions={globalPrimaryActions}
              createIcon={globalCreateIcon}
              linkComponent={linkComponent}
              onCreateActivate={onGlobalCreateActivate}
              onSearchActivate={onGlobalSearchActivate}
              primaryIcon={globalPrimaryIcon}
              primaryItemHref={globalPrimaryItemHref}
              searchIcon={globalSearchIcon}
            />
          </Reveal>
          <ContainerHeader>
            {headerComponent ? headerComponent({ isCollapsed }) : undefined}
          </ContainerHeader>
          <ContainerNavigationChildren
            hasScrollHintTop={hasScrollHintTop}
            scrollRef={scrollRef}
          >
            {children}
          </ContainerNavigationChildren>
          <GlobalNavigationSecondaryContainer>
            <Reveal
              shouldAnimate={isInitiallyRendered}
              isOpen={showGlobalActions}
              openHeight={
                globalSecondaryActionsSizes.height(
                  React.Children.count(globalSecondaryActions),
                ).outer
              }
            >
              {showGlobalActions && globalSecondaryActions.length ? (
                <GlobalSecondaryActions actions={globalSecondaryActions} />
              ) : null}
            </Reveal>
          </GlobalNavigationSecondaryContainer>
        </ContainerNavigationInner>
      </WithRootTheme>
    );
  }
}
