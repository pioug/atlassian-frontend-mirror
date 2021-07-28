/** @jsx jsx */
import { forwardRef, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/core';

import { Popper } from '@atlaskit/popper';
import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { borderRadius, layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { RepositionOnUpdate } from './RepositionOnUpdate';
import { PopperWrapperProps, PopupComponentProps } from './types';
import { useCloseManager } from './useCloseManager';
import { useFocusManager } from './useFocusManager';

const popupStyles = css({
  display: 'block',
  boxSizing: 'border-box',
  zIndex: layers.layer(),
  flex: '1 1 auto',
  backgroundColor: token('color.background.overlay', N0),
  borderRadius: `${borderRadius()}px`,
  boxShadow: token('shadow.overlay', `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`),
  overflow: 'auto',
  ':focus': {
    outline: 'none',
  },
});
const DefaultPopupComponent = forwardRef<HTMLDivElement, PopupComponentProps>(
  (props, ref) => <div css={popupStyles} ref={ref} {...props} />,
);

function PopperWrapper({
  isOpen,
  id,
  offset,
  testId,
  content,
  onClose,
  boundary,
  rootBoundary,
  shouldFlip,
  placement = 'auto',
  popupComponent: PopupContainer = DefaultPopupComponent,
  autoFocus = true,
  triggerRef,
}: PopperWrapperProps) {
  const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);

  const [initialFocusRef, setInitialFocusRef] = useState<HTMLElement | null>(
    null,
  );

  useFocusManager({ initialFocusRef, popupRef });
  useCloseManager({ isOpen, onClose, popupRef, triggerRef });

  const modifiers = useMemo(
    () => [
      {
        name: 'flip',
        enabled: shouldFlip,
        options: {
          rootBoundary: rootBoundary,
          boundary: boundary,
        },
      },
    ],
    [shouldFlip, rootBoundary, boundary],
  );

  return (
    <Popper placement={placement} offset={offset} modifiers={modifiers}>
      {({ ref, style, placement, update }) => {
        return (
          <PopupContainer
            id={id}
            data-placement={placement}
            data-testid={testId}
            ref={(node: HTMLDivElement) => {
              if (node) {
                if (typeof ref === 'function') {
                  ref(node);
                } else {
                  (ref as React.MutableRefObject<HTMLElement>).current = node;
                }
                setPopupRef(node);
              }
            }}
            style={style}
            // using tabIndex={-1} would cause a bug where Safari focuses
            // first on the browser address bar when using keyboard
            tabIndex={autoFocus ? 0 : undefined}
          >
            <RepositionOnUpdate update={update}>
              {content({
                update,
                isOpen,
                onClose,
                setInitialFocusRef,
              })}
            </RepositionOnUpdate>
          </PopupContainer>
        );
      }}
    </Popper>
  );
}

export default PopperWrapper;
