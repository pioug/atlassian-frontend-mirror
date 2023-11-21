import React, { useEffect, useRef, useState } from 'react';
import { FileState } from '@atlaskit/media-client';
import { token } from '@atlaskit/tokens';
import {
  PDFViewer,
  EventBus,
  PDFLinkService,
  NullL10n,
} from 'pdfjs-dist/legacy/web/pdf_viewer';
import {
  getDocument,
  GlobalWorkerOptions,
  CMapCompressionType,
} from 'pdfjs-dist/legacy/build/pdf';
import { cmap } from './cmaps';
import type { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf';
import { css, Global } from '@emotion/react';
import { ZoomControls } from '../../zoomControls';
import { PDFWrapper } from '../../styleWrappers';
import { closeOnDirectClick } from '../../utils/closeOnDirectClick';
import { Outcome } from '../../domain';
import { Spinner } from '../../loading';
import ErrorMessage from '../../errorMessage';
import { MediaViewerError } from '../../errors';
import { ZoomLevel } from '../../domain/zoomLevel';
import { processError } from './processError';
import { pdfJs } from './pdfJs';
import { extractCompressedBase64 } from './extractCompressedBase64';

export const pdfViewerClassName = 'pdfViewer';

// Styles are partially copied from https://github.com/mozilla/pdfjs-dist/blob/v2.9.359/web/pdf_viewer.css
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */
const globalStyles = css`
  .${pdfViewerClassName} {
    margin-top: ${token('space.800', '64px')};
    margin-bottom: ${token('space.800', '64px')};

    .page {
      margin: 1px auto ${token('space.negative.100', '-8px')} auto;
      border: 9px solid transparent;
      position: relative;
    }

    .canvasWrapper {
      overflow: hidden;
    }

    .textLayer {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      opacity: 0.2;
      line-height: 1;
    }

    .textLayer span,
    .textLayer br {
      color: transparent;
      position: absolute;
      white-space: pre;
      cursor: text;
      transform-origin: 0% 0%;
    }

    .textLayer ::-moz-selection {
      background: rgba(0, 0, 255, 1);
    }

    .textLayer ::selection {
      background: rgba(0, 0, 255, 1);
    }

    .annotationLayer section {
      position: absolute;
      text-align: initial;
    }

    .annotationLayer .linkAnnotation > a,
    .annotationLayer .buttonWidgetAnnotation.pushButton > a {
      position: absolute;
      font-size: 1em;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .annotationLayer .linkAnnotation > a:hover,
    .annotationLayer .buttonWidgetAnnotation.pushButton > a:hover {
      opacity: 0.2;
      background: rgba(255, 255, 0, 1);
      box-shadow: 0 2px 10px rgba(255, 255, 0, 1);
    }
  }
`;
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage/preview */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */

export type Props = {
  item: FileState;
  src: string;
  workerUrl?: string;
  onClose?: () => void;
  onSuccess?: () => void;
  onError?: (error: MediaViewerError) => void;
};

class CmapFacotry {
  constructor() {}
  async fetch({ name }: { name: string }) {
    const { value } = await cmap[name]();
    const data = await extractCompressedBase64(value);
    return { cMapData: data, compressionType: CMapCompressionType.BINARY };
  }
}

let defaultWorkerUrl = '';

export const PDFRenderer = ({
  src,
  onClose,
  onSuccess,
  onError,
  workerUrl,
  item,
}: Props) => {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(new ZoomLevel(1));
  const [docOutcome, setDocOutcome] = useState<Outcome<any, MediaViewerError>>(
    Outcome.pending(),
  );
  const pdfWrapperRef = useRef<HTMLDivElement>();
  const docRef = useRef<PDFDocumentProxy>();
  const pdfViewerRef = useRef<any>();
  const onSuccessRef = useRef<(() => void) | undefined>(onSuccess);
  const onErrorRef = useRef<((error: MediaViewerError) => void) | undefined>(
    onError,
  );

  useEffect(() => {
    let isSubscribed = true;
    const fetchDoc = async () => {
      try {
        if (!workerUrl && !defaultWorkerUrl) {
          const blob = await extractCompressedBase64(pdfJs, 'blob');
          defaultWorkerUrl = URL.createObjectURL(blob);
        }
        GlobalWorkerOptions.workerSrc = workerUrl ?? defaultWorkerUrl;

        docRef.current = await getDocument({
          url: src,
          CMapReaderFactory: CmapFacotry,
        }).promise;
        isSubscribed && setDocOutcome(Outcome.successful(docRef.current));
      } catch (error) {
        const pdfError = processError(error);
        isSubscribed && setDocOutcome(Outcome.failed(pdfError));

        if (onErrorRef.current) {
          onErrorRef.current(pdfError);
        }
      }
    };

    fetchDoc();

    return () => {
      isSubscribed = false;
      if (docRef.current) {
        docRef.current.destroy();
      }
    };
  }, [src, workerUrl]);

  useEffect(() => {
    if (docOutcome.status !== 'SUCCESSFUL' || !pdfWrapperRef.current) {
      return;
    }
    const eventBus = new EventBus();
    const pdfLinkService = new PDFLinkService({
      eventBus,
    });
    pdfViewerRef.current = new PDFViewer({
      container: pdfWrapperRef.current,
      eventBus,
      linkService: pdfLinkService,
      l10n: NullL10n,
    });
    pdfLinkService.setViewer(pdfViewerRef.current);
    pdfViewerRef.current.setDocument(docRef.current);
    pdfLinkService.setDocument(docRef.current, null);
    pdfViewerRef.current.firstPagePromise.then(scaleToFit);

    if (onSuccessRef.current) {
      onSuccessRef.current();
    }
  }, [docOutcome]);

  const savePdfElement = (el: HTMLDivElement) => {
    pdfWrapperRef.current = el;
  };

  const handleZoom = (zoomLevel: ZoomLevel) => {
    pdfViewerRef.current.currentScale = zoomLevel.value;
    setZoomLevel(zoomLevel);
  };

  const scaleToFit = () => {
    if (pdfViewerRef.current) {
      pdfViewerRef.current.currentScaleValue = 'page-width';
      setZoomLevel(new ZoomLevel(pdfViewerRef.current.currentScale));
    }
  };

  return docOutcome.match({
    pending: () => <Spinner />,
    successful: () => (
      <>
        <Global styles={globalStyles} />
        <PDFWrapper data-testid="media-viewer-pdf-content" ref={savePdfElement}>
          <div
            className={pdfViewerClassName}
            onClick={closeOnDirectClick(onClose)}
          />
          <ZoomControls zoomLevel={zoomLevel} onChange={handleZoom} />
        </PDFWrapper>
      </>
    ),
    failed: (error) => {
      return (
        <ErrorMessage
          fileId={item.id}
          fileState={item}
          error={error}
          supressAnalytics={true} // item-viewer.tsx will send
        />
      );
    },
  });
};
