import { OptionData } from '@atlaskit/user-picker';
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import {
  ShortenResponse,
  UrlShortenerClient,
} from '../../../clients/AtlassianUrlShortenerClient';
import * as ShareServiceExports from '../../../clients/ShareServiceClient';
import {
  ShareDialogContainerInternal,
  State,
} from '../../../components/ShareDialogContainer';
import { ShareDialogWithTrigger } from '../../../components/ShareDialogWithTrigger';
import { OriginTracing, TooltipPosition } from '../../../types';
import { PropsOf } from '../_testUtils';
import { copyLinkButtonClicked } from '../../../components/analytics';

function currentEventLoopEnd() {
  return new Promise((resolve) => setImmediate(resolve));
}

// alias for clarity
function networkResolution() {
  return currentEventLoopEnd();
}

describe('ShareDialogContainer', () => {
  let mockOriginTracing: OriginTracing;
  let mockOriginTracingFactory: jest.Mock;
  let mockShare: jest.Mock;
  let mockShareServiceClient: jest.Mock;
  let mockCreateAnalyticsEvent: jest.Mock;
  let mockFormatCopyLink: jest.Mock;
  const mockCloudId = 'cloudId';
  const mockDialogPlacement = 'bottom-start';
  const mockProductId = 'confluence';
  const mockShareAri = 'ari';
  const mockShareContentType = 'issue';
  const mockShareLink = 'https://share-link';
  const mockShareTitle = 'Share Title';
  const mockTriggerButtonStyle = 'icon-with-text' as const;
  const mockTriggerButtonAppearance = 'subtle';
  const mockShouldCloseOnEscapePress = true;
  const mockUsers: OptionData[] = [
    { type: 'user', id: 'id', name: 'User 1' },
    { type: 'email', id: 'mock@email.com', name: 'mock@email.com' },
  ];
  const mockComment = {
    format: 'plain_text' as const,
    value: 'comment',
  };
  const mockLoadUserOptions = () => [];

  let mockShareClient: ShareServiceExports.ShareClient;
  const SHORTENED_URL = 'https://short';
  let mockShortenerClient: UrlShortenerClient;
  let mockShowFlags: jest.Mock;
  let mockRenderCustomTriggerButton: jest.Mock;
  const mockTriggerButtonTooltipText = 'Share Tooltip';
  const mockTriggerButtonTooltipPosition: TooltipPosition = 'mouse';

  beforeEach(() => {
    mockOriginTracing = {
      id: 'id',
      addToUrl: jest.fn(),
      toAnalyticsAttributes: jest.fn(),
    };
    mockOriginTracingFactory = jest
      .fn<{}, []>()
      .mockReturnValue(mockOriginTracing);
    // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
    //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
    mockShare = jest.fn<{}, []>().mockResolvedValue({});
    //@ts-expect-error TODO Fix legit TypeScript 3.9.6 improved inference error
    mockShareServiceClient = jest
      // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
      //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
      .spyOn<ShareServiceExports.ShareServiceClient>(
        ShareServiceExports,
        'ShareServiceClient',
      )
      //@ts-expect-error TODO Fix legit TypeScript 3.9.6 improved inference error
      .mockImplementation(() => ({
        share: mockShare,
      }));
    mockCreateAnalyticsEvent = jest.fn<{}, []>().mockReturnValue({
      fire: jest.fn(),
    });
    mockFormatCopyLink = jest.fn((origin, link) => link + '&someOrigin');

    mockShareClient = {
      share: mockShare,
    };
    mockShortenerClient = {
      shorten: jest
        .fn()
        .mockResolvedValue({ shortUrl: SHORTENED_URL } as ShortenResponse),
    };
    mockShowFlags = jest.fn();
    mockRenderCustomTriggerButton = jest.fn();
  });
  afterEach(() => {
    mockShareServiceClient.mockRestore();
    window.history.pushState({}, '', '/');
    (mockShortenerClient.shorten as jest.Mock).mockClear();
    mockShare.mockClear();
  });

  function getWrapper(
    overrides: Partial<PropsOf<ShareDialogContainerInternal>> = {},
  ): ShallowWrapper<
    PropsOf<ShareDialogContainerInternal>,
    State,
    ShareDialogContainerInternal
  > {
    let props: PropsOf<ShareDialogContainerInternal> = {
      shareClient: mockShareClient,
      urlShortenerClient: mockShortenerClient,
      cloudId: mockCloudId,
      dialogPlacement: mockDialogPlacement,
      loadUserOptions: mockLoadUserOptions,
      originTracingFactory: mockOriginTracingFactory,
      productId: mockProductId,
      renderCustomTriggerButton: mockRenderCustomTriggerButton,
      shareAri: mockShareAri,
      shareContentType: mockShareContentType,
      shareLink: mockShareLink,
      shareTitle: mockShareTitle,
      showFlags: mockShowFlags,
      formatCopyLink: mockFormatCopyLink,
      shouldCloseOnEscapePress: mockShouldCloseOnEscapePress,
      triggerButtonAppearance: mockTriggerButtonAppearance,
      triggerButtonStyle: mockTriggerButtonStyle,
      triggerButtonTooltipText: mockTriggerButtonTooltipText,
      triggerButtonTooltipPosition: mockTriggerButtonTooltipPosition,
      createAnalyticsEvent: mockCreateAnalyticsEvent,
      ...overrides,
    };

    return shallow(<ShareDialogContainerInternal {...props} />);
  }

  function getShareDialogWithTrigger(wrapper: ReturnType<typeof getWrapper>) {
    return wrapper.find(ShareDialogWithTrigger);
  }

  it('should render', () => {
    const wrapper = getWrapper();
    const shareDialogWithTrigger = getShareDialogWithTrigger(wrapper);
    expect(shareDialogWithTrigger).toHaveLength(1);
    expect(mockFormatCopyLink).toHaveBeenCalled();
    expect(shareDialogWithTrigger.prop('triggerButtonAppearance')).toEqual(
      mockTriggerButtonAppearance,
    );
    expect(shareDialogWithTrigger.prop('triggerButtonStyle')).toEqual(
      mockTriggerButtonStyle,
    );
    expect(shareDialogWithTrigger.prop('copyLink')).toEqual(
      mockFormatCopyLink(null, mockShareLink),
    );
    expect(shareDialogWithTrigger.prop('triggerButtonTooltipText')).toEqual(
      mockTriggerButtonTooltipText,
    );
    expect(shareDialogWithTrigger.prop('triggerButtonTooltipPosition')).toEqual(
      mockTriggerButtonTooltipPosition,
    );
    expect(shareDialogWithTrigger.prop('dialogPlacement')).toEqual(
      mockDialogPlacement,
    );
    expect(shareDialogWithTrigger.prop('loadUserOptions')).toEqual(
      mockLoadUserOptions,
    );
    expect(shareDialogWithTrigger.prop('renderCustomTriggerButton')).toEqual(
      mockRenderCustomTriggerButton,
    );
    expect(shareDialogWithTrigger.prop('shouldCloseOnEscapePress')).toEqual(
      mockShouldCloseOnEscapePress,
    );
    expect(mockOriginTracingFactory).toHaveBeenCalledTimes(2);
  });

  describe('internal methods', () => {
    describe('getRawLink()', () => {
      it('should always give priority to an explicit link', () => {
        const wrapper = getWrapper();
        expect(wrapper.instance().getRawLink()).toEqual(mockShareLink);

        wrapper.setState({ currentPageUrl: 'whatever, should be ignored' });
        expect(wrapper.instance().getRawLink()).toEqual(mockShareLink);

        wrapper.setProps({ shareLink: 'new-share-link' });
        expect(wrapper.instance().getRawLink()).toEqual('new-share-link');
      });

      it('should default to the current page url if no explicit link provided', () => {
        const wrapper = getWrapper({
          shareLink: undefined,
        });
        expect(wrapper.instance().getRawLink()).toEqual(window.location.href);
      });
    });

    describe('getFullCopyLink()', () => {
      it('should includes origin', () => {
        const wrapper = getWrapper();

        expect(wrapper.instance().getFullCopyLink()).toEqual(
          mockShareLink + '&someOrigin',
        );
      });
    });

    describe('getCopyLink()', () => {
      it('should return the fullCopyLink when shortening is NOT enabled', () => {
        const wrapper = getWrapper();

        expect(wrapper.instance().getCopyLink()).toEqual(
          wrapper.instance().getFullCopyLink(),
        );
      });

      it('should return the short URL when available and shortening is enabled', () => {
        const wrapper = getWrapper({
          useUrlShortener: true,
        });

        wrapper.setState({ shortenedCopyLink: SHORTENED_URL });

        expect(wrapper.instance().getCopyLink()).toEqual(SHORTENED_URL);
      });
    });
  });

  describe('automatic default to current page URL', () => {
    it('should be provided as default', () => {
      const wrapper = getWrapper();
      expect(wrapper.state().currentPageUrl).toEqual(window.location.href);
    });

    it('should refresh the current url only on popup reopen', async () => {
      window.history.pushState({}, '', 'test0');
      const wrapper = getWrapper();
      expect(wrapper.state().currentPageUrl).toEqual('http://localhost/test0');

      window.history.pushState({}, '', 'test1');
      wrapper.update();
      expect(wrapper.state().currentPageUrl).toEqual('http://localhost/test0');

      wrapper.instance().handleDialogOpen();
      await currentEventLoopEnd();
      expect(wrapper.state().currentPageUrl).toEqual('http://localhost/test1');
    });
  });

  it('should call onDialogOpen when dislog opens if passed', async () => {
    const onDialogOpenStub = jest.fn();
    const wrapper = getWrapper({
      onDialogOpen: onDialogOpenStub,
    });

    wrapper.instance().handleDialogOpen();

    expect(onDialogOpenStub).toHaveBeenCalledTimes(1);
  });

  it('should call props.originTracingFactory only once when nothing change', () => {
    const wrapper = getWrapper();
    mockOriginTracingFactory.mockReset();

    const previousCopyOrigin = wrapper.instance().getCopyLinkOriginTracing();
    const previousFormShareOrigin = wrapper
      .instance()
      .getFormShareOriginTracing();

    expect(mockOriginTracingFactory).toHaveBeenCalledTimes(0); // because was memoized

    expect(wrapper.instance().getCopyLinkOriginTracing()).toBe(
      previousCopyOrigin,
    );
    expect(wrapper.instance().getFormShareOriginTracing()).toBe(
      previousFormShareOrigin,
    );

    expect(mockOriginTracingFactory).toHaveBeenCalledTimes(0); // still memoized
  });

  it('should call props.originTracingFactory again if shareLink prop is updated', () => {
    const wrapper = getWrapper();
    mockOriginTracingFactory.mockReset();

    const previousCopyOrigin = wrapper.instance().getCopyLinkOriginTracing();
    const previousFormShareOrigin = wrapper
      .instance()
      .getFormShareOriginTracing();

    wrapper.setProps({ shareLink: 'new-share-link' });

    expect(mockOriginTracingFactory).toHaveBeenCalledTimes(2);
    expect(wrapper.instance().getCopyLinkOriginTracing()).not.toBe(
      previousCopyOrigin,
    );
    expect(wrapper.instance().getFormShareOriginTracing()).not.toBe(
      previousFormShareOrigin,
    );
  });

  it('should have default this.shareClient if props.shareClient is not given', () => {
    const wrapper = getWrapper({
      shareClient: undefined,
    });

    const shareClient: ShareServiceExports.ShareClient =
      // @ts-ignore: accessing private variable for testing purpose
      wrapper.instance().shareClient;
    expect(shareClient.share).toEqual(mockShare);
  });

  describe('handleSubmitShare', () => {
    it('should call share function from this.client', () => {
      const wrapper = getWrapper();
      const mockDialogContentState = {
        users: mockUsers,
        comment: mockComment,
      };
      wrapper.instance().handleSubmitShare(mockDialogContentState);
      wrapper.instance().forceUpdate();
      expect(mockShare).toHaveBeenCalledTimes(1);
      expect(mockShare).toHaveBeenCalledWith(
        {
          ari: mockShareAri,
          link: mockShareLink,
          title: mockShareTitle,
          type: mockShareContentType,
        },
        [
          { type: 'user', id: 'id' },
          { type: 'user', email: 'mock@email.com' },
        ],
        {
          productId: mockProductId,
          atlOriginId: wrapper.instance().getFormShareOriginTracing().id,
          shareeAction: 'view',
        },
        mockComment,
      );
    });

    it('should send shareeAction', () => {
      const wrapper = getWrapper({ shareeAction: 'view' });
      const mockDialogContentState = {
        users: mockUsers,
        comment: mockComment,
      };
      wrapper.instance().handleSubmitShare(mockDialogContentState);
      wrapper.instance().forceUpdate();
      expect(mockShare).toHaveBeenCalledTimes(1);
      expect(mockShare).toHaveBeenCalledWith(
        {
          ari: mockShareAri,
          link: mockShareLink,
          title: mockShareTitle,
          type: mockShareContentType,
        },
        [
          { type: 'user', id: 'id' },
          { type: 'user', email: 'mock@email.com' },
        ],
        {
          productId: mockProductId,
          atlOriginId: wrapper.instance().getFormShareOriginTracing().id,
          shareeAction: 'view',
        },
        mockComment,
      );
    });

    it('should update shareActionCount from the state if share is successful', async () => {
      const wrapper = getWrapper();
      const mockShareResponse = {};
      mockShare.mockResolvedValueOnce(mockShareResponse);
      const mockDialogContentState = {
        users: mockUsers,
        comment: mockComment,
      };

      expect(wrapper.state().shareActionCount).toEqual(0);

      await wrapper.instance().handleSubmitShare(mockDialogContentState);

      expect(wrapper.state().shareActionCount).toEqual(1);
    });

    it('should update the mail Origin Ids if share is successful', async () => {
      const wrapper = getWrapper();
      mockOriginTracingFactory.mockReset();

      const previousCopyOrigin = wrapper.instance().getCopyLinkOriginTracing();
      const previousFormShareOrigin = wrapper
        .instance()
        .getFormShareOriginTracing();

      expect(mockOriginTracingFactory).toHaveBeenCalledTimes(0); // because was memoized

      const mockDialogContentState = {
        users: mockUsers,
        comment: mockComment,
      };
      await wrapper.instance().handleSubmitShare(mockDialogContentState);

      expect(wrapper.instance().getCopyLinkOriginTracing()).toBe(
        previousCopyOrigin,
      ); // no change
      expect(wrapper.instance().getFormShareOriginTracing()).not.toBe(
        previousFormShareOrigin,
      ); // change
      expect(mockOriginTracingFactory).toHaveBeenCalledTimes(1); // only once for mail
    });

    it('should return a Promise Rejection if share is failed', async () => {
      const wrapper = getWrapper();
      mockShare.mockRejectedValueOnce('error');
      wrapper.instance().forceUpdate();
      const mockDialogContentState = {
        users: mockUsers,
        comment: mockComment,
      };
      try {
        await wrapper.instance().handleSubmitShare(mockDialogContentState);
      } catch (err) {
        expect(err).toEqual('error');
      }
    });
  });

  describe('url shortening', () => {
    describe('props', () => {
      describe('urlShortenerClient', () => {
        it('should provides a default shortening client if none given', () => {
          const wrapper = getWrapper({
            urlShortenerClient: undefined,
          });

          const urlShortenerClient =
            // @ts-ignore: accessing private variable for testing purpose
            wrapper.instance().urlShortenerClient;
          expect(urlShortenerClient.shorten).toBeTruthy();
          expect(urlShortenerClient.shorten).not.toEqual(
            mockShortenerClient.shorten,
          );
        });

        it('should use the given shortening client if passed as prop', () => {
          const wrapper = getWrapper();

          const urlShortenerClient =
            // @ts-ignore: accessing private variable for testing purpose
            wrapper.instance().urlShortenerClient;
          expect(urlShortenerClient.shorten).toEqual(
            mockShortenerClient.shorten,
          );
        });
      });

      it('useUrlShortener: should NOT shorten if not enabled', async () => {
        const wrapper = getWrapper();

        expect(mockShortenerClient.shorten).not.toHaveBeenCalled();
        wrapper.instance().getUpToDateShortenedCopyLink = jest
          .fn()
          .mockRejectedValue(new Error('TEST!'));

        // stimulate in various ways
        wrapper.instance().getCopyLink();
        wrapper.instance().handleDialogOpen();
        wrapper.instance().getCopyLink();
        await currentEventLoopEnd();
        await networkResolution();

        expect(mockShortenerClient.shorten).not.toHaveBeenCalled();
        expect(
          wrapper.instance().getUpToDateShortenedCopyLink,
        ).not.toHaveBeenCalled();
        expect(wrapper.instance().getCopyLink()).toEqual(
          wrapper.instance().getFullCopyLink(),
        );
      });

      it('productId: should NOT shorten if the product is not supported', async () => {
        const wrapper = getWrapper({
          useUrlShortener: true,
          urlShortenerClient: undefined, // use the internal one
          productId: 'trello',
        });

        wrapper.instance().handleDialogOpen();
        await networkResolution();

        expect(wrapper.instance().getCopyLink()).toEqual(
          wrapper.instance().getFullCopyLink(),
        );
      });
    });

    describe('analytics', () => {
      it('should send an analytics on short URL request', () => {
        const wrapper = getWrapper({
          useUrlShortener: true,
        });

        expect(mockCreateAnalyticsEvent).not.toHaveBeenCalled();

        wrapper.instance().handleDialogOpen();

        expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
        expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
          eventType: 'operational',
          action: 'requested',
          actionSubject: 'shortUrl',
          actionSubjectId: undefined,
          source: 'shareModal',
          attributes: {
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            source: 'shareModal',
          },
        });
      });

      it('should decorate the copy link analytics with shortUrl', async () => {
        const wrapper = getWrapper({
          useUrlShortener: true,
        });

        let finalPayload = wrapper
          .instance()
          .decorateAnalytics(copyLinkButtonClicked(0));

        expect(finalPayload).toMatchObject({
          eventType: 'ui',
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'copyShareLink',
          attributes: {
            shortUrl: false,
          },
        });

        wrapper.instance().handleDialogOpen();
        await currentEventLoopEnd();

        finalPayload = wrapper
          .instance()
          .decorateAnalytics(copyLinkButtonClicked(0));
        expect(finalPayload).toMatchObject({
          eventType: 'ui',
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'copyShareLink',
          attributes: {
            shortUrl: true,
          },
        });
      });

      describe('on short URL reception', () => {
        it('should send an analytics', async () => {
          const wrapper = getWrapper({
            useUrlShortener: true,
          });
          let resolveShortening: any;
          const shortenResult = new Promise((resolve) => {
            resolveShortening = resolve;
          });
          (mockShortenerClient.shorten as jest.Mock).mockReturnValue(
            shortenResult,
          );
          expect(mockCreateAnalyticsEvent).not.toHaveBeenCalled();

          wrapper.instance().handleDialogOpen();
          mockCreateAnalyticsEvent.mockClear();

          resolveShortening({
            shortUrl: 'whatever',
          });
          await currentEventLoopEnd();

          expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
          expect(mockCreateAnalyticsEvent.mock.calls[0][0]).toMatchObject({
            eventType: 'operational',
            action: 'generated',
            actionSubject: 'shortUrl',
            actionSubjectId: undefined,
            attributes: {
              duration: expect.any(Number),
              packageName: '@atlaskit/share',
              packageVersion: '999.9.9',
              source: 'shareModal',
              tooSlow: false,
            },
          });
        });

        it('should includes perf info - too slow', async () => {
          const wrapper = getWrapper({
            useUrlShortener: true,
          });
          let resolveShortening: any;
          const shortenResult = new Promise((resolve) => {
            resolveShortening = resolve;
          });
          (mockShortenerClient.shorten as jest.Mock).mockReturnValue(
            shortenResult,
          );
          expect(mockCreateAnalyticsEvent).not.toHaveBeenCalled();

          wrapper.instance().handleDialogOpen();
          mockCreateAnalyticsEvent.mockClear();

          // pretend we clicked on the copy link button
          wrapper.instance().decorateAnalytics(copyLinkButtonClicked(0));

          // then resolve later
          resolveShortening({
            shortUrl: 'whatever',
          });
          await currentEventLoopEnd();

          expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
          expect(mockCreateAnalyticsEvent.mock.calls[0][0]).toMatchObject({
            eventType: 'operational',
            action: 'generated',
            actionSubject: 'shortUrl',
            source: 'shareModal',
            attributes: {
              duration: expect.any(Number),
              tooSlow: true,
            },
          });
        });
      });

      it('should send an analytics on short URL generation error', async () => {
        const wrapper = getWrapper({
          useUrlShortener: true,
        });
        let rejectShortening: any;
        const shortenResult = new Promise((resolve, reject) => {
          rejectShortening = reject;
        });
        (mockShortenerClient.shorten as jest.Mock).mockReturnValue(
          shortenResult,
        );

        expect(mockCreateAnalyticsEvent).not.toHaveBeenCalled();

        wrapper.instance().handleDialogOpen();

        expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
        expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
          eventType: 'operational',
          action: 'requested',
          actionSubject: 'shortUrl',
          actionSubjectId: undefined,
          source: 'shareModal',
          attributes: {
            packageName: '@atlaskit/share',
            packageVersion: '999.9.9',
            source: 'shareModal',
          },
        });
        mockCreateAnalyticsEvent.mockClear();

        rejectShortening(new Error('Test!'));
        await currentEventLoopEnd();

        expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(1);
        expect(mockCreateAnalyticsEvent).toHaveBeenCalledWith({
          eventType: 'operational',
          action: 'encountered',
          actionSubject: 'error',
          actionSubjectId: 'urlShortening',
          source: 'shareModal',
          attributes: {
            packageName: '@atlaskit/share',
            packageVersion: '999.9.9',
            source: 'shareModal',
          },
        });
      });
    });

    it('should not attempt to shorten before the popup opens', async () => {
      const wrapper = getWrapper({
        useUrlShortener: true,
      });
      const updateShortCopyLink = (wrapper.instance().updateShortCopyLink = jest.fn(
        wrapper.instance().updateShortCopyLink,
      ));
      const getUpToDateShortenedCopyLink = (wrapper.instance().getUpToDateShortenedCopyLink = jest.fn(
        wrapper.instance().getUpToDateShortenedCopyLink,
      ));

      expect(mockShortenerClient.shorten).not.toHaveBeenCalled();
      expect(wrapper.state().shortenedCopyLink).toBeNull();
      expect(wrapper.instance().getCopyLink()).toEqual(
        wrapper.instance().getFullCopyLink(),
      );
      expect(getShareDialogWithTrigger(wrapper).prop('copyLink')).toEqual(
        wrapper.instance().getFullCopyLink(),
      );

      wrapper.instance().handleDialogOpen();

      expect(updateShortCopyLink).toHaveBeenCalledTimes(1);
      expect(getUpToDateShortenedCopyLink).toHaveBeenCalledTimes(1);
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(1);

      await networkResolution();

      expect(wrapper.state().shortenedCopyLink).toEqual(SHORTENED_URL);
      expect(wrapper.instance().getCopyLink()).toEqual(SHORTENED_URL);
      expect(getShareDialogWithTrigger(wrapper).prop('copyLink')).toEqual(
        SHORTENED_URL,
      );
    });

    it('should re-shorten the url only on link change + popup reopen', async () => {
      const mockShortenerClient: UrlShortenerClient = {
        shorten: jest
          .fn()
          .mockResolvedValue({ shortUrl: SHORTENED_URL } as ShortenResponse),
      };
      const wrapper = getWrapper({
        useUrlShortener: true,
        urlShortenerClient: mockShortenerClient,
      });
      const updateShortCopyLink = (wrapper.instance().updateShortCopyLink = jest.fn(
        wrapper.instance().updateShortCopyLink,
      ));
      const getUpToDateShortenedCopyLink = (wrapper.instance().getUpToDateShortenedCopyLink = jest.fn(
        wrapper.instance().getUpToDateShortenedCopyLink,
      ));

      expect(mockShortenerClient.shorten).not.toHaveBeenCalled();
      expect(wrapper.state().shortenedCopyLink).toBeNull();
      expect(wrapper.instance().getCopyLink()).toEqual(
        wrapper.instance().getFullCopyLink(),
      );

      wrapper.instance().handleDialogOpen();
      expect(updateShortCopyLink).toHaveBeenCalledTimes(1);
      expect(getUpToDateShortenedCopyLink).toHaveBeenCalledTimes(1);
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(1);

      // reopen, no change

      wrapper.instance().handleDialogOpen();
      expect(updateShortCopyLink).toHaveBeenCalledTimes(2);
      expect(getUpToDateShortenedCopyLink).toHaveBeenCalledTimes(2);
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(1); // thanks to memo

      // change in props
      const NEW_SHORTENED_URL = 'https://short2';
      (mockShortenerClient.shorten as jest.Mock).mockResolvedValue({
        shortUrl: NEW_SHORTENED_URL,
      } as ShortenResponse);
      wrapper.setProps({ shareLink: '/new-share-link' });

      // no re-open yet = no change
      await currentEventLoopEnd();
      expect(updateShortCopyLink).toHaveBeenCalledTimes(2);
      expect(getUpToDateShortenedCopyLink).toHaveBeenCalledTimes(2);
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(1);

      wrapper.instance().handleDialogOpen();
      expect(updateShortCopyLink).toHaveBeenCalledTimes(3);
      expect(getUpToDateShortenedCopyLink).toHaveBeenCalledTimes(3);
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(2);
      expect(wrapper.state().shortenedCopyLink).toBeNull(); // invalidated

      await networkResolution();
      expect(wrapper.state().shortenedCopyLink).toEqual(NEW_SHORTENED_URL);
      expect(wrapper.instance().getCopyLink()).toEqual(NEW_SHORTENED_URL);
    });

    it('should properly integrate with auto share URL when re-shortening', async () => {
      window.history.pushState({}, '', 'test0');
      const mockShortenerClient: UrlShortenerClient = {
        shorten: jest
          .fn()
          .mockResolvedValue({ shortUrl: SHORTENED_URL } as ShortenResponse),
      };
      const wrapper = getWrapper({
        useUrlShortener: true,
        urlShortenerClient: mockShortenerClient,
        shareLink: undefined,
      });
      const updateShortCopyLink = (wrapper.instance().updateShortCopyLink = jest.fn(
        wrapper.instance().updateShortCopyLink,
      ));
      const getUpToDateShortenedCopyLink = (wrapper.instance().getUpToDateShortenedCopyLink = jest.fn(
        wrapper.instance().getUpToDateShortenedCopyLink,
      ));

      wrapper.instance().handleDialogOpen();
      expect(updateShortCopyLink).toHaveBeenCalledTimes(1);
      expect(getUpToDateShortenedCopyLink).toHaveBeenCalledTimes(1);
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(1);
      expect(mockShortenerClient.shorten).toHaveBeenCalledWith({
        cloudId: mockCloudId,
        product: mockProductId,
        type: 'legacy',
        params: { path: 'http://localhost/test0&someOrigin' },
      });

      // change page URL
      window.history.pushState({}, '', 'test1');

      // no re-open yet = no change
      await currentEventLoopEnd();
      expect(updateShortCopyLink).toHaveBeenCalledTimes(1);
      expect(getUpToDateShortenedCopyLink).toHaveBeenCalledTimes(1);
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(1);

      wrapper.instance().handleDialogOpen();
      expect(updateShortCopyLink).toHaveBeenCalledTimes(2);
      expect(getUpToDateShortenedCopyLink).toHaveBeenCalledTimes(2);
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(2);
      expect(mockShortenerClient.shorten).toHaveBeenCalledWith({
        cloudId: mockCloudId,
        product: mockProductId,
        type: 'legacy',
        params: { path: 'http://localhost/test0&someOrigin' },
      });
    });

    it('should generate a short URL using shortLinkData', async () => {
      const mockShortenerClient: UrlShortenerClient = {
        shorten: jest
          .fn()
          .mockResolvedValue({ shortUrl: SHORTENED_URL } as ShortenResponse),
      };
      const mockShortLinkData = {
        cloudId: mockCloudId,
        product: mockProductId,
        type: 'page',
        params: { spaceKey: 'X', contentId: '123' },
      };
      const wrapper = getWrapper({
        shortLinkData: mockShortLinkData,
        urlShortenerClient: mockShortenerClient,
        shareLink: undefined,
      });
      const updateShortCopyLink = (wrapper.instance().updateShortCopyLink = jest.fn(
        wrapper.instance().updateShortCopyLink,
      ));
      const getUpToDateShortenedCopyLink = (wrapper.instance().getUpToDateShortenedCopyLink = jest.fn(
        wrapper.instance().getUpToDateShortenedCopyLink,
      ));

      wrapper.instance().handleDialogOpen();
      expect(updateShortCopyLink).toHaveBeenCalledTimes(1);
      expect(getUpToDateShortenedCopyLink).toHaveBeenCalledTimes(1);
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(1);
      expect(mockShortenerClient.shorten).toHaveBeenCalledWith(
        mockShortLinkData,
      );
    });

    it('should properly swap and refresh the passed down "copy link" to the short URL once available', async () => {
      const mockShortenerClient: UrlShortenerClient = {
        shorten: jest
          .fn()
          .mockResolvedValue({ shortUrl: SHORTENED_URL } as ShortenResponse),
      };
      const wrapper = getWrapper({
        useUrlShortener: true,
        urlShortenerClient: mockShortenerClient,
      });

      wrapper.instance().handleDialogOpen();

      // not yet
      expect(wrapper.instance().getCopyLink()).not.toEqual(SHORTENED_URL);
      expect(getShareDialogWithTrigger(wrapper).prop('copyLink')).not.toEqual(
        SHORTENED_URL,
      );

      await networkResolution();

      expect(wrapper.instance().getCopyLink()).toEqual(SHORTENED_URL);
      expect(getShareDialogWithTrigger(wrapper).prop('copyLink')).toEqual(
        SHORTENED_URL,
      );
    });

    it('should be protected against race conditions', async () => {
      const SHORTENED_URL_1 = 'https://short/1';
      const SHORTENED_URL_2 = 'https://short/2';
      let resolve1: Function;
      let resolve2: Function;

      const mockShortenerClient: UrlShortenerClient = {
        shorten: jest
          .fn()
          .mockReturnValueOnce(
            new Promise<string>((resolve) => (resolve1 = resolve)),
          )
          .mockReturnValueOnce(
            new Promise<string>((resolve) => (resolve2 = resolve)),
          ),
      };
      const wrapper = getWrapper({
        useUrlShortener: true,
        urlShortenerClient: mockShortenerClient,
      });

      expect(mockShortenerClient.shorten).not.toHaveBeenCalled();
      expect(wrapper.state().shortenedCopyLink).toBeNull();

      wrapper.instance().handleDialogOpen();
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(1); // request 1 in flight
      expect(wrapper.state().shortenedCopyLink).toBeNull(); // still not set

      // change in props
      wrapper.setProps({ shareLink: '/new-share-link' });

      wrapper.instance().handleDialogOpen();
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(2);
      expect(wrapper.state().shortenedCopyLink).toBeNull(); // still not set

      // now let's resolve the promises in the WRONG order
      resolve2!({ shortUrl: SHORTENED_URL_2 } as ShortenResponse);
      await currentEventLoopEnd();

      expect(wrapper.state().shortenedCopyLink).toEqual(SHORTENED_URL_2);
      expect(wrapper.instance().getCopyLink()).toEqual(SHORTENED_URL_2);

      // LATE resolution of the old request
      resolve1!({ shortUrl: SHORTENED_URL_1 } as ShortenResponse);
      await currentEventLoopEnd();

      // all good, the old response was ignored
      expect(wrapper.state().shortenedCopyLink).toEqual(SHORTENED_URL_2);
      expect(wrapper.instance().getCopyLink()).toEqual(SHORTENED_URL_2);
    });
  });
});
