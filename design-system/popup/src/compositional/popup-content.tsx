import React, { useCallback, useContext } from 'react';

import { Layering } from '@atlaskit/layering/layering';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/use-notify-open-layer-observer';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import Portal from '@atlaskit/portal/portal';

import PopperWrapper from '../popper-wrapper';
import { type ContentProps, type PopupProps as LegacyPopupProps } from '../types';
import { usePopupAppearance } from '../use-appearance';

import { IdContext } from './id-context';
import { IsOpenContext } from './is-open-context';
import { PopupContentTopLayer } from './popup-content-top-layer';
import { TriggerRefContext } from './trigger-ref-context';
import { useEnsureIsInsidePopup } from './use-ensure-is-inside-popup';

const defaultLayer = 400;
const shouldDisableGpuAccelerationModifiers = [
	{
		name: 'computeStyles',
		options: {
			gpuAcceleration: false,
		},
	},
];

type CommonContentPopupProps = Pick<
	LegacyPopupProps,
	| 'xcss'
	| 'appearance'
	| 'boundary'
	| 'offset'
	| 'onClose'
	| 'testId'
	| 'placement'
	| 'fallbackPlacements'
	| 'popupComponent'
	| 'shouldFlip'
	| 'rootBoundary'
	| 'autoFocus'
	| 'shouldRenderToParent'
	| 'shouldUseCaptureOnOutsideClick'
	| 'shouldIgnoreCloseEvent'
	| 'shouldDisableFocusLock'
	| 'strategy'
	| 'zIndex'
	| 'shouldFitViewport'
	| 'role'
	| 'label'
	| 'titleId'
> & {
	// This type has been kept the same as the Popup `content` prop for now.
	// It could be nice to also support ReactNode e.g. `ReactNode | ((props: ContentProps) => ReactNode)`,
	// so that consumers don't need to use a function when they are not using the props that are passed.
	children: (props: ContentProps) => React.ReactNode;

	/**
	 * ___Use with caution___
	 *
	 * Disables popper.js GPU acceleration for this popup.
	 * This means only positioning will be used, without any transforms.
	 *
	 * Performance will be degraded if the popup is expected to move.
	 *
	 * This should almost never be used, but is sometimes needed
	 * to resolve layering issues.
	 */
	shouldDisableGpuAcceleration?: boolean;
};

type ShouldFitContainerContentPopupProps = CommonContentPopupProps & {
	shouldFitContainer: true;
	shouldRenderToParent?: true;
	strategy?: 'absolute';
};

type StandardPopupContentProps = CommonContentPopupProps & {
	shouldFitContainer?: false;
};

export type PopupContentProps = ShouldFitContainerContentPopupProps | StandardPopupContentProps;

type TPopupContentLegacyProps = PopupContentProps & {
	isOpen: boolean;
	id: string | undefined;
};

/**
 * Legacy (Popper + Portal) implementation of the compositional PopupContent.
 *
 * Renders when the `platform-dst-top-layer` flag is off. This component owns
 * the open layer observer registration, which on the top-layer path is handled
 * by the `Popover` primitive inside `PopupContentTopLayer` instead.
 */
function PopupContentLegacy({
	xcss,
	appearance: inAppearance = 'default',
	children,
	boundary,
	offset,
	strategy,
	onClose,
	testId,
	rootBoundary = 'viewport',
	shouldFlip = true,
	placement = 'auto',
	fallbackPlacements,
	popupComponent,
	autoFocus = true,
	zIndex = defaultLayer,
	shouldUseCaptureOnOutsideClick = false,
	shouldIgnoreCloseEvent,
	shouldRenderToParent: inShouldRenderToParent,
	shouldDisableFocusLock = false,
	shouldFitContainer,
	shouldFitViewport,
	shouldDisableGpuAcceleration = false,
	role,
	titleId,
	isOpen,
	id,
}: TPopupContentLegacyProps): React.ReactNode {
	const triggerRef = useContext(TriggerRefContext);
	const { appearance, shouldRenderToParent } = usePopupAppearance({
		appearance: inAppearance,
		shouldRenderToParent: inShouldRenderToParent,
	});

	const handleOpenLayerObserverCloseSignal = useCallback(() => {
		onClose?.(null);
	}, [onClose]);

	useNotifyOpenLayerObserver({
		isOpen,
		onClose: handleOpenLayerObserverCloseSignal,
		type: 'popup',
	});

	if (!isOpen) {
		return null;
	}

	const popperWrapper = (
		<Layering isDisabled={false}>
			<PopperWrapper
				xcss={xcss}
				appearance={appearance}
				content={children}
				isOpen={isOpen}
				placement={placement}
				fallbackPlacements={fallbackPlacements}
				boundary={boundary}
				rootBoundary={rootBoundary}
				shouldFlip={shouldFlip}
				offset={offset}
				popupComponent={popupComponent}
				id={id}
				testId={testId}
				onClose={onClose}
				autoFocus={autoFocus}
				shouldFitContainer={shouldFitContainer}
				shouldUseCaptureOnOutsideClick={shouldUseCaptureOnOutsideClick}
				shouldIgnoreCloseEvent={shouldIgnoreCloseEvent}
				shouldRenderToParent={shouldRenderToParent}
				shouldDisableFocusLock={shouldDisableFocusLock}
				triggerRef={triggerRef}
				strategy={strategy}
				shouldFitViewport={shouldFitViewport}
				modifiers={shouldDisableGpuAcceleration ? shouldDisableGpuAccelerationModifiers : undefined}
				role={role}
				titleId={titleId}
			/>
		</Layering>
	);

	if (shouldRenderToParent) {
		return popperWrapper;
	}

	return <Portal zIndex={zIndex}>{popperWrapper}</Portal>;
}

/**
 * __Popup content__
 *
 * Popup content is the component that renders the content of the popup.
 *
 * It must be a child of the Popup component.
 */
export function PopupContent(props: PopupContentProps): React.ReactNode {
	useEnsureIsInsidePopup();
	const isOpen = useContext(IsOpenContext);
	const id = useContext(IdContext);

	// Select the rendering implementation at the component boundary rather than
	// gating hooks inside a single component. Each implementation owns its own
	// hooks, so a runtime feature-flag change swaps component types (a clean
	// remount) instead of changing the hook order of a mounted component.
	//
	// Forwarding the full props onto the chosen implementation is intentional:
	// both implementations declare explicit prop types, so the forward is type
	// checked rather than an unbounded API.
	if (fg('platform-dst-top-layer')) {
		// The top-layer Popover registers with the open layer observer itself.
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- intentional forward to a typed implementation
		return <PopupContentTopLayer {...props} isOpen={isOpen} id={id} />;
	}

	// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props -- intentional forward to a typed implementation
	return <PopupContentLegacy {...props} isOpen={isOpen} id={id} />;
}
