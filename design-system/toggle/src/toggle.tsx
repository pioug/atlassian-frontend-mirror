/** @jsx jsx */
import { forwardRef, memo, useMemo, useState } from 'react';

import { jsx } from '@emotion/core';

import {
  UIAnalyticsEvent,
  usePlatformLeafEventHandler,
} from '@atlaskit/analytics-next';
import CloseIcon from '@atlaskit/icon/glyph/editor/close';
import CheckIcon from '@atlaskit/icon/glyph/editor/done';
import GlobalTheme from '@atlaskit/theme/components';
import { GlobalThemeTokens, ThemeModes } from '@atlaskit/theme/types';

import { getStyles } from './internal/styles';
import { Size, ToggleProps } from './types';

export const getIconSize = (size: Size) =>
  size === 'large' ? 'large' : 'small';

const noop = () => {};

const analyticsAttributes = {
  componentName: 'toggle',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};

interface ExtendedToggleProps extends ToggleProps {
  mode: ThemeModes;
}

const InnerToggle = forwardRef<HTMLInputElement, ExtendedToggleProps>(
  (props, ref) => {
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
      mode,
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

    const toggleStyles = useMemo(() => getStyles(size, mode), [size, mode]);

    return (
      // https://product-fabric.atlassian.net/browse/DST-1969
      // eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for
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
  },
);

const Toggle = memo(
  forwardRef<HTMLInputElement, ToggleProps>(function Toggle(props, ref) {
    return (
      <GlobalTheme.Consumer>
        {(tokens: GlobalThemeTokens) => (
          <InnerToggle {...props} mode={tokens.mode} ref={ref} />
        )}
      </GlobalTheme.Consumer>
    );
  }),
);

Toggle.displayName = 'Toggle';

export default Toggle;
