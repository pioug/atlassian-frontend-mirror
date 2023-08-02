/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */
import { forwardRef, ReactNode, useCallback, useEffect, useState } from 'react';

import { css, jsx } from '@emotion/react';

import DropdownMenu, {
  CustomTriggerProps,
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
// eslint-disable-next-line @atlaskit/design-system/no-banned-imports
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import FocusRing from '@atlaskit/focus-ring';
import DragHandlerIcon from '@atlaskit/icon/glyph/drag-handler';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { usePreventScrollingFromArrowKeys } from '../hooks/use-prevent-scrolling-from-arrow-keys';
import type { DragState } from '../hooks/use-sortable-field';
import type { ReorderItem } from '../subtasks/hooks/use-top-level-wiring';

const dragHandleButtonStyles = css({
  width: 24,
  height: 24,
  display: 'grid',
  justifyContent: 'center',
  alignItems: 'center',
  border: 'none',

  borderRadius: 3,
  cursor: 'grab',
  padding: 0,

  background: token('color.background.neutral.subtle'),

  '--drag-handle-opacity': 1,
});

const dragHandleButtonSelectedStyles = css({
  // Hack for precedence
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '&&&': {
    background: token('color.background.selected'),
    color: token('color.icon.selected'),
  },
});

const dragHandleButtonStateStyles = {
  idle: css({}),
  preview: css({
    background: 'transparent !important',
    '--drag-handle-opacity': '0 !important',
  }),
  dragging: css({
    background: 'transparent !important',
    '--drag-handle-opacity': '0 !important',
  }),
};

type DragHandleButtonProps = {
  id: string;
  reorderItem: ReorderItem;
  index: number;
  dataLength: number;

  dragState: DragState;
} & Partial<DragHandleButtonTriggerOwnProps>;

export const DragHandleButton = forwardRef<
  HTMLButtonElement,
  DragHandleButtonProps
>(function DragHandleButton(
  {
    id,
    reorderItem,
    index,
    dataLength,
    dragState,
    isTriggerHiddenWhenIdle = false,
    isTriggerForcedVisible = false,
    triggerAppearance = 'default',
    dragHandleIcon,
    fallbackIcon,
  },
  dragHandleButtonRef,
) {
  const moveUp = useCallback(() => {
    reorderItem({ id, action: 'up' });
  }, [id, reorderItem]);

  const moveDown = useCallback(() => {
    reorderItem({ id, action: 'down' });
  }, [id, reorderItem]);

  const isMoveUpDisabled = index === 0;
  const isMoveDownDisabled = index === dataLength - 1;

  const renderTrigger = useCallback(
    (props: CustomTriggerProps<HTMLButtonElement>) => {
      return (
        <DragHandleButtonTrigger
          ref={dragHandleButtonRef}
          {...props}
          dragState={dragState}
          isTriggerHiddenWhenIdle={isTriggerHiddenWhenIdle}
          isTriggerForcedVisible={
            isTriggerForcedVisible || Boolean(props.isSelected)
          }
          triggerAppearance={triggerAppearance}
          dragHandleIcon={dragHandleIcon}
          fallbackIcon={fallbackIcon}
        />
      );
    },
    [
      dragHandleButtonRef,
      dragHandleIcon,
      dragState,
      fallbackIcon,
      isTriggerForcedVisible,
      isTriggerHiddenWhenIdle,
      triggerAppearance,
    ],
  );

  return (
    <DropdownMenu trigger={renderTrigger} placement="bottom-start">
      <DropdownItemGroup>
        <DropdownItem onClick={moveUp} isDisabled={isMoveUpDisabled}>
          Move up
        </DropdownItem>
        <DropdownItem onClick={moveDown} isDisabled={isMoveDownDisabled}>
          Move down
        </DropdownItem>
      </DropdownItemGroup>
    </DropdownMenu>
  );
});

const triggerHiddenWhenIdleStyles = css({
  ':not(:is(:hover, :focus-visible, :active))': {
    //opacity: 0,
    '--drag-handle-opacity': 0,
    background: 'none',
  },
});

type TriggerAppearance = 'subtle' | 'default';

const triggerAppearanceStyles = {
  subtle: css({
    background: token('color.background.neutral.subtle'),
    ':hover, :focus-visible': {
      background: token('color.background.neutral.subtle.hovered'),
    },
    ':active': {
      background: token('color.background.neutral.subtle.pressed'),
    },
  }),
  default: css({
    background: token('color.background.neutral'),
    ':hover, :focus-visible': {
      background: token('color.background.neutral.hovered'),
    },
    ':active': {
      background: token('color.background.neutral.pressed'),
    },
  }),
};

type DragHandleButtonTriggerOwnProps = {
  dragState: DragState;
  isTriggerHiddenWhenIdle: boolean;
  isTriggerForcedVisible: boolean;
  triggerAppearance: TriggerAppearance;

  dragHandleIcon?: ReactNode;
  fallbackIcon?: ReactNode;
};

type DragHandleButtonTriggerProps = CustomTriggerProps<HTMLButtonElement> &
  DragHandleButtonTriggerOwnProps;

const defaultDragHandleIcon = (
  <DragHandlerIcon
    label=""
    size="medium"
    primaryColor={token('color.icon.subtle')}
  />
);

const DummyTooltipComponent = forwardRef(function DummyTooltipComponent() {
  return null;
});

const DragHandleButtonTrigger = forwardRef<
  HTMLButtonElement,
  DragHandleButtonTriggerProps
>(function DragHandleButtonTrigger(
  {
    isSelected = false,
    dragState,
    testId,
    isTriggerHiddenWhenIdle,
    isTriggerForcedVisible,
    triggerAppearance,
    dragHandleIcon = defaultDragHandleIcon,
    fallbackIcon,
    triggerRef,
    ...triggerProps
  },
  ref,
) {
  /**
   * This is a hack to stop the tooltip flashing after a reorder from the
   * pointer.
   */
  const [hasJustBecomeIdle, setHasJustBecomeIdle] = useState(false);
  useEffect(() => {
    if (dragState !== 'idle') {
      return;
    }
    setHasJustBecomeIdle(true);
    const timeoutId = setTimeout(() => {
      setHasJustBecomeIdle(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dragState]);

  const isTooltipDisabled = dragState !== 'idle' || hasJustBecomeIdle;

  usePreventScrollingFromArrowKeys({ shouldPreventScrolling: isSelected });

  return (
    <Tooltip
      content={
        <span>
          Drag to reorder
          <br />
          Click to open menu
        </span>
      }
      hideTooltipOnMouseDown
      hideTooltipOnClick
      component={isTooltipDisabled ? DummyTooltipComponent : undefined}
      position="right"
    >
      {({ ref: tooltipRef, ...tooltipProps }) => (
        <FocusRing>
          <button
            ref={mergeRefs([ref, triggerRef, tooltipRef])}
            css={[
              dragHandleButtonStyles,
              triggerAppearanceStyles[triggerAppearance],
              isSelected && dragHandleButtonSelectedStyles,
              dragHandleButtonStateStyles[dragState],
              isTriggerHiddenWhenIdle &&
                !isTriggerForcedVisible &&
                triggerHiddenWhenIdleStyles,
            ]}
            style={{ position: 'relative' }}
            data-testid={testId}
            {...triggerProps}
            {...tooltipProps}
            onClick={event => {
              triggerProps.onClick?.(event);
              tooltipProps.onClick(event);
            }}
            onFocus={event => {
              // @ts-expect-error - types are wrong
              triggerProps.onFocus(event);
              if (!isTooltipDisabled) {
                tooltipProps.onFocus(event);
              }
            }}
            onBlur={event => {
              // @ts-expect-error - types are wrong
              triggerProps.onBlur(event);
              tooltipProps.onBlur(event);
            }}
          >
            <div
              style={{
                opacity: 'var(--drag-handle-opacity)',
                display: 'inline-flex',
              }}
            >
              {dragHandleIcon}
            </div>
            {fallbackIcon && (
              <div
                style={{
                  display: 'inline-flex',
                  opacity: 'calc(1 - var(--drag-handle-opacity))',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {fallbackIcon}
              </div>
            )}
          </button>
        </FocusRing>
      )}
    </Tooltip>
  );
});
