import React, { useEffect, useRef, useState } from 'react';
import { type FileState } from '@atlaskit/media-client';
import { PDFViewer, EventBus, PDFLinkService, NullL10n } from 'pdfjs-dist/legacy/web/pdf_viewer';
import {
	getDocument,
	GlobalWorkerOptions,
	CMapCompressionType,
	PasswordResponses,
} from 'pdfjs-dist/legacy/build/pdf';
import { withAnalyticsEvents, type WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { cmap } from './cmaps';
import type { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf';
import { ZoomControls } from '../../zoomControls';
import { PDFWrapper } from '../../styleWrappers';
import { closeOnDirectClick } from '../../utils/closeOnDirectClick';
import { Outcome } from '../../domain';
import { Spinner } from '../../loading';
import ErrorMessage from '../../errorMessage';
import { type MediaViewerError } from '../../errors';
import { ZoomLevel } from '../../domain/zoomLevel';
import { processError } from './processError';
import { pdfJs } from './pdfJs';
import { extractCompressedBase64 } from './extractCompressedBase64';
import { PDFPasswordInput } from './pdfPasswordInput';
import { fireAnalytics } from '../../analytics';
import { createPdfPasswordInputScreenEvent } from '../../analytics/events/screen/pdfPasswordInput';
import { createPasswordPdfScreenEvent } from '../../analytics/events/screen/passwordPdf';
import { PDFRendererWrapper } from './pdfRendererWrapper';

export const pdfViewerClassName = 'pdfViewer';

export type Props = {
	item: FileState;
	src: string;
	workerUrl?: string;
	onClose?: () => void;
	onSuccess?: () => void;
	onError?: (error: MediaViewerError) => void;
} & WithAnalyticsEventsProps;

class CmapFactory {
	constructor() {}
	async fetch({ name }: { name: string }) {
		const module = await cmap[name]();
		const data = await extractCompressedBase64(module.default);
		return { cMapData: data, compressionType: CMapCompressionType.BINARY };
	}
}

let defaultWorkerUrl = '';

const PDFRendererBase = ({
	src,
	onClose,
	onSuccess,
	onError,
	workerUrl,
	item,
	createAnalyticsEvent,
}: Props) => {
	const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(new ZoomLevel(1));
	const [docOutcome, setDocOutcome] = useState<Outcome<any, MediaViewerError>>(Outcome.pending());
	const isPasswordPdfRef = useRef(false);
	const [passwordProtected, setPasswordProtected] = useState(false);
	const [hasPasswordError, setHasPasswordError] = useState(false);

	const pdfWrapperRef = useRef<HTMLDivElement>();
	const docRef = useRef<PDFDocumentProxy>();
	const pdfViewerRef = useRef<any>();
	const onSuccessRef = useRef<(() => void) | undefined>(onSuccess);
	onSuccessRef.current = onSuccess;
	const updatePasswordRef = useRef<((password: string) => void) | undefined>(undefined);
	const onErrorRef = useRef<((error: MediaViewerError) => void) | undefined>(onError);
	onErrorRef.current = onError;
	const existingGlobalWorkerRef = useRef<any>(undefined);

	useEffect(() => {
		/**
		 * CXP-4622: Fixes issue of PDF.js reusing the global worker registered by embeded PDF macro in confluence
		 * The global worker will likely be a different version and thus throw an error.
		 * This will remove the worker on mount and will re-register it on unmount
		 */
		const { pdfjsWorker } = window as any;
		if (pdfjsWorker) {
			existingGlobalWorkerRef.current = pdfjsWorker;
			(window as any).pdfjsWorker = undefined;
		}

		let isSubscribed = true;
		const fetchDoc = async () => {
			try {
				if (!workerUrl && !defaultWorkerUrl) {
					const blob = await extractCompressedBase64(pdfJs, 'blob');
					defaultWorkerUrl = URL.createObjectURL(blob);
				}
				GlobalWorkerOptions.workerSrc = workerUrl ?? defaultWorkerUrl;
				const getDocumentTask = getDocument({
					url: src,
					CMapReaderFactory: CmapFactory,
					isEvalSupported: false,
				});

				getDocumentTask.onPassword = (updatePassword: (password: string) => void, e: number) => {
					updatePasswordRef.current = updatePassword;
					if (e === PasswordResponses.NEED_PASSWORD) {
						isPasswordPdfRef.current = true;
						setPasswordProtected(true);
					} else {
						setHasPasswordError(true);
					}
				};

				docRef.current = await getDocumentTask.promise;
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
			(window as any).pdfjsWorker = existingGlobalWorkerRef.current;
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

		if (isPasswordPdfRef.current) {
			fireAnalytics(createPasswordPdfScreenEvent(), createAnalyticsEvent);
		}
		if (onSuccessRef.current) {
			onSuccessRef.current();
		}
	}, [createAnalyticsEvent, docOutcome.status]);

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
		pending: () =>
			passwordProtected ? (
				<PDFPasswordInput
					onRender={() => fireAnalytics(createPdfPasswordInputScreenEvent(), createAnalyticsEvent)}
					onSubmit={(data: { password: string }) => {
						// Reset hasPasswordError on each submission
						hasPasswordError && setHasPasswordError(false);
						updatePasswordRef.current?.(data.password);
					}}
					hasPasswordError={hasPasswordError}
				/>
			) : (
				<Spinner />
			),
		successful: () => (
			<PDFRendererWrapper>
				<PDFWrapper data-testid="media-viewer-pdf-content" ref={savePdfElement}>
					{
						// eslint-disable-next-line @atlaskit/design-system/prefer-primitives, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, @atlassian/a11y/interactive-element-not-keyboard-focusable
						<div
							// eslint-disable-next-line @atlassian/a11y/interactive-element-not-keyboard-focusable, @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={pdfViewerClassName}
							onClick={closeOnDirectClick(onClose)}
						/>
					}
					<ZoomControls zoomLevel={zoomLevel} onChange={handleZoom} />
				</PDFWrapper>
			</PDFRendererWrapper>
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

export const PDFRenderer = withAnalyticsEvents()(PDFRendererBase);
