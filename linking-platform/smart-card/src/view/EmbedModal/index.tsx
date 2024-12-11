import React, { useCallback, useRef, useState } from 'react';

import ModalDialog, { ModalBody, ModalTransition } from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import { useThemeObserver } from '@atlaskit/tokens';

import { ActionName, CardDisplay, SmartLinkSize } from '../../constants';
import useInvokeClientAction from '../../state/hooks/use-invoke-client-action';
import { downloadUrl, getPreviewUrlWithTheme, openUrl } from '../../utils';
import Icon from '../FlexibleCard/components/elements/icon';

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
	invokeDownloadAction,
	extensionKey,
	fireEvent,
	icon,
	iframeName,
	isSupportTheming,
	isTrusted = false,
	linkIcon,
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
	invokeViewAction,
}: EmbedModalProps) => {
	const defaultWidth = toWidth(size);
	const [isOpen, setIsOpen] = useState(showModal);
	const [width, setWidth] = useState(defaultWidth);
	const openAt = useRef<number>();

	const invoke = useInvokeClientAction({ analytics, fireEvent });

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
		if (fg('platform-smart-card-migrate-embed-modal-analytics')) {
			invokeViewAction && invoke(invokeViewAction);
		} else {
			invoke({
				actionType: 'ViewAction',
				actionFn: async () => openUrl(url),
				display: CardDisplay.EmbedPreview,
				extensionKey,
			});
		}
	}, [extensionKey, invoke, url, invokeViewAction]);

	const handleOnDownloadActionClick = useCallback(() => {
		if (fg('platform-smart-card-migrate-embed-modal-analytics')) {
			invokeDownloadAction && invoke(invokeDownloadAction);
		} else {
			invoke({
				actionType: ActionName.DownloadAction,
				actionFn: async () => downloadUrl(download),
				display: CardDisplay.EmbedPreview,
				extensionKey,
			});
		}
	}, [download, invokeDownloadAction, extensionKey, invoke]);

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
						icon={
							fg('platform-smart-card-migrate-embed-modal-analytics')
								? linkIcon
									? {
											icon: <Icon {...linkIcon} size={SmartLinkSize.Large} />,
											isFlexibleUi: true,
										}
									: undefined
								: icon
						}
						providerName={providerName}
						onViewButtonClick={
							fg('platform-smart-card-migrate-embed-modal-analytics')
								? invokeViewAction
									? handleOnViewActionClick
									: undefined
								: url
									? handleOnViewActionClick
									: undefined
						}
						onDownloadButtonClick={
							fg('platform-smart-card-migrate-embed-modal-analytics')
								? invokeDownloadAction
									? handleOnDownloadActionClick
									: undefined
								: download
									? handleOnDownloadActionClick
									: undefined
						}
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
