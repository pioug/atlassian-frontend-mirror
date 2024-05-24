import React, {
  createContext,
  type Dispatch,
  type SetStateAction,
  useContext,
  useState,
} from 'react';

import { useUID } from 'react-uid';
import invariant from 'tiny-invariant';

import noop from '@atlaskit/ds-lib/noop';
import { UNSAFE_LAYERING } from '@atlaskit/layering';
import { Manager, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import PopperWrapper from '../popper-wrapper';
import {
  type ContentProps,
  type PopupProps as LegacyPopupProps,
  type TriggerProps,
} from '../types';
import { useGetMemoizedMergedTriggerRef } from '../use-get-memoized-merged-trigger-ref';

const IsOpenContext = createContext<boolean>(false);
const IdContext = createContext<string | undefined>(undefined);
const TriggerRefContext = createContext<HTMLElement | null>(null);
const SetTriggerRefContext =
  createContext<Dispatch<SetStateAction<HTMLElement | null>>>(noop);
const EnsureIsInsidePopupContext = createContext<boolean>(false);

// Used to ensure popup sub-components are used within a Popup
// and provide a useful error message if not.
const useEnsureIsInsidePopup = () => {
  const context = useContext(EnsureIsInsidePopupContext);
  invariant(
    context,
    'PopupTrigger and PopupContent components must be used within a Popup',
  );
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
}: PopupProps) => {
  const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);

  const generatedId = useUID();
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
export const PopupTrigger = ({ children }: PopupTriggerProps) => {
  useEnsureIsInsidePopup();
  const isOpen = useContext(IsOpenContext);
  const id = useContext(IdContext);
  const setTriggerRef = useContext(SetTriggerRefContext);
  const getMergedTriggerRef = useGetMemoizedMergedTriggerRef();

  return (
    <Reference>
      {({ ref }) =>
        children({
          ref: getMergedTriggerRef(ref, setTriggerRef, isOpen),
          'aria-controls': id,
          'aria-expanded': isOpen,
          'aria-haspopup': true,
        })
      }
    </Reference>
  );
};

const defaultLayer = layers.layer();

export type PopupContentProps = Pick<
  LegacyPopupProps,
  | 'boundary'
  | 'offset'
  | 'strategy'
  | 'onClose'
  | 'testId'
  | 'placement'
  | 'fallbackPlacements'
  | 'popupComponent'
  | 'shouldFlip'
  | 'rootBoundary'
  | 'autoFocus'
  | 'shouldUseCaptureOnOutsideClick'
  | 'shouldRenderToParent'
  | 'shouldDisableFocusLock'
  | 'zIndex'
> & {
  // This type has been kept the same as the Popup `content` prop for now.
  // It could be nice to also support ReactNode e.g. `ReactNode | ((props: ContentProps) => ReactNode)`,
  // so that consumers don't need to use a function when they are not using the props that are passed.
  children: (props: ContentProps) => React.ReactNode;
};

/**
 * __Popup content__
 *
 * Popup content is the component that renders the content of the popup.
 *
 * It must be a child of the Popup component.
 */
export const PopupContent = ({
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
  shouldRenderToParent = false,
  shouldDisableFocusLock = false,
}: PopupContentProps) => {
  useEnsureIsInsidePopup();
  const isOpen = useContext(IsOpenContext);
  const id = useContext(IdContext);
  const triggerRef = useContext(TriggerRefContext);

  if (!isOpen) {
    return null;
  }

  const popperWrapper = (
    <UNSAFE_LAYERING isDisabled={false}>
      <PopperWrapper
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
        shouldUseCaptureOnOutsideClick={shouldUseCaptureOnOutsideClick}
        shouldRenderToParent={shouldRenderToParent}
        shouldDisableFocusLock={shouldDisableFocusLock}
        triggerRef={triggerRef}
        strategy={strategy}
      />
    </UNSAFE_LAYERING>
  );

  if (shouldRenderToParent) {
    return popperWrapper;
  }

  return <Portal zIndex={zIndex}>{popperWrapper}</Portal>;
};
