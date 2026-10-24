import React, { useCallback, useEffect, useRef, useState } from 'react';

import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { useThemeObserver } from '@atlaskit/tokens/use-theme-observer';

import { SmartLinkSize } from '../../constants';
import useInvokeClientAction from '../../state/hooks/use-invoke-client-action';
import { getPreviewUrlWithTheme } from '../../utils/get-preview-url-with-theme';
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
			if (visitedDisplay) {
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
			if (visitedDisplay) {
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

	const focusRef = useRef<HTMLButtonElement>(null);
	const hasRestoredFocus = useRef(false);

	useEffect(() => {
		if (!isOpen) {
			hasRestoredFocus.current = false;
			return;
		}
		const handleWindowBlur = () => {
			if (hasRestoredFocus.current) return;
			setTimeout(() => {
				// document.hasFocus() returns true when focus moved to an
				// iframe on the same page, false when the window itself
				// lost focus (e.g. user switched browser tabs)
				if (!document.hasFocus()) return;
				hasRestoredFocus.current = true;
				focusRef.current?.focus();
			}, 0);
		};
		window.addEventListener('blur', handleWindowBlur);
		return () => {
			window.removeEventListener('blur', handleWindowBlur);
		};
	}, [isOpen]);

	// `openEmbedModal` renders this modal into its own React root, outside the layering context of
	// whatever opened it (e.g. a drawer or another modal). Layered components close on Escape via
	// `window` keydown listeners, so without this they would all close on a single Escape press.
	// Handle Escape during the capture phase on `window`, close only this modal, and stop the event
	// before it reaches the layers underneath.
	// Only claim Escape while this modal is the active layer, so a dialog opened on top of it (e.g. a
	// Share dialog from the page underneath) keeps its Escape:
	// - it is in front of the modal dialog stack, which is shared across React roots (the same rule
	//   `ModalDialog` uses to decide whether it closes on Escape), and
	// - focus is inside it, or focus fell back to `<body>` after last being inside it (as the
	//   top-layer `Dialog` decides), which covers layers on top that are not modal dialogs.
	const dialogRef = useRef<HTMLElement>(null);
	// A newly opened modal dialog starts in front of the stack; `onStackChange` reports later moves.
	const stackIndexRef = useRef(0);
	const handleOnStackChange = useCallback((stackIndex: number) => {
		stackIndexRef.current = stackIndex;
	}, []);
	useEffect(() => {
		if (!isOpen || !fg('platform_sl_embed_modal_escape_isolation')) {
			return;
		}
		const isInsideDialog = (node: EventTarget | null) =>
			node instanceof Node && Boolean(dialogRef.current?.contains(node));

		let wasLastFocused = isInsideDialog(dialogRef.current?.ownerDocument.activeElement ?? null);
		const handleFocusIn = (event: FocusEvent) => {
			wasLastFocused = isInsideDialog(event.target);
		};
		const isOwnEscape = (event: KeyboardEvent) => {
			const dialog = dialogRef.current;
			if (!dialog) {
				return false;
			}
			if (event.target instanceof HTMLBodyElement || event.target instanceof HTMLHtmlElement) {
				return wasLastFocused;
			}
			return event.composedPath().includes(dialog);
		};
		const handleEscapeKeyDown = (event: KeyboardEvent) => {
			if (
				event.key !== 'Escape' ||
				event.defaultPrevented ||
				event.isComposing ||
				stackIndexRef.current !== 0 ||
				!isOwnEscape(event)
			) {
				return;
			}
			event.stopPropagation();
			handleOnClose();
		};
		window.addEventListener('focusin', handleFocusIn, { capture: true });
		window.addEventListener('keydown', handleEscapeKeyDown, { capture: true });
		return () => {
			window.removeEventListener('focusin', handleFocusIn, { capture: true });
			window.removeEventListener('keydown', handleEscapeKeyDown, { capture: true });
			stackIndexRef.current = 0;
		};
	}, [isOpen, handleOnClose]);

	return (
		<ModalTransition>
			{isOpen && (
				// eslint-disable-next-line @atlaskit/design-system/no-modal-label
				<ModalDialog
					ref={dialogRef}
					height="100%"
					onClose={handleOnClose}
					onCloseComplete={handleOnCloseComplete}
					onOpenComplete={handleOnOpenComplete}
					onStackChange={handleOnStackChange}
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
						focusRef={focusRef}
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
