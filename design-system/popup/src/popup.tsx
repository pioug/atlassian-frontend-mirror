/* eslint-disable @repo/internal/react/require-jsdoc */
/** @jsx jsx */
import { type FC, memo, useState } from 'react';

import { jsx } from '@emotion/react';

import { UNSAFE_LAYERING } from '@atlaskit/layering';
import { Manager, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import PopperWrapper from './popper-wrapper';
import { PopupProps } from './types';
import { useGetMemoizedMergedTriggerRef } from './use-get-memoized-merged-trigger-ref';

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
    strategy,
    role,
    label,
    titleId,
  }: PopupProps) => {
    const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);
    const getMergedTriggerRef = useGetMemoizedMergedTriggerRef();

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
          strategy={strategy}
          role={role}
          label={label}
          titleId={titleId}
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
