/** @jsx jsx */

import { ButtonHTMLAttributes, forwardRef } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';

import FocusRing from '@atlaskit/focus-ring';
import DragHandlerIcon from '@atlaskit/icon/glyph/drag-handler';
import { token } from '@atlaskit/tokens';

/**
 * Cannot use `@atlaskit/button` here because it cancels `mousedown` events
 * which prevents dragging.
 */
const buttonStyles = css({
  borderRadius: token('border.radius.100', '3px'),
  padding: token('space.0', '0px'),
  width: 'max-content',
  border: 'none',
  cursor: 'grab',
  display: 'flex',
});

export type DragHandleButtonAppearance = 'default' | 'subtle' | 'selected';

const buttonAppearanceStyles: Record<
  DragHandleButtonAppearance,
  SerializedStyles
> = {
  default: css({
    backgroundColor: token('color.background.neutral', '#091E420F'),
    ':hover': {
      backgroundColor: token('color.background.neutral.hovered', '#091E4224'),
    },
    ':active': {
      backgroundColor: token('color.background.neutral.pressed', '#091E424F'),
    },
  }),
  subtle: css({
    backgroundColor: token('color.background.neutral.subtle', '#00000000'),
    ':hover': {
      backgroundColor: token(
        'color.background.neutral.subtle.hovered',
        '#091E420F',
      ),
    },
    ':active': {
      backgroundColor: token(
        'color.background.neutral.subtle.pressed',
        '#091E4224',
      ),
    },
  }),
  selected: css({
    backgroundColor: token('color.background.selected', '#E9F2FF'),
    color: token('color.text.selected', '#0C66E4'),
  }),
};

export type DragHandleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * Change the style to indicate the button is selected
   */
  isSelected?: boolean;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string
   * that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests
   */
  testId?: string;
  /**
   * The base styling to apply to the button
   */
  appearance?: DragHandleButtonAppearance;
  /**
   * Text used to describe what the button is in context.
   */
  label: string;
};

/**
 * A button with pre-configured styling to look like a drag handle.
 *
 * This component uses a native button because the `@atlaskit/button`
 * cancels `mouseDown` events, which prevents dragging.
 */
export const DragHandleButton = forwardRef<
  HTMLButtonElement,
  DragHandleButtonProps
>(function DragHandleButton(
  {
    isSelected = false,
    testId,
    appearance: appearanceProp = 'default',
    label,
    /**
     * Defaulting to `button` instead of `submit` (native default in some cases).
     *
     * A type of `submit` only makes sense in a form context, and isn't very
     * relevant to a drag handle.
     *
     * `@atlaskit/button` also defaults to a type of `button` as well, as it
     * is more semantically appropriate in a wider range of cases.
     */
    type = 'button',
    ...buttonProps
  },
  ref,
) {
  const appearance = isSelected ? 'selected' : appearanceProp;

  return (
    <FocusRing>
      <button
        ref={ref}
        css={[buttonStyles, buttonAppearanceStyles[appearance]]}
        data-testid={testId}
        type={type}
        {...buttonProps}
      >
        <DragHandlerIcon label={label} />
      </button>
    </FocusRing>
  );
});
