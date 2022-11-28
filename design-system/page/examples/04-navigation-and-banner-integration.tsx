/* eslint-disable @atlaskit/design-system/no-deprecated-apis */
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Banner from '@atlaskit/banner';
import Button from '@atlaskit/button/standard-button';
import { AtlassianIcon } from '@atlaskit/logo';
// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
import Navigation, { AkNavigationItem } from '@atlaskit/navigation';

import Page, { Grid } from '../src';

import { ButtonWrapper } from './common/button-wrapper';

const NavigationExample = () => {
  const errorBannerRef = useRef<HTMLDivElement>(null);
  const announcementBannerRef = useRef<HTMLDivElement>(null);

  const [isErrorBannerOpen, setIsErrorBannerOpen] = useState(false);
  const [isAnnouncementBannerOpen, setIsAnnouncementBannerOpen] =
    useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const errorBannerHeight = errorBannerRef?.current?.clientHeight ?? 0;
    const announcementBannerHeight =
      announcementBannerRef?.current?.clientHeight ?? 0;

    let tempOffset = 0;
    if (isErrorBannerOpen) {
      tempOffset += errorBannerHeight;
    }
    if (isAnnouncementBannerOpen) {
      tempOffset += announcementBannerHeight;
    }
    setOffset(tempOffset);
  }, [isErrorBannerOpen, isAnnouncementBannerOpen]);

  const toggleErrorBanner = useCallback(
    () => setIsErrorBannerOpen((isOpen) => !isOpen),
    [setIsErrorBannerOpen],
  );

  const toggleAnnouncementBanner = useCallback(
    () => setIsAnnouncementBannerOpen((isOpen) => !isOpen),
    [setIsAnnouncementBannerOpen],
  );

  return (
    /* This wrapping div exists to help this example display nicely on the
    atlaskit website. It probably shouldn't be in code otherwise. */
    <div>
      <Page
        testId="page"
        isBannerOpen={isErrorBannerOpen || isAnnouncementBannerOpen}
        bannerHeight={offset}
        banner={
          <>
            {isErrorBannerOpen && (
              <Banner appearance="error" ref={errorBannerRef}>
                Example Banner
              </Banner>
            )}
            {isAnnouncementBannerOpen && (
              <Banner appearance="announcement" ref={announcementBannerRef}>
                <p>What if we have two?</p>
                <p>Can we render this?</p>
                <p>Will it work if this expands?</p>
                <p>To maximum length?</p>
                <p>Yes, we can!</p>
              </Banner>
            )}
          </>
        }
        navigation={
          <Navigation
            topOffset={offset}
            globalPrimaryIcon={<AtlassianIcon size="small" />}
          >
            <AkNavigationItem text="Welcome to banners!" />
          </Navigation>
        }
      >
        <Grid>
          <ButtonWrapper>
            <Button onClick={toggleErrorBanner}>Toggle Error Banner</Button>
            <Button onClick={toggleAnnouncementBanner}>
              Toggle Announcement Banner
            </Button>
            <Button
              testId="toggle"
              onClick={() => {
                toggleAnnouncementBanner();
                toggleErrorBanner();
              }}
            >
              Toggle both Banners
            </Button>
          </ButtonWrapper>
        </Grid>
      </Page>
    </div>
  );
};
export default NavigationExample;
