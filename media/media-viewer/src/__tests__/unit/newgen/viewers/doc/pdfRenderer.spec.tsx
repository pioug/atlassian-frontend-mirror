jest.mock('pdfjs-dist/build/pdf', () => ({
  __esModule: true, // this property makes it work
  GlobalWorkerOptions: {
    workerSrc: '',
  },
  getDocument: jest.fn(),
}));

jest.mock('pdfjs-dist/web/pdf_viewer', () => ({
  __esModule: true, // this property makes it work
  PDFViewer: jest.fn().mockImplementation(() => {
    return {
      setDocument: jest.fn(),
      firstPagePromise: new Promise(() => {}),
    };
  }),
}));

import React from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer';
import Button from '@atlaskit/button/custom-theme-button';
import {
  PDFRenderer,
  pdfViewerClassName,
  Props,
  State,
} from '../../../../../viewers/doc/pdfRenderer';
import { ZoomControls } from '../../../../../zoomControls';
import { Spinner } from '../../../../../loading';
import { ErrorMessage } from '../../../../../errorMessage';
import { mountWithIntlContext } from '@atlaskit/media-test-helpers';

function createFixture(documentPromise: Promise<any>) {
  const onClose = jest.fn();
  const onSuccess = jest.fn();
  (pdfjsLib.getDocument as jest.Mock<{}>).mockReturnValue({
    promise: documentPromise,
  });

  const el = mountWithIntlContext<Props, State>(
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
      onClose={onClose}
      onSuccess={onSuccess}
    />,
  );
  return { el, onClose, onSuccess };
}

describe('PDFRenderer', () => {
  beforeEach(() => {
    (PDFJSViewer.PDFViewer as jest.Mock<{}>).mockImplementation(() => {
      return {
        setDocument: jest.fn(),
        firstPagePromise: new Promise(() => {}),
      };
    });
  });
  afterEach(() => {
    (pdfjsLib.getDocument as jest.Mock<{}>).mockReset();
    (PDFJSViewer.PDFViewer as jest.Mock<{}>).mockReset();
  });

  it('supports zooming', async () => {
    const documentPromise = Promise.resolve({});
    const { el } = createFixture(documentPromise);
    await documentPromise;
    el.update();

    expect(el.state('zoomLevel').value).toEqual(1);

    expect(el.state('doc').status).toEqual('SUCCESSFUL');
    expect(el.find(ZoomControls)).toHaveLength(1);
    el.find(ZoomControls).find(Button).first().simulate('click');
    expect(el.state('zoomLevel').value).toBeLessThan(1);
  });

  it('shows a loading indicator until the document is ready', () => {
    const unresolvedDocumentPromise = new Promise(() => {});
    const { el } = createFixture(unresolvedDocumentPromise);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('shows an error message when the document could not be loaded', async () => {
    const failedDocumentPromise = Promise.reject(new Error('test'));
    const { el } = createFixture(failedDocumentPromise);

    // wait for promise rejection ignoring the error
    await failedDocumentPromise.catch(() => {});
    el.update();

    const errorMessage = el.find(ErrorMessage);

    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      "We couldn't generate a preview for this file",
    );
    expect(errorMessage.find(Button)).toHaveLength(0);
  });

  it('MSW-700: clicking on background of DocViewer does not close it', async () => {
    const documentPromise = Promise.resolve({});
    const { el, onClose } = createFixture(documentPromise);
    await documentPromise;
    el.update();

    el.find(`.${pdfViewerClassName}`).simulate('click');

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onSuccess when loaded', async () => {
    const documentPromise = Promise.resolve({});
    const { el, onSuccess } = createFixture(documentPromise);
    await documentPromise;
    el.update();

    expect(onSuccess).toHaveBeenCalled();
  });

  it('should destroy loading documents on component unmount', async () => {
    const documentPromise = Promise.resolve({
      loadingTask: {
        destroyed: false,
      },
      destroy: jest.fn(),
    });
    const { el } = createFixture(documentPromise);
    await documentPromise;
    el.update();
    el.unmount();

    expect((await documentPromise).destroy).toHaveBeenCalled();
  });
});
