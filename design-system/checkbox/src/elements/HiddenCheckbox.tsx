/**  @jsx jsx */
import { forwardRef } from 'react';
import { jsx } from '@emotion/core';

export interface HiddenCheckboxProps extends React.HTMLProps<HTMLInputElement> {
  disabled?: boolean;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler;
  onFocus?: React.FocusEventHandler;
  onKeyUp?: React.KeyboardEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  value?: number | string;
  name?: string;
  required?: boolean;
  attributesFn: (props: {
    disabled?: boolean;
    checked?: boolean;
    required?: boolean;
  }) => Record<string, any>;
  /** A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests */
  testId?: string;
}
export default forwardRef((
  // @ts-ignore - createAnalyticsEvent is injected from WithAnalyticsEvents HOC
  { createAnalyticsEvent, attributesFn, testId, ...props }: HiddenCheckboxProps,
  ref: React.Ref<HTMLInputElement>,
) => (
  <input
    type="checkbox"
    {...attributesFn({
      disabled: props.disabled,
      checked: props.checked,
      required: props.required,
    })}
    {...props}
    ref={ref}
    css={{
      left: '50%',
      margin: 0,
      opacity: 0,
      padding: 0,
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      top: '50%',
      pointerEvents: 'none',
    }}
    data-testid={testId}
  />
));
