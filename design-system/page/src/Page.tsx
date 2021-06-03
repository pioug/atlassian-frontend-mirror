import React, { Component, ReactNode } from 'react';

import styled, { ThemeProvider } from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
`;

const NavigationAndContent = styled.div`
  display: flex;
  flex: 1 1 auto;
`;

interface BannerContainerProps {
  isBannerOpen?: boolean;
  bannerHeight: number;
}

const BannerContainer = styled.div<BannerContainerProps>`
  flex: 1 0 auto;
  transition: height 0.25s ease-in-out;
  height: ${(props) => (props.isBannerOpen ? props.bannerHeight : 0)}px;
  position: relative;
  width: 100%;
  z-index: 3;
`;

const Banner = styled.div`
  position: fixed;
  width: 100%;
`;

const Navigation = styled.div`
  position: relative;
  z-index: 2;
`;

const PageContent = styled.div`
  flex: 1 1 auto;
  position: relative;
  z-index: 1;
  min-width: 0;
`;

const emptyTheme = {};

interface Props {
  /*
    If you provide the banner or banners you are to use, page will help you
    coordinate the showing and hiding of them in conjunction with `isBannerOpen`.
    This is designed to take [our banner](/packages/design-system/banner) component, and
    matches the animation timing of our banner.

    The only time that two banners should be rendered are when an announcement
    banner is loaded alongside an error or warning banner.
  */
  banner?: ReactNode;
  /*
    Takes our [navigation component](/packages/design-system/navigation) and helps
    position it with consideration to rendered banners.
  */
  navigation?: ReactNode;
  /*
    The contents of the page, to be rendered next to navigation. It will be
    correctly position with relation to both any banner, as well as navigation.
  */
  children?: ReactNode;
  /*
    Sets whether to show or hide the banner. This is responsible for moving the
    page contents down, as well as whether to render the banner component.
  */
  isBannerOpen?: boolean;
  /*
    52 is line height (20) + 4*grid. This is the height of all banners aside
    from the dynamically heighted announcement banner.

    Banner height can be retrieved from banner using its innerRef, which always
    returns its height when expanded even when collapsed.

    In addition to setting the height of the banner's container for dynamically
    heighted banners, you will need to set the `pageOffset` in navigation. Since
    this is a lot to think about, [here](/examples/core/page/navigation-example)
    is an example that implements displaying both an announcement banner and a
    warning banner on a page, while matching the height of each.
  */
  bannerHeight: number;
}

export default class Page extends Component<Props> {
  static displayName = 'AkPage';

  static defaultProps = {
    isBannerOpen: false,
    bannerHeight: 52,
  };

  render() {
    const {
      isBannerOpen,
      banner,
      navigation,
      children,
      bannerHeight,
    } = this.props;

    return (
      <ThemeProvider theme={emptyTheme}>
        <Wrapper>
          {this.props.banner ? (
            <BannerContainer
              aria-hidden={!isBannerOpen}
              isBannerOpen={isBannerOpen}
              bannerHeight={bannerHeight}
            >
              <Banner>{banner}</Banner>
            </BannerContainer>
          ) : null}
          <NavigationAndContent>
            <Navigation>{navigation}</Navigation>
            <PageContent>{children}</PageContent>
          </NavigationAndContent>
        </Wrapper>
      </ThemeProvider>
    );
  }
}
