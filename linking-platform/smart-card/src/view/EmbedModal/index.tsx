import React, { useCallback, useRef, useState } from 'react';

import ModalDialog, { ModalBody, ModalTransition } from '@atlaskit/modal-dialog';
import { useThemeObserver } from '@atlaskit/tokens';

import { ActionName, CardDisplay } from '../../constants';
import useInvokeClientAction from '../../state/hooks/use-invoke-client-action';
import { downloadUrl, getPreviewUrlWithTheme, openUrl } from '../../utils';

import withAnalytics from './components/analytics';
import EmbedContent from './components/embed-content';
import withErrorBoundary from './components/error-boundary';
import LinkInfo from './components/link-info';
import { MAX_MODAL_SIZE, MIN_MODAL_SIZE } from './constants';
import { type EmbedModalProps, EmbedModalSize } from './types';



const toSize = (width: string) =>
	width === MAX_MODAL_SIZE ? EmbedModalSize.Large : EmbedModalSize.Small;

const toWidth = (size: EmbedModalSize) =>
	size === EmbedModalSize.Large ? MAX_MODAL_SIZE : MIN_MODAL_SIZE;

const EmbedModal = ({
	analytics,
	download,
	extensionKey,
	icon,
	iframeName,
	isSupportTheming,
	isTrusted = false,
	onClose,
	onOpen,
	onResize,
	providerName,
	showModal,
	size = EmbedModalSize.Large,
	src,
	testId = 'smart-embed-preview-modal',
	title,
	url,
}: EmbedModalProps) => {
	const defaultWidth = toWidth(size);
	const [isOpen, setIsOpen] = useState(showModal);
	const [width, setWidth] = useState(defaultWidth);
	const openAt = useRef<number>();

	const invoke = useInvokeClientAction({ analytics });

	const handleOnOpenComplete = useCallback(() => {
		openAt.current = Date.now();
		if (onOpen) {
			onOpen({ size });
		}
	}, [onOpen, size]);

	const handleOnClose = useCallback(() => setIsOpen(false), []);

	const handleOnCloseComplete = useCallback(() => {
		if (onClose) {
			const duration = openAt.current ? Date.now() - openAt.current : undefined;
			onClose({ duration, size: toSize(width) });
		}
	}, [onClose, width]);

	const handleOnResizeClick = useCallback(() => {
		const newWidth = width === MIN_MODAL_SIZE ? MAX_MODAL_SIZE : MIN_MODAL_SIZE;
		setWidth(newWidth);

		if (onResize) {
			onResize({ size: toSize(newWidth) });
		}
	}, [onResize, width]);

	const themeState = useThemeObserver();
	let previewUrl = src;

	const handleOnViewActionClick = useCallback(() => {
		invoke({
			actionType: 'ViewAction',
			actionFn: async () => openUrl(url),
			display: CardDisplay.EmbedPreview,
			extensionKey,
		});
	}, [extensionKey, invoke, url]);

	const handleOnDownloadActionClick = useCallback(() => {
		invoke({
			actionType: ActionName.DownloadAction,
			actionFn: async () => downloadUrl(download),
			display: CardDisplay.EmbedPreview,
			extensionKey,
		});
	}, [download, extensionKey, invoke]);

	if (previewUrl && isSupportTheming) {
		previewUrl = getPreviewUrlWithTheme(previewUrl, themeState);
	}

	return (
		<ModalTransition>
			{isOpen && (
				<ModalDialog
					height="100%"
					onClose={handleOnClose}
					onCloseComplete={handleOnCloseComplete}
					onOpenComplete={handleOnOpenComplete}
					testId={testId}
					width={width}
				>
					<LinkInfo
						icon={icon}
						providerName={providerName}
						onViewButtonClick={url ? handleOnViewActionClick : undefined}
						onDownloadButtonClick={download ? handleOnDownloadActionClick : undefined}
						onResizeButtonClick={handleOnResizeClick}
						size={width}
						title={title}
						testId={testId}
					/>
					<ModalBody>
						<EmbedContent
							isTrusted={isTrusted}
							name={iframeName}
							src={previewUrl}
							testId={testId}
						/>
					</ModalBody>
				</ModalDialog>
			)}
		</ModalTransition>
	);
};

export default withAnalytics(withErrorBoundary(EmbedModal));
