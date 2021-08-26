/**  @jsx jsx */
import {
  ChangeEvent,
  forwardRef,
  memo,
  MouseEvent,
  Ref,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { jsx } from '@emotion/core';

import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import PrimitiveSVGIcon from '@atlaskit/icon/svg';
import GlobalTheme from '@atlaskit/theme/components';
import { ThemeModes } from '@atlaskit/theme/types';

import {
  getCheckboxStyles,
  Label,
  LabelText,
  RequiredIndicator,
} from './internal';
import { CheckboxProps, Size } from './types';

type InnerProps = CheckboxProps & {
  mode: ThemeModes;
};

// firefox doesn't handle cmd+click/ctrl+click properly
const isFirefox: boolean =
  typeof navigator !== 'undefined' &&
  navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

function getIcon(isIndeterminate: boolean, isChecked: boolean) {
  if (isIndeterminate) {
    return <rect fill="inherit" x="8" y="11" width="8" height="2" rx="1" />;
  }

  if (isChecked) {
    return (
      <path
        d="M9.707 11.293a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414L11 12.586l-1.293-1.293z"
        fill="inherit"
      />
    );
  }

  // No icon
  return null;
}

const CheckboxIcon = memo<{
  size: Size;
  isIndeterminate: boolean;
  isChecked: boolean;
}>(({ size, isIndeterminate, isChecked }) => (
  <PrimitiveSVGIcon
    label=""
    size={size}
    primaryColor="var(--checkbox-background-color)"
    secondaryColor="var(--checkbox-tick-color)"
  >
    <g fillRule="evenodd">
      <rect fill="currentColor" x="6" y="6" width="12" height="12" rx="2" />
      {getIcon(isIndeterminate, isChecked)}
    </g>
  </PrimitiveSVGIcon>
));

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
    packageName: process.env._PACKAGE_NAME_ as string,
    packageVersion: process.env._PACKAGE_VERSION_ as string,
  });

  const internalRef = useRef<HTMLInputElement>(null);
  const mergedRefs = mergeRefs([internalRef, ref]);

  // firefox doesn't properly dispatch events from label to its child input elements
  const onClickLabel = (event: MouseEvent<HTMLElement>) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      internalRef.current?.click();
    }
  };

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
      onClick={isFirefox ? onClickLabel : undefined}
    >
      <input
        {...rest}
        type="checkbox"
        ref={mergedRefs}
        disabled={isDisabled}
        checked={isChecked}
        value={value}
        name={name}
        required={isRequired}
        css={styles}
        onChange={onChangeAnalytics}
        aria-checked={isIndeterminate ? 'mixed' : isChecked}
        aria-invalid={isInvalid ? 'true' : undefined}
        data-testid={testId && `${testId}--hidden-checkbox`}
        data-invalid={isInvalid ? 'true' : undefined}
      />
      <CheckboxIcon
        size={size}
        isIndeterminate={isIndeterminate}
        isChecked={isChecked}
      />
      {label && (
        <LabelText>
          {label}
          {isRequired && <RequiredIndicator aria-hidden="true" />}
        </LabelText>
      )}
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
