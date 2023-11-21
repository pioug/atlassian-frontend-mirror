jest.mock('pdfjs-dist/legacy/build/pdf', () => ({
  __esModule: true,
  getDocument: jest.fn().mockImplementation(() => {
    return jest.fn();
  }),
  GlobalWorkerOptions: {
    workerSrc: '',
  },
  version: '',
}));

jest.mock('pdfjs-dist/legacy/web/pdf_viewer', () => ({
  __esModule: true,
  PDFViewer: jest.fn().mockImplementation(() => {
    return {
      setDocument: jest.fn(),
      firstPagePromise: new Promise(() => {}),
    };
  }),
  EventBus: jest.fn(),
  PDFLinkService: jest.fn().mockImplementation(() => {
    return {
      setDocument: jest.fn(),
      setViewer: jest.fn(),
    };
  }),
}));

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf';
import {
  PDFRenderer,
  pdfViewerClassName,
} from '../../../../../viewers/doc/pdfRenderer';
import { IntlProvider } from 'react-intl-next';
import userEvent from '@testing-library/user-event';

// data test ids and labels
const spinnerLabel = 'Loading file...';
const pdfViewerWrapperTestId = 'media-viewer-pdf-content';

describe('PDFRenderer', () => {
  beforeEach(() => {});

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('supports zooming', async () => {
    const user = userEvent.setup();
    render(
      <IntlProvider locale="en">
        <PDFRenderer
          item={{
            id: '1',
            status: 'processing',
            mediaType: 'doc',
            mimeType: 'application/pdf',
            name: 'file.pdf',
            size: 1,
          }}
          src={''}
          workerUrl="someUrl"
        />
      </IntlProvider>,
    );

    expect(await screen.findByText('100 %')).toBeInTheDocument();

    // should render zoom controls
    expect(screen.queryByLabelText('zoom out')).toBeInTheDocument();
    expect(screen.queryByLabelText('zoom in')).toBeInTheDocument();

    // click zoom control
    const zoomOutBtn = screen.getByLabelText('zoom out');
    await user.click(zoomOutBtn);

    // expect new zoom level to be less than 100%
    const zoomLevelElement = screen.getByText('%', { exact: false });
    expect(zoomLevelElement).toBeInTheDocument();
    const foundZoomLevel = zoomLevelElement.innerText.match(/\d+ %/);
    expect(foundZoomLevel).toBeDefined();
    expect(parseInt(foundZoomLevel![0])).toBeLessThan(100);
  });

  it('shows a loading indicator until the document is ready', async () => {
    (getDocument as jest.Mock).mockReturnValueOnce({
      promise: new Promise(() => {}),
    });
    render(
      <IntlProvider locale="en">
        <PDFRenderer
          item={{
            id: '1',
            status: 'processing',
            mediaType: 'doc',
            mimeType: 'application/pdf',
            name: 'file.pdf',
            size: 1,
          }}
          src={''}
          workerUrl="someUrl"
        />
      </IntlProvider>,
    );

    // should render a spinner
    expect(screen.queryByLabelText(spinnerLabel)).toBeInTheDocument();
  });

  it('shows an error message when the document could not be loaded', async () => {
    (getDocument as jest.Mock).mockReturnValueOnce({
      promise: Promise.reject(new Error('test')),
    });
    render(
      <IntlProvider locale="en">
        <PDFRenderer
          item={{
            id: '1',
            status: 'processing',
            mediaType: 'doc',
            mimeType: 'application/pdf',
            name: 'file.pdf',
            size: 1,
          }}
          src={''}
          workerUrl="someUrl"
        />
      </IntlProvider>,
    );

    expect(
      await screen.findByText("We couldn't generate a preview for this file."),
    ).toBeInTheDocument();
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Error loading file' }),
    ).toBeInTheDocument();
  });

  it('MSW-700: clicking on background of DocViewer does not close it', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <IntlProvider locale="en">
        <PDFRenderer
          item={{
            id: '1',
            status: 'processing',
            mediaType: 'doc',
            mimeType: 'application/pdf',
            name: 'file.pdf',
            size: 1,
          }}
          src={''}
          workerUrl="someUrl"
          onClose={onClose}
        />
      </IntlProvider>,
    );

    const pdfViewerWrapper = await screen.findByTestId(pdfViewerWrapperTestId);
    const pdfViewer = pdfViewerWrapper.firstElementChild;
    expect(pdfViewer).toBeDefined();
    expect(pdfViewer!.className).toEqual(pdfViewerClassName);
    await user.click(pdfViewer!);

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onSuccess when loaded', async () => {
    const onSuccess = jest.fn();
    render(
      <IntlProvider locale="en">
        <PDFRenderer
          item={{
            id: '1',
            status: 'processing',
            mediaType: 'doc',
            mimeType: 'application/pdf',
            name: 'file.pdf',
            size: 1,
          }}
          src={''}
          workerUrl="someUrl"
          onSuccess={onSuccess}
        />
      </IntlProvider>,
    );
    // wait for MediaViewer to be fully loaded
    await waitFor(() =>
      expect(screen.queryByLabelText(spinnerLabel)).not.toBeInTheDocument(),
    );

    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('should destroy loading documents on component unmount', async () => {
    const destroy = jest.fn();
    (getDocument as jest.Mock).mockReturnValueOnce({
      promise: Promise.resolve({
        loadingTask: {
          destroyed: false,
        },
        destroy,
      }),
    });

    const { unmount } = render(
      <IntlProvider locale="en">
        <PDFRenderer
          item={{
            id: '1',
            status: 'processing',
            mediaType: 'doc',
            mimeType: 'application/pdf',
            name: 'file.pdf',
            size: 1,
          }}
          src={''}
          workerUrl="someUrl"
        />
      </IntlProvider>,
    );

    // wait for MediaViewer to be fully loaded
    await waitFor(() =>
      expect(screen.queryByLabelText(spinnerLabel)).not.toBeInTheDocument(),
    );

    unmount();
    expect(destroy).toHaveBeenCalled();
  });
});
