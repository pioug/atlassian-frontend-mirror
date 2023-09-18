import 'jest-extended';
import { flushPromises } from '@atlaskit/link-test-helpers';
import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl-next';
import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import uuid from 'uuid';
import { messages } from '../../../messages';
import { MAX_MODAL_SIZE } from '../constants';
import type { AnalyticsFacade } from '../../../state/analytics';
import { mockAnalytics, mocks } from '../../../utils/mocks';
import { useSmartLinkAnalytics } from '../../../state/analytics/useSmartLinkAnalytics';
import EmbedModal from '../index';
import * as utils from '../../../utils';
import * as ufo from '../../../state/analytics/ufoExperiences';

jest.mock('uuid', () => ({
  ...jest.requireActual('uuid'),
  __esModule: true,
  default: jest.fn().mockReturnValue('some-uuid-1'),
}));
jest.mock('@atlaskit/link-provider', () => ({
  useSmartLinkContext: () => ({
    store: { getState: () => ({ 'test-url': mocks.analytics }) },
  }),
}));

const EXPERIENCE_TEST_ID = 'smart-link-action-invocation';

// These values should have been set in analytics context
const EXPECTED_COMMON_ATTRIBUTES = {
  componentName: 'smart-cards',
  definitionId: 'spaghetti-id',
  destinationProduct: 'spaghetti-product',
  destinationSubproduct: 'spaghetti-subproduct',
  extensionKey: 'spaghetti-key',
  location: 'test-location',
  packageName: '@atlaskit/fabric',
  packageVersion: '0.0.0',
  resourceType: 'spaghetti-resource',
  destinationObjectType: 'spaghetti-resource',
};

const ThrowError: React.FC = () => {
  useEffect(() => {
    throw Error('Something went wrong.');
  }, []);
  return <span />;
};

