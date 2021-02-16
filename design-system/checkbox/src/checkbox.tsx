/**  @jsx jsx */
import {
  ChangeEvent,
  forwardRef,
  memo,
  Ref,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { jsx } from '@emotion/core';

import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import GlobalTheme from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';

import {
  getCheckboxStyles,
  Label,
  LabelText,
  RequiredIndicator,
} from './internal';
import { CheckboxProps, Size } from './types';
import { name as packageName, version as packageVersion } from './version.json';

type InnerProps = CheckboxProps & {
  mode: ThemeModes;
};

const sizes = {
  small: '16',
  medium: '24',
  large: '32',
  xlarge: '48',
};

// An svg is used so we don't pull in styled-components as well as
// a wrapping span. This approach is more performant.
const CheckboxIcon = memo(
  ({ size, isIndeterminate }: { size: Size; isIndeterminate: boolean }) => (
    <svg width={sizes[size]} height={sizes[size]} viewBox="0 0 24 24">
      <g fillRule="evenodd">
        <rect fill="currentColor" x="6" y="6" width="12" height="12" rx="2" />
        {isIndeterminate ? (
          <rect fill="inherit" x="8" y="11" width="8" height="2" rx="1" />
        ) : (
          <path
            d="M9.707 11.293a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414L11 12.586l-1.293-1.293z"
            fill="inherit"
          />
        )}
      </g>
    </svg>
  ),
);

const CheckboxWithMode = forwardRef(function Checkbox(
  props: InnerProps,
  ref: Ref<HTMLInputElement>,
) {
  const {
    isChecked: isCheckedProp,
    isDisabled = false,
    isInvalid = false,
    defaultChecked = false,
    isIndeterminate = false,
    size = 'medium',
    onChange: onChangeProps,
    analyticsContext,
    label,
    mode,
    name,
    value,
    isRequired,
    testId,
    ...rest
  } = props;

  const [isCheckedState, setIsCheckedState] = useState(
    isCheckedProp !== undefined ? isCheckedProp : defaultChecked,
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, analyticsEvent: UIAnalyticsEvent) => {
      setIsCheckedState(e.target.checked);
      if (onChangeProps) {
        onChangeProps(e, analyticsEvent);
      }
    },
    [onChangeProps],
  );

  const onChangeAnalytics = usePlatformLeafEventHandler({
    fn: onChange,
    action: 'changed',
    analyticsData: analyticsContext,
    componentName: 'checkbox',
    packageName,
    packageVersion,
  });

  // Use isChecked from the state if it is controlled
  const isChecked =
    isCheckedProp === undefined ? isCheckedState : isCheckedProp;

  // The styles are being generated for the input but are being
  // applied to the svg with a sibling selector so we have access
  // to the pseudo-classes of the input
  const styles = useMemo(() => getCheckboxStyles(mode), [mode]);

  return (
    <Label
      isDisabled={isDisabled}
      testId={testId && `${testId}--checkbox-label`}
    >
      <input
        {...rest}
        type="checkbox"
        ref={ref}
        disabled={isDisabled}
        checked={isChecked}
        value={value}
        name={name}
        required={isRequired}
        css={styles}
        onChange={onChangeAnalytics}
        aria-checked={isIndeterminate ? 'mixed' : isChecked}
        data-testid={testId && `${testId}--hidden-checkbox`}
        data-invalid={isInvalid ? 'true' : undefined}
      />
      <CheckboxIcon size={size} isIndeterminate={isIndeterminate} />
      <LabelText>
        {label}
        {isRequired && <RequiredIndicator aria-hidden="true" />}
      </LabelText>
    </Label>
  );
});

export const Checkbox = memo(
  forwardRef(function Checkbox(
    props: CheckboxProps,
    ref: Ref<HTMLInputElement>,
  ) {
    return (
      <GlobalTheme.Consumer>
        {({ mode }: { mode: ThemeModes }) => (
          <CheckboxWithMode {...props} ref={ref} mode={mode} />
        )}
      </GlobalTheme.Consumer>
    );
  }),
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;