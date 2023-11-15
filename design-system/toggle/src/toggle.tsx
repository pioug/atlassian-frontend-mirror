/** @jsx jsx */
import { forwardRef, memo, useMemo, useState } from 'react';

import { jsx } from '@emotion/react';

import {
  UIAnalyticsEvent,
  usePlatformLeafEventHandler,
} from '@atlaskit/analytics-next';
import __noop from '@atlaskit/ds-lib/noop';
import CloseIcon from '@atlaskit/icon/glyph/editor/close';
import CheckIcon from '@atlaskit/icon/glyph/editor/done';

import { getStyles } from './internal/styles';
import { Size, ToggleProps } from './types';

export const getIconSize = (size: Size) =>
  size === 'large' ? 'large' : 'small';

const noop = __noop;

const analyticsAttributes = {
  componentName: 'toggle',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

/**
 * __Toggle__
 *
 * A toggle is used to view or switch between enabled or disabled states.
 *
 * - [Examples](https://atlassian.design/components/toggle/examples)
 * - [Code](https://atlassian.design/components/toggle/code)
 * - [Usage](https://atlassian.design/components/toggle/usage)
 */
const Toggle = memo(
  forwardRef<HTMLInputElement, ToggleProps>((props, ref) => {
    const {
      defaultChecked = false,
      isDisabled = false,
      onBlur: providedOnBlur = noop,
      onChange: providedChange = noop,
      onFocus: providedFocus = noop,
      size = 'regular' as Size,
      name = '',
      value = '',
      isChecked,
      analyticsContext,
      id,
      testId,
      label,
    } = props;

    const isControlled = typeof isChecked === 'undefined';
    const [checked, setChecked] = useState(defaultChecked);

    const handleBlur = usePlatformLeafEventHandler({
      fn: providedOnBlur,
      action: 'blur',
      analyticsData: analyticsContext,
      ...analyticsAttributes,
    });

    const handleFocus = usePlatformLeafEventHandler({
      fn: providedFocus,
      action: 'focus',
      analyticsData: analyticsContext,
      ...analyticsAttributes,
    });

    const handleChange = usePlatformLeafEventHandler({
      fn: (
        event: React.ChangeEvent<HTMLInputElement>,
        analyticsEvent: UIAnalyticsEvent,
      ) => {
        if (isControlled) {
          setChecked((checked) => !checked);
        }
        return providedChange(event, analyticsEvent);
      },
      action: 'change',
      analyticsData: analyticsContext,
      ...analyticsAttributes,
    });

    const shouldChecked = isControlled ? checked : isChecked;

    const controlProps = {
      'data-checked': shouldChecked ? shouldChecked : undefined,
      'data-disabled': isDisabled ? isDisabled : undefined,
      'data-size': size,
      'data-testid': testId ? testId : undefined,
    };

    const toggleStyles = useMemo(() => getStyles(size), [size]);

    return (
      <label {...controlProps} css={toggleStyles}>
        <input
          ref={ref}
          checked={shouldChecked}
          disabled={isDisabled}
          id={id}
          name={name}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          type="checkbox"
          value={value}
          data-testid={testId && `${testId}--input`}
          aria-label={label}
        />
        <CheckIcon
          label=""
          size={getIconSize(size)}
          testId={testId && `${testId}--toggle-check-icon`}
        />
        <CloseIcon
          label=""
          size={getIconSize(size)}
          testId={testId && `${testId}--toggle-cross-icon`}
        />
      </label>
    );
  }),
);

Toggle.displayName = 'Toggle';

export default Toggle;
