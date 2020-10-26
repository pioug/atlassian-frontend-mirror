import React, { Component, Fragment } from 'react';

import Banner from '@atlaskit/banner';
import Button from '@atlaskit/button/standard-button';
import { AtlassianIcon } from '@atlaskit/logo';
import Navigation, { AkNavigationItem } from '@atlaskit/navigation';

import Page, { Grid } from '../src';

interface State {
  isErrorBannerOpen: boolean;
  isAnnouncementBannerOpen: boolean;
  navigationWidth?: number;
  isNavigationOpen?: boolean;
}

const Wrapper = (props: any) => (
  <div style={{ padding: '4px', display: 'block' }} {...props} />
);

export default class NavigationExample extends Component<void, State> {
  errorBannerRef?: HTMLElement;

  announcementBannerRef?: HTMLElement;

  state = {
    isErrorBannerOpen: false,
    isAnnouncementBannerOpen: false,
    navigationWidth: 0,
    isNavigationOpen: false,
  };

  getOffset = () => {
    const { isErrorBannerOpen, isAnnouncementBannerOpen } = this.state;

    const errorBannerHeight = this.errorBannerRef
      ? this.errorBannerRef.clientHeight
      : 0;
    const announcementBannerHeight = this.announcementBannerRef
      ? this.announcementBannerRef.clientHeight
      : 0;

    let offset = 0;
    if (isErrorBannerOpen) {
      offset += errorBannerHeight;
    }
    if (isAnnouncementBannerOpen) {
      offset += announcementBannerHeight;
    }
    return offset;
  };

  onErrorBannerChange = () =>
    this.setState({
      isErrorBannerOpen: !this.state.isErrorBannerOpen,
    });

  onAnnouncementBannerChange = () =>
    this.setState({
      isAnnouncementBannerOpen: !this.state.isAnnouncementBannerOpen,
    });

  render() {
    const { isErrorBannerOpen, isAnnouncementBannerOpen } = this.state;

    return (
      /* This wrapping div exists to help this example display nicely on the
      atlaskit website. It probably shouldn't be in code otherwise. */
      <div>
        <Page
          isBannerOpen={isErrorBannerOpen || isAnnouncementBannerOpen}
          bannerHeight={this.getOffset()}
          banner={
            <Fragment>
              <Banner
                appearance="error"
                isOpen={isErrorBannerOpen}
                innerRef={(ref: HTMLElement) => {
                  this.errorBannerRef = ref;
                }}
              >
                Example Banner
              </Banner>
              <Banner
                appearance="announcement"
                isOpen={isAnnouncementBannerOpen}
                innerRef={(ref: HTMLElement) => {
                  this.announcementBannerRef = ref;
                }}
              >
                <p>What if we have two?</p>
                <p>Can we render this?</p>
                <p>Will it work if this expands?</p>
                <p>To maximum length?</p>
                <p>Yes, we can!</p>
              </Banner>
            </Fragment>
          }
          navigation={
            <Navigation
              topOffset={this.getOffset()}
              globalPrimaryIcon={<AtlassianIcon size="small" />}
            >
              <AkNavigationItem text="Welcome to banners!" />
            </Navigation>
          }
        >
          <Grid>
            <Wrapper>
              <Button onClick={this.onErrorBannerChange}>
                Toggle Error Banner
              </Button>
            </Wrapper>
            <Wrapper>
              <Button onClick={this.onAnnouncementBannerChange}>
                Toggle Announcement Banner
              </Button>
            </Wrapper>
            <Wrapper>
              <Button
                onClick={() => {
                  this.onAnnouncementBannerChange();
                  this.onErrorBannerChange();
                }}
              >
                Toggle both Banners
              </Button>
            </Wrapper>
          </Grid>
        </Page>
      </div>
    );
  }
}
