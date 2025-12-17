import React, {
	createContext,
	type Dispatch,
	type SetStateAction,
	useCallback,
	useContext,
	useState,
} from 'react';

import invariant from 'tiny-invariant';

import noop from '@atlaskit/ds-lib/noop';
import { useId } from '@atlaskit/ds-lib/use-id';
import { Layering } from '@atlaskit/layering';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';
import { Manager, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';

import PopperWrapper from '../popper-wrapper';
import {
	type ContentProps,
	type PopupProps as LegacyPopupProps,
	type TriggerProps,
} from '../types';
import { usePopupAppearance } from '../use-appearance';
import { useGetMemoizedMergedTriggerRefNew } from '../use-get-memoized-merged-trigger-ref-new';

const IsOpenContext = createContext<boolean>(false);
const IdContext = createContext<string | undefined>(undefined);
const TriggerRefContext = createContext<HTMLElement | null>(null);
const SetTriggerRefContext = createContext<Dispatch<SetStateAction<HTMLElement | null>>>(noop);
const EnsureIsInsidePopupContext = createContext<boolean>(false);

// Used to ensure popup sub-components are used within a Popup
// and provide a useful error message if not.
const useEnsureIsInsidePopup = () => {
	const context = useContext(EnsureIsInsidePopupContext);
	invariant(context, 'PopupTrigger and PopupContent components must be used within a Popup');
};

export type PopupProps = {
	children: React.ReactNode;
	isOpen?: boolean;
	id?: string;
};

/**
 * __Popup__
 *
 * Popup is a composable component that provides the context for the trigger and content components.
 *
 * Usage example:
 * ```jsx
 * <Popup>
 *   <PopupTrigger>
 *     {(props) => (
 *       <button type="button" {...props}>Click me</button>
 *      )}
 *   </PopupTrigger>
 *   <PopupContent>
 *     {(props) => <div>Hello world</div>}
 *   </PopupContent>
 * </Popup>
 * ```
 */
export const Popup = ({
	children,
	id: providedId,
	isOpen = false,
}: PopupProps): React.JSX.Element => {
	const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);

	const generatedId = useId();
	const id = providedId || generatedId;

	return (
		<EnsureIsInsidePopupContext.Provider value={true}>
			<IdContext.Provider value={id}>
				<TriggerRefContext.Provider value={triggerRef}>
					<SetTriggerRefContext.Provider value={setTriggerRef}>
						<IsOpenContext.Provider value={isOpen}>
							<Manager>{children}</Manager>
						</IsOpenContext.Provider>
					</SetTriggerRefContext.Provider>
				</TriggerRefContext.Provider>
			</IdContext.Provider>
		</EnsureIsInsidePopupContext.Provider>
	);
};

export type PopupTriggerProps = {
	children: (props: TriggerProps) => React.ReactNode;
};

/**
 * __Popup trigger__
 *
 * Popup trigger is the component that renders the trigger for the popup.
 *
 * It must be a child of the Popup component.
 */
export const PopupTrigger = ({ children }: PopupTriggerProps): React.JSX.Element => {
	useEnsureIsInsidePopup();
	const id = useContext(IdContext);
	const setTriggerRef = useContext(SetTriggerRefContext);
	const isOpen = useContext(IsOpenContext);
	const getMergedTriggerRef = useGetMemoizedMergedTriggerRefNew();
	return (
		<Reference>
			{({ ref }) =>
				children({
					ref: getMergedTriggerRef(ref, setTriggerRef),
					'aria-controls': id,
					'aria-expanded': isOpen,
					'aria-haspopup': true,
				})
			}
		</Reference>
	);
};

const defaultLayer = 400;

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
 * Disables popper.js GPU acceleration for this popup.
 * This means only positioning will be used, without any transforms.
 *
 * Performance will be degraded if the popup is expected to move.
 */
const shouldDisableGpuAccelerationModifiers = [
	{
		name: 'computeStyles',
		options: {
			gpuAcceleration: false,
		},
	},
];

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

	useNotifyOpenLayerObserver({ isOpen, onClose: handleOpenLayerObserverCloseSignal });

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
			/>
		</Layering>
	);

	if (shouldRenderToParent) {
		return popperWrapper;
	}

	return <Portal zIndex={zIndex}>{popperWrapper}</Portal>;
};
