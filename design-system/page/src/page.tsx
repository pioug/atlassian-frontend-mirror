/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { defaultBannerHeight } from './constants';
import type { PageProps } from './types';

const bannerStyles = css({
  width: '100%',
  position: 'fixed',
});

const bannerContainerStyles = css({
  width: '100%',
  position: 'relative',
  zIndex: 3,
  flex: '1 0 auto',
  transition: 'height 0.25s ease-in-out',
});

const pageContentStyles = css({
  minWidth: 0,
  position: 'relative',
  zIndex: 1,
  flex: '1 1 auto',
});

const wrapperStyles = css({
  display: 'flex',
  width: '100%',
  minHeight: '100%',
  flexDirection: 'column',
});

const mainContainerStyles = css({
  display: 'flex',
  flex: '1 1 auto',
});

const navigationStyles = css({
  position: 'relative',
  zIndex: 2,
});

/**
 * __Page__
 *
 * Used to build page layouts.
 *
 * Has built in support for positioning [banners](https://atlassian.design/components/banner/examples)
 * and the deprecated `@atlaskit/navigation`.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/page)
 */
const Page = ({
  isBannerOpen = false,
  bannerHeight = defaultBannerHeight,
  banner,
  navigation,
  children,
  testId,
}: PageProps) => {
  return (
    <div css={wrapperStyles} data-testid={testId}>
      {banner ? (
        <div
          css={bannerContainerStyles}
          style={{ height: isBannerOpen ? `${bannerHeight}px` : '0' }}
          aria-hidden={!isBannerOpen}
          data-testid={testId ? `${testId}--banner-container` : undefined}
        >
          <div css={bannerStyles}>{banner}</div>
        </div>
      ) : null}
      <div css={mainContainerStyles}>
        <div css={navigationStyles}>{navigation}</div>
        <div css={pageContentStyles}>{children}</div>
      </div>
    </div>
  );
};

export default Page;
