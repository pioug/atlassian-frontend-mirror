/* eslint-disable @repo/internal/react/require-jsdoc */
/** @jsx jsx */
import {
  type Dispatch,
  type FC,
  memo,
  type SetStateAction,
  useState,
} from 'react';

import { jsx } from '@emotion/react';
import memoizeOne from 'memoize-one';

import { UNSAFE_LAYERING } from '@atlaskit/layering';
import { Manager, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import PopperWrapper from './popper-wrapper';
import { PopupProps } from './types';

const defaultLayer = layers.layer();

export const Popup: FC<PopupProps> = memo(
  ({
    isOpen,
    id,
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
    shouldRenderToParent = false,
    shouldDisableFocusLock = false,
  }: PopupProps) => {
    const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);

    /*
     * Get a memoized functional ref for use within this Popup's Trigger.
     * This is still very volatile to change as `prop.isOpen` will regularly change, but it's better than nothing.
     * This is memoized within our component as to not be shared across all Popup instances, just this one.
     *
     * This is complex because the inputs are split across three different scopes:
     *  - `props.isOpen`
     *  - `useState.setTriggerRef`
     *  - `renderProps.ref`
     */
    const [getMergedTriggerRef] = useState(() =>
      memoizeOne(
        (
          ref:
            | React.RefCallback<HTMLElement>
            | React.MutableRefObject<HTMLElement>
            | null,
          setTriggerRef: Dispatch<SetStateAction<HTMLElement | null>>,
          isOpen: boolean,
        ) => {
          return (node: HTMLElement | null) => {
            if (node && isOpen) {
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              setTriggerRef(node);
            }
          };
        },
      ),
    );

    const renderPopperWrapper = (
      <UNSAFE_LAYERING isDisabled={false}>
        <PopperWrapper
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
          shouldRenderToParent={shouldRenderToParent}
          shouldDisableFocusLock={shouldDisableFocusLock}
          triggerRef={triggerRef}
        />
      </UNSAFE_LAYERING>
    );

    return (
      <Manager>
        <Reference>
          {({ ref }) => {
            return trigger({
              ref: getMergedTriggerRef(ref, setTriggerRef, isOpen),
              'aria-controls': id,
              'aria-expanded': isOpen,
              'aria-haspopup': true,
            });
          }}
        </Reference>
        {isOpen &&
          (shouldRenderToParent ? (
            renderPopperWrapper
          ) : (
            <Portal zIndex={zIndex}>{renderPopperWrapper}</Portal>
          ))}
      </Manager>
    );
  },
);

export default Popup;
