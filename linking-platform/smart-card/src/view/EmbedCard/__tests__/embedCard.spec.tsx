import React from 'react';
import { fireEvent } from '@testing-library/react';
import {
  expectFunctionToHaveBeenCalledWith,
  JestFunction,
} from '@atlaskit/media-test-helpers';
import { CardState } from '@atlaskit/linking-common';
import { EmbedCard } from '../index';
import { EmbedCardProps } from '../types';
import { mockAnalytics } from '../../../utils/mocks';
import { JsonLd } from 'json-ld-types';
import { renderWithIntl } from '@atlaskit/media-test-helpers/renderWithIntl';
import { UnauthorisedImage } from '../constants';
import { CONTENT_URL_SECURITY_AND_PERMISSIONS } from '../../../constants';

import { PROVIDER_KEYS_WITH_THEMING } from '../../../extractors/constants';
import { setGlobalTheme } from '@atlaskit/tokens';

const baseData: JsonLd.Response['data'] = {
  '@type': 'Object',
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
};

const setup = (cardState: CardState, url: string) => {
  const handleFrameClickMock = jest.fn();
  const onResolveMock: JestFunction<Required<EmbedCardProps>['onResolve']> =
    jest.fn();
  const ref = React.createRef<HTMLIFrameElement>();

  setGlobalTheme({ colorMode: 'dark' });

  const { getByTestId, getByText, queryByTestId } = renderWithIntl(
    <EmbedCard
      url={url}
      cardState={cardState}
      isSelected={true}
      isFrameVisible={true}
      inheritDimensions={true}
      handleAuthorize={jest.fn()}
      handleErrorRetry={jest.fn()}
      handleFrameClick={handleFrameClickMock}
      analytics={mockAnalytics}
      handleInvoke={jest.fn()}
      onResolve={onResolveMock}
      ref={ref}
    />,
  );

  const iframeEl = queryByTestId(
    'embed-card-resolved-view-frame',
  ) as HTMLIFrameElement;
  if (iframeEl) {
    Object.defineProperty(iframeEl, 'clientWidth', { value: 400 });
  }

  return {
    getByTestId,
    getByText,
    handleFrameClickMock,
    iframeEl,
    onResolveMock,
    ref,
  };
};

jest.mock('@atlaskit/link-provider', () => ({
  useFeatureFlag: () => false,
}));

