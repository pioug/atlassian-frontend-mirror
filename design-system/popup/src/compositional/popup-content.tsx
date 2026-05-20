import React, { useCallback, useContext } from 'react';

import { Layering } from '@atlaskit/layering';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { fg } from '@atlaskit/platform-feature-flags';
import Portal from '@atlaskit/portal';

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

/**
 * __Popup content__
 *
 * Popup content is the component that renders the content of the popup.
 *
 * It must be a child of the Popup component.
 */
export const PopupContent = ({
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
	shouldRenderToParent: inShouldRenderToParent,
	shouldDisableFocusLock = false,
	shouldFitContainer,
	shouldFitViewport,
	shouldDisableGpuAcceleration = false,
	role,
	label,
	titleId,
}: PopupContentProps): React.JSX.Element | null => {
	useEnsureIsInsidePopup();
	const isOpen = useContext(IsOpenContext);
	const id = useContext(IdContext);
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

	// Top-layer rendering path: native Popover API via @atlaskit/top-layer.
	// Mirrors the FF branch in the legacy `Popup` component (popup.tsx).
	if (fg('platform-dst-top-layer')) {
		return (
			<PopupContentTopLayer
				xcss={xcss}
				appearance={inAppearance}
				offset={offset}
				onClose={onClose}
				testId={testId}
				placement={placement}
				fallbackPlacements={fallbackPlacements}
				popupComponent={popupComponent}
				autoFocus={autoFocus}
				shouldFitContainer={shouldFitContainer}
				shouldFitViewport={shouldFitViewport}
				role={role}
				label={label}
				titleId={titleId}
				zIndex={zIndex}
				shouldRenderToParent={inShouldRenderToParent}
				strategy={strategy}
				boundary={boundary}
				rootBoundary={rootBoundary}
				shouldUseCaptureOnOutsideClick={shouldUseCaptureOnOutsideClick}
				shouldDisableFocusLock={shouldDisableFocusLock}
				shouldFlip={shouldFlip}
				shouldDisableGpuAcceleration={shouldDisableGpuAcceleration}
				isOpen={isOpen}
				id={id}
			>
				{children}
			</PopupContentTopLayer>
		);
	}

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
};
