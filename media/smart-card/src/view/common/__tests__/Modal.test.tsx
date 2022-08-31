import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl-next';
import {
  act,
  render,
  wait,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import {
  AnalyticsFacade,
  useSmartLinkAnalytics,
} from '../../../state/analytics';
import { mockAnalytics, mocks } from '../../../utils/mocks';
import Modal from '../Modal';

jest.mock('@atlaskit/link-provider', () => ({
  useSmartLinkContext: () => ({
    store: { getState: () => ({ 'test-url': mocks.analytics }) },
  }),
}));

const ThrowError: React.FC = () => {
  useEffect(() => {
    throw Error('Something went wrong.');
  }, []);
  return <span />;
};

describe('Modal', () => {
  const testId = 'embed-modal';

  const renderEmbedModal = (
    props?: Partial<React.ComponentProps<typeof Modal>>,
  ) =>
    render(
      <IntlProvider locale="en">
        <Modal
          analytics={mockAnalytics}
          iframeName="iframe-name"
          onClose={() => {}}
          showModal={true}
          testId={testId}
          {...props}
        />
      </IntlProvider>,
    );

  describe('with analytics', () => {
    const id = 'test-id';
    const location = 'test-location';
    const dispatchAnalytics = jest.fn();
    let analytics: AnalyticsFacade;

    beforeEach(() => {
      const { result } = renderHook(() =>
        useSmartLinkAnalytics('test-url', dispatchAnalytics, id, location),
      );
      analytics = result.current;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('dispatches analytics event on modal open', async () => {
      const onOpen = jest.fn();
      const { findByTestId } = renderEmbedModal({
        analytics,
        onOpen,
        origin: 'smartLinkPreviewHoverCard',
      });
      await findByTestId(testId);

      await wait(() => expect(onOpen).toHaveBeenCalledTimes(1));

      expect(dispatchAnalytics).toHaveBeenCalledTimes(2);
      expect(dispatchAnalytics).toHaveBeenNthCalledWith(1, {
        action: 'viewed',
        actionSubject: 'embedPreviewModal',
        name: 'embedPreviewModal',
        attributes: {
          id,
          componentName: 'smart-cards',
          definitionId: 'spaghetti-id',
          destinationProduct: 'spaghetti-product',
          destinationSubproduct: 'spaghetti-subproduct',
          extensionKey: 'spaghetti-key',
          location,
          origin: 'smartLinkPreviewHoverCard',
          packageName: '@atlaskit/smart-card',
          packageVersion: '999.9.9',
          resourceType: 'spaghetti-resource',
          size: 'small',
        },
        eventType: 'screen',
      });
      expect(dispatchAnalytics).toHaveBeenNthCalledWith(2, {
        action: 'renderSuccess',
        actionSubject: 'smartLink',
        attributes: {
          id,
          componentName: 'smart-cards',
          definitionId: 'spaghetti-id',
          display: 'preview',
          destinationProduct: 'spaghetti-product',
          destinationSubproduct: 'spaghetti-subproduct',
          extensionKey: 'spaghetti-key',
          location,
          packageName: '@atlaskit/smart-card',
          packageVersion: '999.9.9',
          resourceType: 'spaghetti-resource',
          status: 'resolved',
        },
        eventType: 'ui',
      });
    });

    it('dispatches analytics event on modal open failed', async () => {
      const onOpenFailed = jest.fn();
      renderEmbedModal({
        analytics,
        icon: { icon: <ThrowError /> },
        onOpenFailed,
      });

      await wait(() => expect(onOpenFailed).toHaveBeenCalledTimes(1));
      expect(dispatchAnalytics).toHaveBeenCalledWith({
        action: 'renderFailed',
        actionSubject: 'smartLink',
        attributes: {
          id,
          componentName: 'smart-cards',
          definitionId: 'spaghetti-id',
          destinationProduct: 'spaghetti-product',
          destinationSubproduct: 'spaghetti-subproduct',
          display: 'preview',
          error: expect.any(Object),
          errorInfo: expect.any(Object),
          extensionKey: 'spaghetti-key',
          location,
          packageName: '@atlaskit/smart-card',
          packageVersion: '999.9.9',
          resourceType: 'spaghetti-resource',
        },
        eventType: 'ui',
      });
    });

    it('dispatches analytics event on modal close', async () => {
      const onClose = jest.fn();
      const onOpen = jest.fn();
      const { findByTestId, queryByTestId } = renderEmbedModal({
        analytics,
        onClose,
        onOpen,
        origin: 'smartLinkCard',
      });
      await wait(() => expect(onOpen).toHaveBeenCalledTimes(1));
      const button = await findByTestId('preview-close-button');
      act(() => {
        userEvent.click(button);
      });
      await waitForElementToBeRemoved(() => queryByTestId(testId));

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(dispatchAnalytics).toHaveBeenLastCalledWith({
        action: 'closed',
        actionSubject: 'modal',
        actionSubjectId: 'embedPreview',
        attributes: {
          id,
          componentName: 'smart-cards',
          definitionId: 'spaghetti-id',
          destinationProduct: 'spaghetti-product',
          destinationSubproduct: 'spaghetti-subproduct',
          extensionKey: 'spaghetti-key',
          location,
          origin: 'smartLinkCard',
          packageName: '@atlaskit/smart-card',
          packageVersion: '999.9.9',
          previewTime: expect.any(Number),
          resourceType: 'spaghetti-resource',
          size: 'small',
        },
        eventType: 'ui',
      });
    });
  });
});