describe('EmbedModal', () => {
  const testId = 'embed-modal';
  let mockWindowOpen: jest.Mock;

  const renderEmbedModal = (
    props?: Partial<React.ComponentProps<typeof EmbedModal>>,
  ) =>
    render(
      <IntlProvider locale="en">
        <EmbedModal
          analytics={mockAnalytics}
          extensionKey="object-provider"
          iframeName="iframe-name"
          onClose={() => {}}
          showModal={true}
          testId={testId}
          {...props}
        />
      </IntlProvider>,
    );

  const expectModalSize = (modal: HTMLElement, size: string) => {
    // This check is not ideal but it is the only value on DS modal dialog
    // HTML element that indicates change in size of the component.
    expect(modal.getAttribute('style')).toContain(
      `--modal-dialog-width: ${size};`,
    );
  };

  const expectModalMaxSize = (modal: HTMLElement) =>
    expectModalSize(modal, MAX_MODAL_SIZE);

  const expectModalMinSize = (modal: HTMLElement) =>
    expectModalSize(modal, '800px'); // This is DS modal dialog size for 'large'
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    mockWindowOpen = jest.fn();
    global.open = mockWindowOpen;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders embed modal', async () => {
    const { findByTestId } = renderEmbedModal();
    const modal = await findByTestId(testId);
    expect(modal).toBeDefined();
  });

  it('renders embed modal without analytics', async () => {
    const { findByTestId } = render(
      <IntlProvider locale="en">
        <EmbedModal
          iframeName="iframe-name"
          onClose={() => {}}
          showModal={true}
          testId={testId}
        />
      </IntlProvider>,
    );
    const modal = await findByTestId(testId);
    expect(modal).toBeDefined();
  });

  it('renders a link info', async () => {
    const title = 'Link title';
    const { findByTestId } = renderEmbedModal({
      title,
    });

    expect((await findByTestId(`${testId}-title`)).textContent).toEqual(title);
  });

  it('renders an iframe', async () => {
    const iframeName = 'iframe-name';
    const src = 'https://link-url';
    const { findByTestId } = renderEmbedModal({ iframeName, src });
    const iframe = await findByTestId(`${testId}-embed`);

    expect(iframe).toBeDefined();
    expect(iframe.getAttribute('name')).toEqual(iframeName);
    expect(iframe.getAttribute('src')).toEqual(src);
    expect(iframe.getAttribute('sandbox')).toEqual(expect.any(String));
  });

  describe('with buttons', () => {
    it('closes modal and trigger close callback when clicking close button', async () => {
      const onClose = jest.fn();
      const { getByTestId, findByTestId, queryByTestId } = renderEmbedModal({
        onClose,
      });

      const button = await findByTestId(`${testId}-close-button`);

      fireEvent.mouseOver(button);

      // the below `findByTestId` is flakey in the pipelines, so adding the below `waitFor`
      await waitFor(
        () => {
          expect(getByTestId(`${testId}-close-tooltip`)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      const tooltip = await findByTestId(`${testId}-close-tooltip`);
      expect(tooltip.textContent).toBe(messages.preview_close.defaultMessage);

      await user.click(button);
      await waitForElementToBeRemoved(() => queryByTestId(testId));
      const modal = queryByTestId(testId);
      expect(modal).not.toBeInTheDocument();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('resizes modal when clicking resize button', async () => {
      const { getByTestId, findByTestId } = renderEmbedModal();
      const modal = await findByTestId(testId);
      const button = await findByTestId(`${testId}-resize-button`);

      // Resize to min size
      fireEvent.mouseOver(button);

      // the below `findByTestId` is flakey in the pipelines, so adding the below `waitFor`
      await waitFor(
        () => {
          expect(getByTestId(`${testId}-resize-tooltip`)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      const minTooltip = await findByTestId(`${testId}-resize-tooltip`);
      expect(minTooltip.textContent).toBe(
        messages.preview_min_size.defaultMessage,
      );
      await user.click(button);
      expectModalMinSize(modal);

      // Resize to max size
      fireEvent.mouseOver(button);

      // the below `findByTestId` is flakey in the pipelines, so adding the below `waitFor`
      await waitFor(
        () => {
          expect(getByTestId(`${testId}-resize-tooltip`)).toBeInTheDocument();
        },
        { timeout: 2000 },
      );

      const maxTooltip = await findByTestId(`${testId}-resize-tooltip`);
      expect(maxTooltip.textContent).toBe(
        messages.preview_max_size.defaultMessage,
      );
      await user.click(button);
      expectModalMaxSize(modal);
    });

    describe('with url button', () => {
      it('renders url button', async () => {
        const { getByTestId, findByTestId } = renderEmbedModal({
          url: 'https://link-url',
        });
        const button = await findByTestId(`${testId}-url-button`);
        expect(button).toBeInTheDocument();

        fireEvent.mouseOver(button);

        // the below `findByTestId` is flakey in the pipelines, so adding the below `waitFor`
        await waitFor(
          () => {
            expect(getByTestId(`${testId}-url-tooltip`)).toBeInTheDocument();
          },
          { timeout: 2000 },
        );

        const tooltip = await findByTestId(`${testId}-url-tooltip`);
        expect(tooltip.textContent).toBe(messages.viewOriginal.defaultMessage);
      });

      it('renders url button with provider name', async () => {
        const { getByTestId, findByTestId } = renderEmbedModal({
          providerName: 'Confluence',
          url: 'https://link-url',
        });
        const button = await findByTestId(`${testId}-url-button`);
        fireEvent.mouseOver(button);

        // the below `findByTestId` is flakey in the pipelines, so adding the below `waitFor`
        await waitFor(
          () => {
            expect(getByTestId(`${testId}-url-tooltip`)).toBeInTheDocument();
          },
          { timeout: 2000 },
        );

        const tooltip = await findByTestId(`${testId}-url-tooltip`);
        expect(tooltip.textContent).toBe('View in Confluence');
      });

      it('trigger open url when clicking url button', async () => {
        const openUrlSpy = jest.spyOn(utils, 'openUrl');
        const { findByTestId } = renderEmbedModal({
          url: 'https://link-url',
        });
        const button = await findByTestId(`${testId}-url-button`);
        await user.click(button);
        await flushPromises();

        expect(openUrlSpy).toHaveBeenCalledTimes(1);
      });

      it('does not render url button when url is not provided', () => {
        const { queryByTestId } = renderEmbedModal();
        const button = queryByTestId(`${testId}-url-button`);
        expect(button).not.toBeInTheDocument();
      });
    });

    describe('with download button', () => {
      it('renders download button', async () => {
        const { getByTestId, findByTestId } = renderEmbedModal({
          download: 'https://download-url',
        });
        const button = await findByTestId(`${testId}-download-button`);
        expect(button).toBeInTheDocument();

        fireEvent.mouseOver(button);

        // the below `findByTestId` is flakey in the pipelines, so adding the below `waitFor`
        await waitFor(
          () => {
            expect(
              getByTestId(`${testId}-download-tooltip`),
            ).toBeInTheDocument();
          },
          { timeout: 2000 },
        );

        const tooltip = await findByTestId(`${testId}-download-tooltip`);
        expect(tooltip.textContent).toBe(messages.download.defaultMessage);
      });

      it('triggers download when clicking download button', async () => {
        const downloadUrlSpy = jest.spyOn(utils, 'downloadUrl');
        const url = 'https://download-url';
        const { getByTestId, findByTestId } = renderEmbedModal({
          download: url,
        });
        const button = await findByTestId(`${testId}-download-button`);

        fireEvent.mouseOver(button);

        // the below `findByTestId` is flakey in the pipelines, so adding the below `waitFor`
        await waitFor(
          () => {
            expect(
              getByTestId(`${testId}-download-tooltip`),
            ).toBeInTheDocument();
          },
          { timeout: 2000 },
        );

        const tooltip = await findByTestId(`${testId}-download-tooltip`);
        expect(tooltip.textContent).toBe(messages.download.defaultMessage);

        await user.click(button);
        await flushPromises();

        expect(downloadUrlSpy).toHaveBeenCalledTimes(1);
      });

      it('does not render download button when download url is not provided', () => {
        const { queryByTestId } = renderEmbedModal();
        const button = queryByTestId(`${testId}-download-button`);
        expect(button).not.toBeInTheDocument();
      });
    });
  });

  it('triggers open failed callback when modal content throws error', async () => {
    const onOpenFailed = jest.fn();
    renderEmbedModal({
      icon: { icon: <ThrowError /> },
      onOpenFailed,
    });
    expect(onOpenFailed).toHaveBeenCalledTimes(1);
  });

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
      jest.restoreAllMocks();
    });

    it('dispatches analytics event on modal open', async () => {
      const onOpen = jest.fn();
      const { findByTestId } = renderEmbedModal({
        analytics,
        onOpen,
        origin: 'smartLinkPreviewHoverCard',
      });
      await findByTestId(testId);

      await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1));

      expect(dispatchAnalytics).toHaveBeenCalledTimes(2);
      expect(dispatchAnalytics).toHaveBeenNthCalledWith(1, {
        action: 'viewed',
        actionSubject: 'embedPreviewModal',
        name: 'embedPreviewModal',
        attributes: {
          ...EXPECTED_COMMON_ATTRIBUTES,
          id,
          origin: 'smartLinkPreviewHoverCard',
          size: 'large',
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
          display: 'embedPreview',
          destinationProduct: 'spaghetti-product',
          destinationSubproduct: 'spaghetti-subproduct',
          extensionKey: 'spaghetti-key',
          location,
          packageName: expect.any(String),
          packageVersion: expect.any(String),
          resourceType: 'spaghetti-resource',
          destinationObjectType: 'spaghetti-resource',
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

      await waitFor(() => expect(onOpenFailed).toHaveBeenCalledTimes(1));
      expect(dispatchAnalytics).toHaveBeenCalledWith({
        action: 'renderFailed',
        actionSubject: 'smartLink',
        attributes: {
          ...EXPECTED_COMMON_ATTRIBUTES,
          id,
          display: 'embedPreview',
          error: expect.any(Object),
          errorInfo: expect.any(Object),
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
      await waitFor(() => expect(onOpen).toHaveBeenCalledTimes(1));
      const button = await findByTestId(`${testId}-close-button`);
      await user.click(button);
      await waitForElementToBeRemoved(() => queryByTestId(testId));

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(dispatchAnalytics).toHaveBeenLastCalledWith({
        action: 'closed',
        actionSubject: 'modal',
        actionSubjectId: 'embedPreview',
        attributes: {
          ...EXPECTED_COMMON_ATTRIBUTES,
          id,
          origin: 'smartLinkCard',
          previewTime: expect.any(Number),
          size: 'large',
        },
        eventType: 'ui',
      });
    });

    it('dispatches analytics event on resize modal', async () => {
      const onResize = jest.fn();
      const { findByTestId } = renderEmbedModal({
        analytics,
        onResize,
        origin: 'smartLinkCard',
      });

      const button = await findByTestId(`${testId}-resize-button`);
      await user.click(button);

      expect(dispatchAnalytics).toHaveBeenCalledWith({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'embedPreviewResize',
        attributes: {
          ...EXPECTED_COMMON_ATTRIBUTES,
          id,
          newSize: 'small',
          origin: 'smartLinkCard',
          previousSize: 'large',
        },
        eventType: 'ui',
      });
      expect(onResize).toHaveBeenCalledTimes(1);
    });

    it('dispatches analytics event on open url on a new tab', async () => {
      const ufoStartSpy = jest.spyOn(ufo, 'startUfoExperience');
      const ufoSucceedSpy = jest.spyOn(ufo, 'succeedUfoExperience');
      uuid.mockReturnValueOnce(EXPERIENCE_TEST_ID);

      const { findByTestId } = renderEmbedModal({
        analytics,
        url: 'https://link-url',
      });
      const button = await findByTestId(`${testId}-url-button`);
      await user.click(button);
      await flushPromises();

      expect(dispatchAnalytics).toHaveBeenCalledWith({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'shortcutGoToLink',
        attributes: {
          ...EXPECTED_COMMON_ATTRIBUTES,
          id,
          actionType: 'ViewAction',
          display: 'embedPreview',
        },
        eventType: 'ui',
      });
      expect(dispatchAnalytics).toHaveBeenCalledWith({
        action: 'resolved',
        actionSubject: 'smartLinkAction',
        attributes: {
          ...EXPECTED_COMMON_ATTRIBUTES,
          id,
          actionType: 'ViewAction',
          display: 'embedPreview',
        },
        eventType: 'operational',
      });

      expect(ufoStartSpy).toBeCalledWith(
        'smart-link-action-invocation',
        EXPERIENCE_TEST_ID,
        {
          actionType: 'ViewAction',
          display: 'embedPreview',
          extensionKey: 'object-provider',
          invokeType: 'client',
        },
      );
      expect(ufoSucceedSpy).toBeCalledWith(
        'smart-link-action-invocation',
        EXPERIENCE_TEST_ID,
      );
      expect(ufoStartSpy).toHaveBeenCalledBefore(ufoSucceedSpy as jest.Mock);
    });

    it('dispatches analytics event on download url', async () => {
      const ufoStartSpy = jest.spyOn(ufo, 'startUfoExperience');
      const ufoSucceedSpy = jest.spyOn(ufo, 'succeedUfoExperience');
      uuid.mockReturnValueOnce(EXPERIENCE_TEST_ID);
      const url = 'https://download-url';

      const { findByTestId } = renderEmbedModal({
        analytics,
        download: url,
      });
      const button = await findByTestId(`${testId}-download-button`);
      await user.click(button);
      await flushPromises();

      expect(dispatchAnalytics).toHaveBeenCalledWith({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'downloadDocument',
        attributes: {
          ...EXPECTED_COMMON_ATTRIBUTES,
          id,
          actionType: 'DownloadAction',
          display: 'embedPreview',
        },
        eventType: 'ui',
      });
      expect(dispatchAnalytics).toHaveBeenCalledWith({
        action: 'resolved',
        actionSubject: 'smartLinkAction',
        attributes: {
          ...EXPECTED_COMMON_ATTRIBUTES,
          id,
          actionType: 'DownloadAction',
          display: 'embedPreview',
        },
        eventType: 'operational',
      });
      expect(ufoStartSpy).toHaveBeenCalledTimes(1);
      expect(ufoStartSpy).toBeCalledWith(
        'smart-link-action-invocation',
        EXPERIENCE_TEST_ID,
        {
          actionType: 'DownloadAction',
          display: 'embedPreview',
          extensionKey: 'object-provider',
          invokeType: 'client',
        },
      );
      expect(ufoSucceedSpy).toHaveBeenCalledTimes(1);
      expect(ufoSucceedSpy).toBeCalledWith(
        'smart-link-action-invocation',
        EXPERIENCE_TEST_ID,
      );
      expect(ufoStartSpy).toHaveBeenCalledBefore(ufoSucceedSpy as jest.Mock);
    });
  });
});
