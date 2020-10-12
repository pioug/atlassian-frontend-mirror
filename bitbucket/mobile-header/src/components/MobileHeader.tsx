import React, { Fragment, PureComponent, ReactNode } from 'react';

import Button from '@atlaskit/button/custom-theme-button';
import MenuIcon from '@atlaskit/icon/glyph/menu';

import * as styles from '../styled';

interface MobileHeaderProps {
  navigation?: (isOpen: boolean) => ReactNode;
  sidebar?: (isOpen: boolean) => ReactNode;
  onNavigationOpen?: () => void;
  onDrawerClose?: () => void;
  drawerState: 'navigation' | 'sidebar' | 'none' | string;
  secondaryContent?: ReactNode;
  pageHeading: ReactNode;
  menuIconLabel: string;
  customMenu?: ReactNode;
  topOffset?: number;
}

interface MobileHeaderState {
  isAnimatingSidebar: boolean;
  isAnimatingNavigation: boolean;
}

class MobileHeader extends PureComponent<MobileHeaderProps, MobileHeaderState> {
  state = {
    isAnimatingNavigation: false,
    isAnimatingSidebar: false,
  };

  static defaultProps = {
    topOffset: 0,
    pageHeading: '',
    menuIconLabel: 'Menu',
    drawerState: '',
  };

  UNSAFE_componentWillReceiveProps(nextProps: MobileHeaderProps) {
    if (nextProps.drawerState === 'none') {
      if (this.props.drawerState === 'navigation') {
        this.setState({ isAnimatingNavigation: true });
      } else if (this.props.drawerState === 'sidebar') {
        this.setState({ isAnimatingSidebar: true });
      }
    }
  }

  handleNavSlideFinish = () => {
    this.setState({ isAnimatingNavigation: false });
  };

  handleSidebarSlideFinish = () => {
    this.setState({ isAnimatingSidebar: false });
  };

  renderSlider = (
    isOpen: boolean,
    isAnimating: boolean,
    onTransitionEnd:
      | ((event: React.TransitionEvent<HTMLDivElement>) => void)
      | undefined,
    side: string,
    renderFn?: (isOpen: boolean) => ReactNode,
    topOffset?: number,
  ) => (
    <styles.MobileNavSlider
      isOpen={isOpen}
      onTransitionEnd={onTransitionEnd}
      side={side}
      topOffset={topOffset}
    >
      {(isOpen || isAnimating) && renderFn && renderFn(isOpen)}
    </styles.MobileNavSlider>
  );

  render() {
    const { isAnimatingNavigation, isAnimatingSidebar } = this.state;
    const { drawerState, menuIconLabel, customMenu, topOffset } = this.props;
    const isNavigationOpen = drawerState === 'navigation';
    const isSidebarOpen = drawerState === 'sidebar';

    const menu = customMenu || (
      <Button
        appearance="subtle"
        iconBefore={<MenuIcon label={menuIconLabel} size="large" />}
        onClick={this.props.onNavigationOpen}
      />
    );

    return (
      <Fragment>
        <styles.MobilePageHeader>
          <styles.MobilePageHeaderContent topOffset={topOffset}>
            {menu}
            <styles.PageHeading>{this.props.pageHeading}</styles.PageHeading>
            {this.props.secondaryContent}
          </styles.MobilePageHeaderContent>
        </styles.MobilePageHeader>

        {this.renderSlider(
          isNavigationOpen,
          isAnimatingNavigation,
          this.handleNavSlideFinish,
          'left',
          this.props.navigation,
          topOffset,
        )}

        {this.renderSlider(
          isSidebarOpen,
          isAnimatingSidebar,
          this.handleSidebarSlideFinish,
          'right',
          this.props.sidebar,
          topOffset,
        )}

        {(isNavigationOpen ||
          isSidebarOpen ||
          isAnimatingNavigation ||
          isAnimatingSidebar) && (
          <styles.FakeBlanket
            isOpen={isNavigationOpen || isSidebarOpen}
            onClick={this.props.onDrawerClose}
          />
        )}
      </Fragment>
    );
  }
}

export default MobileHeader;
