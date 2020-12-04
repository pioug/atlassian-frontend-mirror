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
import { name as packageName, version as packageVersion } from './version.json';

export const getIconSize = (size: Size) =>
  size === 'large' ? 'large' : 'small';

const noop = () => {};

const analyticsAttributes = {
  componentName: 'toggle',
  packageName,
  packageVersion,
};

interface ExtendedToggleProps extends ToggleProps {
  mode: ThemeModes;
}

const InnerToggle = forwardRef(
  (props: ExtendedToggleProps, ref: React.Ref<HTMLInputElement>) => {
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
          setChecked(checked => !checked);
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
        />
        <CheckIcon label="check" size={getIconSize(size)} />
        <CloseIcon label="cross" size={getIconSize(size)} />
      </label>
    );
  },
);

const Toggle = memo(
  forwardRef(function Toggle(
    props: ToggleProps,
    ref: React.Ref<HTMLInputElement>,
  ) {
    return (
      <GlobalTheme.Consumer>
        {(tokens: GlobalThemeTokens) => {
          const mode = tokens.mode;
          return <InnerToggle {...props} mode={mode} ref={ref} />;
        }}
      </GlobalTheme.Consumer>
    );
  }),
);

Toggle.displayName = 'Toggle';

export default Toggle;
