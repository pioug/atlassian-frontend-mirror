/** @jsx jsx */
import { FC, memo, useState } from 'react';

import { jsx } from '@emotion/core';

import { Manager, Reference } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { layers } from '@atlaskit/theme/constants';

import PopperWrapper from './PopperWrapper';
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
    popupComponent: PopupContainer,
    autoFocus = true,
    zIndex = defaultLayer,
  }: PopupProps) => {
    const [triggerRef, setTriggerRef] = useState<HTMLElement | null>(null);

    return (
      <Manager>
        <Reference>
          {({ ref }) => {
            return trigger({
              ref: (node: HTMLElement | null) => {
                if (node && isOpen) {
                  if (typeof ref === 'function') {
                    ref(node);
                  } else {
                    (ref as React.MutableRefObject<HTMLElement>).current = node;
                  }
                  setTriggerRef(node);
                }
              },
              'aria-controls': id,
              'aria-expanded': isOpen,
              'aria-haspopup': true,
            });
          }}
        </Reference>
        {isOpen && (
          <Portal zIndex={zIndex}>
            <PopperWrapper
              content={content}
              isOpen={isOpen}
              placement={placement}
              boundary={boundary}
              rootBoundary={rootBoundary}
              shouldFlip={shouldFlip}
              offset={offset}
              popupComponent={PopupContainer}
              id={id}
              testId={testId}
              onClose={onClose}
              autoFocus={autoFocus}
              triggerRef={triggerRef}
            />
          </Portal>
        )}
      </Manager>
    );
  },
);

export default Popup;
