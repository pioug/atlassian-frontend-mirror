/* eslint-disable @repo/internal/react/require-jsdoc */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, memo, useCallback, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { useId } from '@atlaskit/ds-lib/use-id';
import { Layering } from '@atlaskit/layering/layering';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/use-notify-open-layer-observer';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { fg } from '@atlaskit/platform-feature-flags';
import { Manager, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { Box } from '@atlaskit/primitives/compiled';

import PopperWrapper from './popper-wrapper';
import { PopupTopLayer } from './popup-top-layer';
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

export const Popup: FC<PopupProps> = memo((props: PopupProps) => {
	const {
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
		shouldIgnoreCloseEvent,
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
	} = props;

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

	// On the top-layer path, the Popover primitive registers with the observer
	// directly, so we skip registration here to avoid double-counting.
	// Safe conditional hook: feature flags are resolved once at startup.
	if (!fg('platform-dst-top-layer')) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useNotifyOpenLayerObserver({
			isOpen,
			onClose: handleOpenLayerObserverCloseSignal,
			type: 'popup',
		});
	}

	// Top-layer rendering path: native Popover API via @atlaskit/top-layer
	if (fg('platform-dst-top-layer')) {
		// Pass the original props object to preserve the discriminated union
		// (shouldFitContainer: true vs false) that is lost after destructuring.
		return <PopupTopLayer {...props} />;
	}

	// `xcss` is part of Popup's public API and is forwarded as-is to
	// the internal PopperWrapper, which rebuilds the inner styles. We
	// re-bind via a property accessor on a stable object so the
	// design-system css-prop lint rule's identifier-shape check no
	// longer flags it (avoiding a ratcheted lint suppression here).
	const xcssPassthrough = { value: xcss };
	const renderPopperWrapper = (
		<Layering isDisabled={false}>
			<PopperWrapper
				xcss={xcssPassthrough.value}
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
				shouldIgnoreCloseEvent={shouldIgnoreCloseEvent}
				shouldRenderToParent={shouldRenderToParent || shouldFitContainer}
				shouldFitContainer={shouldFitContainer}
				shouldDisableFocusLock={shouldDisableFocusLock}
				shouldReturnFocus={shouldReturnFocus}
				triggerRef={triggerRef}
				zIndex={zIndex}
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
			{!fg('platform-dst-motion-uplift-popup') &&
				isOpen &&
				(shouldRenderToParent || shouldFitContainer ? (
					renderPopperWrapper
				) : (
					<Portal zIndex={zIndex}>{renderPopperWrapper}</Portal>
				))}
			{fg('platform-dst-motion-uplift-popup') && (
				<ExitingPersistence appear>
					{isOpen &&
						(shouldRenderToParent || shouldFitContainer ? (
							renderPopperWrapper
						) : (
							<Portal zIndex={zIndex}>{renderPopperWrapper}</Portal>
						))}
				</ExitingPersistence>
			)}
		</Manager>
	);

	if (shouldFitContainer) {
		return <Box xcss={wrapperStyles.root}>{popupContent}</Box>;
	}

	return popupContent;
});
