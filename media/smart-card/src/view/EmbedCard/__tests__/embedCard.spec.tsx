import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { EmbedCard } from '../index';
import { CardState } from '../../../state/store/types';

describe('EmbedCard view component', () => {
  describe('resolved embed with preview', () => {
    const expectedUrl = 'http://some-url.com';
    const expectedName = 'some-name';

    const setup = () => {
      const cardState: CardState = {
        status: 'resolved',
        lastUpdatedAt: 42,
        details: {
          meta: {
            access: 'granted',
            visibility: 'public',
          },
          data: {
            '@type': 'Object',
            '@context': {
              '@vocab': 'https://www.w3.org/ns/activitystreams#',
              atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
              schema: 'http://schema.org/',
            },
            url: expectedUrl,
            name: expectedName,
            preview: {
              '@type': 'Link',
              href: 'http://some-preview-url.com',
            },
          },
        },
      };
      const handleFrameClickMock = jest.fn();
      const onResolveMock = jest.fn();
      const ref = React.createRef<HTMLIFrameElement>();

      const { getByTestId, getByText } = render(
        <EmbedCard
          url={expectedUrl}
          cardState={cardState}
          isSelected={true}
          isFrameVisible={true}
          inheritDimensions={true}
          handleAuthorize={jest.fn()}
          handleErrorRetry={jest.fn()}
          handleFrameClick={handleFrameClickMock}
          handleAnalytics={jest.fn()}
          handleInvoke={jest.fn()}
          onResolve={onResolveMock}
          ref={ref}
        />,
      );

      const iframeEl = getByTestId(
        'embed-card-resolved-view-frame',
      ) as HTMLIFrameElement;
      Object.defineProperty(iframeEl, 'clientWidth', { value: 400 });

      return {
        getByTestId,
        getByText,
        handleFrameClickMock,
        onResolveMock,
        iframeEl,
        ref,
      };
    };

    it('should render resolved view', () => {
      const { getByTestId, iframeEl } = setup();

      const resolveView = getByTestId('embed-card-resolved-view');
      expect(resolveView).toBeTruthy();
      expect(iframeEl.src).toEqual('http://some-preview-url.com/');
      expect(resolveView.getAttribute('data-is-selected')).toBe('true');
      expect(resolveView.getAttribute('data-is-frame-visible')).toBe('true');
      // Asserting result of inheritDimensions=true
      expect(
        window.getComputedStyle(resolveView).getPropertyValue('height'),
      ).toEqual('100%');
    });

    it('should call handleFrameClick when title is clicked', () => {
      const { getByText, handleFrameClickMock } = setup();
      fireEvent.click(getByText(expectedName));
      expect(handleFrameClickMock).toHaveBeenCalled();
    });

    it('should call onResolve right away', () => {
      const { onResolveMock } = setup();
      expect(onResolveMock).toHaveBeenCalledWith({
        title: expectedName,
        url: expectedUrl,
      });
    });

    it('should pass iframe ref down to resolved view', () => {
      const { iframeEl, ref } = setup();

      // const resolveView = getByTestId('embed-card-resolved-view');
      expect(iframeEl).toBe(ref.current);
    });
  });
});
