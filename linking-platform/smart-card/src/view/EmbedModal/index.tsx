import React, { useCallback, useRef, useState } from 'react';

import ModalDialog, { ModalBody, ModalTransition } from '@atlaskit/modal-dialog';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { useThemeObserver } from '@atlaskit/tokens';

import { SmartLinkSize } from '../../constants';
import useInvokeClientAction from '../../state/hooks/use-invoke-client-action';
import { getPreviewUrlWithTheme } from '../../utils';
import { BaseIconElement } from '../FlexibleCard/components/elements/common';

import withAnalytics from './components/analytics';
import type { WithAnalytics } from './components/analytics/types';
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
	invokeDownloadAction,
	fireEvent,
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
	invokeViewAction,
	extensionKey,
	isBlanketHidden,
}: EmbedModalProps) => {
	const defaultWidth = toWidth(size);
	const [isOpen, setIsOpen] = useState(showModal);
	const [width, setWidth] = useState(defaultWidth);
	const openAt = useRef<number>();

	const invoke = useInvokeClientAction({ fireEvent });

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

		if (invokeViewAction) {
			const visitedDisplay =
				invokeViewAction.display && invokeViewAction.display !== 'url'
					? invokeViewAction.display
					: null;
			if (
				visitedDisplay &&
				expValEquals('cc_integrations_editor_open_link_click_analytics', 'isEnabled', true)
			) {
				fireEvent?.('track.smartLink.visited', {
					id: invokeViewAction.id ?? iframeName,
					display: visitedDisplay,
					definitionId: invokeViewAction.definitionId ?? null,
				});
			}
		}
	}, [fireEvent, iframeName, invokeViewAction, onResize, width]);

	const themeState = useThemeObserver();
	let previewUrl = src;

	const handleOnViewActionClick = useCallback(() => {
		if (invokeViewAction) {
			invoke(invokeViewAction);
			const visitedDisplay =
				invokeViewAction.display && invokeViewAction.display !== 'url'
					? invokeViewAction.display
					: null;
			if (
				visitedDisplay &&
				expValEquals('cc_integrations_editor_open_link_click_analytics', 'isEnabled', true)
			) {
				fireEvent?.('track.smartLink.visited', {
					id: invokeViewAction.id ?? iframeName,
					display: visitedDisplay,
					definitionId: invokeViewAction.definitionId ?? null,
				});
			}
		}
	}, [fireEvent, iframeName, invoke, invokeViewAction]);

	const handleOnDownloadActionClick = useCallback(() => {
		invokeDownloadAction && invoke(invokeDownloadAction);
	}, [invokeDownloadAction, invoke]);

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
					label={title}
					isBlanketHidden={isBlanketHidden}
				>
					<LinkInfo
						icon={
							linkIcon && {
								icon: <BaseIconElement {...linkIcon} size={SmartLinkSize.Large} />,
								isFlexibleUi: true,
							}
						}
						providerName={providerName}
						onViewButtonClick={invokeViewAction ? handleOnViewActionClick : undefined}
						onDownloadButtonClick={invokeDownloadAction ? handleOnDownloadActionClick : undefined}
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
							ariaLabel={title}
							extensionKey={extensionKey}
						/>
					</ModalBody>
				</ModalDialog>
			)}
		</ModalTransition>
	);
};

const _default_1: (props: EmbedModalProps & WithAnalytics) => React.JSX.Element = withAnalytics(
	withErrorBoundary(EmbedModal),
);
export default _default_1;
