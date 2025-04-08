/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, memo, useCallback, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { useId } from '@atlaskit/ds-lib/use-id';
import { Layering } from '@atlaskit/layering';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { fg } from '@atlaskit/platform-feature-flags';
import { Manager, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { Box } from '@atlaskit/primitives/compiled';

import PopperWrapper from './popper-wrapper';
import { type PopupProps } from './types';
import { usePopupAppearance } from './use-appearance';
import { useGetMemoizedMergedTriggerRef } from './use-get-memoized-merged-trigger-ref';
import { useGetMemoizedMergedTriggerRefNew } from './use-get-memoized-merged-trigger-ref-new';

const defaultLayer = 400;

const wrapperStyles = cssMap({
	root: {
		position: 'relative',
	},
});

export const Popup: FC<PopupProps> = memo(
	({
		xcss,
		appearance: inAppearance = 'default',
		isOpen,
		id: providedId,
		offset,
		testId,
		trigger,
		content,
		onClose,
		boundary,
		rootBoundary = 'viewport',
		shouldFlip = true,
		placement = 'auto',
		fallbackPlacements,
		popupComponent: PopupContainer,
		autoFocus = true,
		zIndex = defaultLayer,
		shouldUseCaptureOnOutsideClick = false,
		shouldRenderToParent: inShouldRenderToParent = false,
		shouldFitContainer = false,
		shouldDisableFocusLock = false,
		shouldReturnFocus = true,
		strategy,
		role,
		label,
		titleId,
		modifiers,
		shouldFitViewport,
	}: PopupProps) => {
		const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);
		const getMergedTriggerRef = useGetMemoizedMergedTriggerRef();
		const getMergedTriggerRefNew = useGetMemoizedMergedTriggerRefNew();
		const generatedId = useId();
		const { appearance, shouldRenderToParent } = usePopupAppearance({
			appearance: inAppearance,
			shouldRenderToParent: inShouldRenderToParent,
		});

		const id = providedId || generatedId;

		const handleOpenLayerObserverCloseSignal = useCallback(() => {
			onClose?.(null);
		}, [onClose]);

		useNotifyOpenLayerObserver({ isOpen, onClose: handleOpenLayerObserverCloseSignal });

		const renderPopperWrapper = (
			<Layering isDisabled={false}>
				<PopperWrapper
					xcss={xcss}
					appearance={appearance}
					content={content}
					isOpen={isOpen}
					placement={placement}
					fallbackPlacements={fallbackPlacements}
					boundary={boundary}
					rootBoundary={rootBoundary}
					shouldFlip={shouldFlip}
					offset={offset}
					popupComponent={PopupContainer}
					id={id}
					testId={testId}
					onClose={onClose}
					autoFocus={autoFocus}
					shouldUseCaptureOnOutsideClick={shouldUseCaptureOnOutsideClick}
					shouldRenderToParent={shouldRenderToParent || shouldFitContainer}
					shouldFitContainer={shouldFitContainer}
					shouldDisableFocusLock={shouldDisableFocusLock}
					shouldReturnFocus={shouldReturnFocus}
					triggerRef={triggerRef}
					strategy={shouldFitContainer ? 'absolute' : strategy}
					role={role}
					label={label}
					titleId={titleId}
					modifiers={modifiers}
					shouldFitViewport={shouldFitViewport}
				/>
			</Layering>
		);

		const popupContent = (
			<Manager>
				<Reference>
					{({ ref }) => {
						return trigger({
							ref: !fg('platform-design-system-popup-ref')
								? getMergedTriggerRef(ref, setTriggerRef, isOpen)
								: getMergedTriggerRefNew(ref, setTriggerRef),
							'aria-controls': isOpen ? id : undefined,
							'aria-expanded': isOpen,
							'aria-haspopup':
								role === 'dialog' && fg('platform_dst_popup-disable-focuslock') ? 'dialog' : true,
						});
					}}
				</Reference>
				{isOpen &&
					(shouldRenderToParent || shouldFitContainer ? (
						renderPopperWrapper
					) : (
						<Portal zIndex={zIndex}>{renderPopperWrapper}</Portal>
					))}
			</Manager>
		);

		if (shouldFitContainer) {
			return <Box xcss={wrapperStyles.root}>{popupContent}</Box>;
		}

		return popupContent;
	},
);
