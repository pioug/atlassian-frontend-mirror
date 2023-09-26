/** @jsx jsx */
import { forwardRef, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/react';

import { Popper } from '@atlaskit/popper';
import { N0, N50A, N60A } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { CURRENT_SURFACE_CSS_VAR, token } from '@atlaskit/tokens';

import { RepositionOnUpdate } from './reposition-on-update';
import { PopperWrapperProps, PopupComponentProps } from './types';
import { useCloseManager } from './use-close-manager';
import { useFocusManager } from './use-focus-manager';

const popupStyles = css({
  display: 'block',
  boxSizing: 'border-box',
  zIndex: layers.layer(),
  flex: '1 1 auto',
  backgroundColor: token('elevation.surface.overlay', N0),
  borderRadius: token('border.radius', '3px'),
  boxShadow: token(
    'elevation.shadow.overlay',
    `0 4px 8px -2px ${N50A}, 0 0 1px ${N60A}`,
  ),
  [CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay', N0),
  ':focus': {
    outline: 'none',
  },
});
const popupOverflowStyles = css({
  overflow: 'auto',
});

const DefaultPopupComponent = forwardRef<HTMLDivElement, PopupComponentProps>(
  (props, ref) => {
    const { shouldRenderToParent } = props;

    return (
      <div
        css={[popupStyles, !shouldRenderToParent && popupOverflowStyles]}
        {...props}
        ref={ref}
      />
    );
  },
);

function PopperWrapper({
  isOpen,
  id,
  offset,
  testId,
  content,
  fallbackPlacements,
  onClose,
  boundary,
  rootBoundary,
  shouldFlip,
  placement = 'auto',
  popupComponent: PopupContainer = DefaultPopupComponent,
  autoFocus = true,
  triggerRef,
  shouldUseCaptureOnOutsideClick,
  shouldRenderToParent,
}: PopperWrapperProps) {
  const [popupRef, setPopupRef] = useState<HTMLDivElement | null>(null);

  const [initialFocusRef, setInitialFocusRef] = useState<HTMLElement | null>(
    null,
  );

  useFocusManager({ initialFocusRef, popupRef });
  useCloseManager({
    isOpen,
    onClose,
    popupRef,
    triggerRef,
    shouldUseCaptureOnOutsideClick,
  });

  const modifiers = useMemo(
    () => [
      {
        name: 'flip',
        enabled: shouldFlip,
        options: {
          rootBoundary,
          boundary,
          fallbackPlacements,
        },
      },
    ],
    [shouldFlip, rootBoundary, boundary, fallbackPlacements],
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
            shouldRenderToParent={shouldRenderToParent}
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

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default PopperWrapper;