describe('EmbedCard view component', () => {
  describe('resolved embed with preview', () => {
    const expectedUrl = 'http://some-url.com';
    const expectedName = 'some-name';
    const expectedPreviewUrl = 'http://some-preview-url.com';

    const cardStateOverride: CardState = {
      status: 'resolved',
      details: {
        meta: {
          access: 'granted',
          visibility: 'public',
        },
        data: {
          ...baseData,
          url: expectedUrl,
          name: expectedName,
          preview: {
            '@type': 'Link',
            href: expectedPreviewUrl,
            'atlassian:aspectRatio': 0.72,
          },
        },
      },
    };

    it('should render resolved view', () => {
      const { getByTestId, iframeEl } = setup(cardStateOverride, expectedUrl);

      const resolveView = getByTestId('embed-card-resolved-view');
      expect(resolveView).toBeTruthy();
      if (!iframeEl) {
        return expect(iframeEl).toBeDefined();
      }
      expect(iframeEl.src).toEqual('http://some-preview-url.com/');
      expect(resolveView.getAttribute('data-is-selected')).toBe('true');
      // Asserting result of inheritDimensions=true
      expect(
        window.getComputedStyle(resolveView).getPropertyValue('height'),
      ).toEqual('100%');
    });

    it.each([...PROVIDER_KEYS_WITH_THEMING, 'not-supported-provider'])(
      'should add themMode query param if theming is supported',
      (providerKey) => {
        const cardStateOverrideWithThemeSupport: any = {
          ...cardStateOverride,
          details: {
            ...cardStateOverride.details,
            meta: { key: providerKey, access: 'granted', visibility: 'public' },
          },
        };
        const { iframeEl } = setup(
          cardStateOverrideWithThemeSupport,
          expectedUrl,
        );

        if (providerKey !== 'not-supported-provider') {
          expect(iframeEl.getAttribute('src')).toEqual(
            `${expectedPreviewUrl}?themeMode=dark`,
          );
        } else {
          expect(iframeEl.getAttribute('src')).toEqual(expectedPreviewUrl);
        }
      },
    );

    it('should call handleFrameClick when title is clicked', () => {
      const { getByText, handleFrameClickMock } = setup(
        cardStateOverride,
        expectedUrl,
      );
      fireEvent.click(getByText(expectedName));
      expect(handleFrameClickMock).toHaveBeenCalled();
    });

    it('should call onResolve right away', () => {
      const { onResolveMock } = setup(cardStateOverride, expectedUrl);
      expectFunctionToHaveBeenCalledWith(onResolveMock, [
        {
          title: expectedName,
          url: expectedUrl,
          aspectRatio: 0.72,
        },
      ]);
    });

    it('should pass iframe ref down to resolved view', () => {
      const { iframeEl, ref } = setup(cardStateOverride, expectedUrl);
      expect(iframeEl).toBe(ref.current);
    });
  });

  describe('forbidden embed', () => {
    const expectedUrl = 'https://trellis.coffee/b/gNwMppQL';
    const expectedPreview =
      'https://trellis.coffee/b/gNwMppQL?iframeSource=atlassian-smart-link';

    const getForbiddenCardState = (preview: string | undefined): CardState => ({
      status: 'forbidden',
      details: {
        meta: {
          visibility: 'restricted',
          access: 'forbidden',
        },
        data: {
          ...baseData,
          url: expectedUrl,
          ...(preview ? { preview } : {}),
        },
      },
    });

    it('should render resolved view with preview', () => {
      const cardState = getForbiddenCardState(expectedPreview);
      const { getByTestId, iframeEl } = setup(cardState, expectedUrl);

      const resolveView = getByTestId('embed-card-resolved-view');
      expect(resolveView).toBeTruthy();
      if (!iframeEl) {
        return expect(iframeEl).toBeDefined();
      }
      expect(iframeEl.src).toEqual(expectedPreview);
    });

    it('should render forbidden view without preview', () => {
      const cardState = getForbiddenCardState(undefined);
      const { getByTestId } = setup(cardState, expectedUrl);
      const forbiddenView = getByTestId('embed-card-forbidden-view');
      expect(forbiddenView).toBeTruthy();
    });
  });

  describe('unauthorised embed', () => {
    const expectedUrl = 'https://some.url';

    const getUnauthorizedCardState = (
      image?: JsonLd.Primitives.Image,
    ): CardState => ({
      status: 'unauthorized',
      details: {
        meta: {
          access: 'unauthorized',
          visibility: 'restricted',
        },
        data: {
          ...baseData,
          generator: {
            '@type': 'Application',
            name: '3P',
            icon: {
              '@type': 'Image',
              url: 'https://some.icon.url',
            },
            ...(image ? { image } : {}),
          },
          url: expectedUrl,
        },
      },
    });

    it('renders unauthorised view with default image', () => {
      const expectedImageUrl = UnauthorisedImage;
      const cardState = getUnauthorizedCardState();
      const { getByTestId } = setup(cardState, expectedUrl);
      const unauthorizedView = getByTestId('embed-card-unauthorized-view');
      expect(unauthorizedView).toBeTruthy();

      const unauthorizedViewImage = getByTestId(
        'embed-card-unauthorized-view-unresolved-image',
      );
      expect(unauthorizedViewImage.getAttribute('src')).toBe(expectedImageUrl);
    });

    it('renders unauthorised view with provider image', () => {
      const expectedImageUrl = 'https://image-url';
      const cardState = getUnauthorizedCardState({
        '@type': 'Image',
        url: expectedImageUrl,
      });
      const { getByTestId } = setup(cardState, expectedUrl);

      const unauthorizedView = getByTestId('embed-card-unauthorized-view');
      expect(unauthorizedView).toBeTruthy();

      const unauthorizedViewImage = getByTestId(
        'embed-card-unauthorized-view-unresolved-image',
      );
      expect(unauthorizedViewImage.getAttribute('src')).toBe(expectedImageUrl);
    });

    it('renders unauthorised view messages', () => {
      const cardState = getUnauthorizedCardState(undefined);
      const { getByTestId } = setup(cardState, expectedUrl);

      const unauthorizedView = getByTestId('embed-card-unauthorized-view');
      expect(unauthorizedView).toBeTruthy();

      const title = getByTestId(
        'embed-card-unauthorized-view-unresolved-title',
      );
      expect(title.textContent).toBe('Connect your 3P account');
      expect(title).toHaveStyle('max-width: 400px');

      const description = getByTestId(
        'embed-card-unauthorized-view-unresolved-description',
      );
      expect(description.textContent).toBe(
        'Connect 3P to Atlassian to view more details of your work and collaborate from one place. Learn more about Smart Links.',
      );
      expect(description).toHaveStyle('max-width: 400px');

      const action = getByTestId('button-connect-account');
      expect(action.textContent).toBe('Connect to 3P');
    });

    it('renders learn more anchor', () => {
      const cardState = getUnauthorizedCardState(undefined);
      const { getByTestId } = setup(cardState, expectedUrl);

      const unauthorizedView = getByTestId('embed-card-unauthorized-view');
      expect(unauthorizedView).toBeTruthy();

      const anchor = getByTestId('embed-card-unauthorized-view-learn-more');
      expect(anchor.getAttribute('href')).toBe(
        CONTENT_URL_SECURITY_AND_PERMISSIONS,
      );
    });
  });
});
