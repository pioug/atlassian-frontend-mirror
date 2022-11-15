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
  const onResolveMock: JestFunction<
    Required<EmbedCardProps>['onResolve']
  > = jest.fn();
  const ref = React.createRef<HTMLIFrameElement>();

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

describe('EmbedCard view component', () => {
  describe('resolved embed with preview', () => {
    const expectedUrl = 'http://some-url.com';
    const expectedName = 'some-name';

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
            href: 'http://some-preview-url.com',
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
      expect(resolveView.getAttribute('data-is-frame-visible')).toBe('true');
      // Asserting result of inheritDimensions=true
      expect(
        window.getComputedStyle(resolveView).getPropertyValue('height'),
      ).toEqual('100%');
    });

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
});
