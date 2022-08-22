import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl-next';
import {
  act,
  fireEvent,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmbedModal from '../index';
import { EmbedModalProps } from '../types';
import { messages } from '../../../messages';
import { MAX_MODAL_SIZE } from '../constants';

const ThrowError: React.FC = () => {
  useEffect(() => {
    throw Error('Something went wrong.');
  }, []);
  return <span />;
};

describe('embed-modal', () => {
  const testId = 'embed-modal';

  const renderEmbedModal = (props?: Partial<EmbedModalProps>) =>
    render(
      <IntlProvider locale="en">
        <EmbedModal
          iframeName="iframe-name"
          onClose={() => {}}
          showModal={true}
          testId={testId}
          {...props}
        />
      </IntlProvider>,
    );

  it('renders embed modal', async () => {
    const { findByTestId } = renderEmbedModal();
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
      const { findByTestId, queryByTestId } = renderEmbedModal({ onClose });

      const button = await findByTestId(`${testId}-close-button`);

      fireEvent.mouseOver(button);
      const tooltip = await findByTestId(`${testId}-close-tooltip`);
      expect(tooltip.textContent).toBe(messages.preview_close.defaultMessage);

      act(() => {
        userEvent.click(button);
      });
      await waitForElementToBeRemoved(() => queryByTestId(testId));
      const modal = queryByTestId(testId);
      expect(modal).not.toBeInTheDocument();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('resizes modal when clicking resize button', async () => {
      const { findByTestId } = renderEmbedModal();
      const modal = await findByTestId(testId);
      const button = await findByTestId(`${testId}-resize-button`);

      // Resize to maximum size
      fireEvent.mouseOver(button);
      const maxTooltip = await findByTestId(`${testId}-resize-tooltip`);
      expect(maxTooltip.textContent).toBe(
        messages.preview_max_size.defaultMessage,
      );
      act(() => {
        userEvent.click(button);
      });
      expect(modal.getAttribute('style')).toContain(
        `--modal-dialog-width: ${MAX_MODAL_SIZE};`,
      );

      // Resize to minimum size
      fireEvent.mouseOver(button);
      const minTooltip = await findByTestId(`${testId}-resize-tooltip`);
      expect(minTooltip.textContent).toBe(
        messages.preview_min_size.defaultMessage,
      );
      act(() => {
        userEvent.click(button);
      });
      expect(modal.getAttribute('style')).toContain(
        '--modal-dialog-width: 800px;', // This is DS size for 'large'
      );
    });

    describe('with url button', () => {
      it('renders url button', async () => {
        const { findByTestId } = renderEmbedModal({
          url: 'https://link-url',
        });
        const button = await findByTestId(`${testId}-url-button`);
        expect(button).toBeInTheDocument();

        fireEvent.mouseOver(button);
        const tooltip = await findByTestId(`${testId}-url-tooltip`);
        expect(tooltip.textContent).toBe(messages.viewOriginal.defaultMessage);
      });

      it('renders url button with provider name', async () => {
        const { findByTestId } = renderEmbedModal({
          providerName: 'Confluence',
          url: 'https://link-url',
        });
        const button = await findByTestId(`${testId}-url-button`);
        fireEvent.mouseOver(button);
        const tooltip = await findByTestId(`${testId}-url-tooltip`);
        expect(tooltip.textContent).toBe('View in Confluence');
      });

      it('triggers view action callback when clicking url button', async () => {
        const onViewActionClick = jest.fn();
        const { findByTestId } = renderEmbedModal({
          onViewActionClick,
          url: 'https://link-url',
        });
        const button = await findByTestId(`${testId}-url-button`);
        userEvent.click(button);
        expect(onViewActionClick).toHaveBeenCalledTimes(1);
      });

      it('does not render url button when url is not provided', () => {
        const { queryByTestId } = renderEmbedModal();
        const button = queryByTestId(`${testId}-url-button`);
        expect(button).not.toBeInTheDocument();
      });
    });

    describe('with download button', () => {
      it('renders download button', async () => {
        const { findByTestId } = renderEmbedModal({
          download: 'https://download-url',
        });
        const button = await findByTestId(`${testId}-download-button`);
        expect(button).toBeInTheDocument();

        fireEvent.mouseOver(button);
        const tooltip = await findByTestId(`${testId}-download-tooltip`);
        expect(tooltip.textContent).toBe(messages.download.defaultMessage);
      });

      it('triggers download action callback when clicking download button', async () => {
        const onDownloadActionClick = jest.fn();
        const { findByTestId } = renderEmbedModal({
          download: 'https://download-url',
          onDownloadActionClick,
        });
        const button = await findByTestId(`${testId}-download-button`);

        fireEvent.mouseOver(button);
        const tooltip = await findByTestId(`${testId}-download-tooltip`);
        expect(tooltip.textContent).toBe(messages.download.defaultMessage);

        userEvent.click(button);
        expect(onDownloadActionClick).toHaveBeenCalledTimes(1);
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
});
