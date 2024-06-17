import React, { useEffect, useRef, useState } from 'react';
import { type FileState } from '@atlaskit/media-client';
import { token } from '@atlaskit/tokens';
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
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles, @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, Global } from '@emotion/react';
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

export const pdfViewerClassName = 'pdfViewer';

// Styles are partially copied from https://github.com/mozilla/pdfjs-dist/blob/v2.9.359/web/pdf_viewer.css
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage/preview */
const globalStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	[`.${pdfViewerClassName}`]: {
		marginTop: token('space.800', '64px'),
		marginBottom: token('space.800', '64px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.page': {
			margin: `1px auto ${token('space.negative.100', '-8px')} auto`,
			border: '9px solid transparent',
			position: 'relative',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.canvasWrapper': {
			overflow: 'hidden',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.textLayer': {
			position: 'absolute',
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			overflow: 'hidden',
			opacity: 0.2,
			lineHeight: 1,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.textLayer span, .textLayer br': {
			color: 'transparent',
			position: 'absolute',
			whiteSpace: 'pre',
			cursor: 'text',
			transformOrigin: '0% 0%',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'.textLayer ::-moz-selection': {
			background: 'rgba(0, 0, 255, 1)',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.textLayer ::selection': {
			background: 'rgba(0, 0, 255, 1)',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.annotationLayer section': {
			position: 'absolute',
			textAlign: 'initial',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.annotationLayer .linkAnnotation > a, .annotationLayer .buttonWidgetAnnotation.pushButton > a':
			{
				position: 'absolute',
				fontSize: '1em',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.annotationLayer .linkAnnotation > a:hover, .annotationLayer .buttonWidgetAnnotation.pushButton > a:hover':
			{
				opacity: 0.2,
				background: 'rgba(255, 255, 0, 1)',
				boxShadow: '0 2px 10px rgba(255, 255, 0, 1)',
			},
	},
});

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

	useEffect(() => {
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
	}, [createAnalyticsEvent, docOutcome]);

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
			<>
				<Global styles={globalStyles} />
				<PDFWrapper data-testid="media-viewer-pdf-content" ref={savePdfElement}>
					{
						// eslint-disable-next-line @atlaskit/design-system/prefer-primitives
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={pdfViewerClassName}
							onClick={closeOnDirectClick(onClose)}
						/>
					}
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

export const PDFRenderer = withAnalyticsEvents()(PDFRendererBase);
