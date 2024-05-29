/**  @jsx jsx */
import {
  type ChangeEvent,
  forwardRef,
  memo,
  type Ref,
  useCallback,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/react';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { B200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { CheckboxIcon, Label, LabelText, RequiredIndicator } from './internal';
import type { CheckboxProps } from './types';

/* eslint-disable @atlaskit/design-system/no-nested-styles */
const checkboxStyles = css({
  width: '100%',
  height: '100%',
  margin: token('space.0', '0px'),
  appearance: 'none',
  border: 'none',
  gridArea: '1 / 1 / 2 / 2',
  opacity: 0,
  outline: 'none',
  '& + svg': {
    /**
     *  Change the variables --checkbox-background-color, --checkbox-border-color
     *  and --checkbox-tick-color according to user interactions.
     *  All other variables are constant.
     *  All styles from the input target the sibling svg.
     */
    '--checkbox-background-color': 'var(--local-background)',
    '--checkbox-border-color': 'var(--local-border)',
    '--checkbox-tick-color': 'var(--local-tick-rest)',
    color: 'var(--checkbox-background-color)',
    fill: 'var(--checkbox-tick-color)',
    gridArea: '1 / 1 / 2 / 2',
    pointerEvents: 'none',
    transition: 'color 0.2s ease-in-out, fill 0.2s ease-in-out',
    'rect:first-of-type': {
      stroke: 'var(--checkbox-border-color)',
      strokeWidth: token('border.width', '1px'),
      transition: 'stroke 0.2s ease-in-out',
    },
  },
  '&&:focus + svg, &&:checked:focus + svg': {
    borderRadius: token('border.radius', '0.25rem'),
    outline: `${token('border.width.outline', '2px')} solid ${token(
      'color.border.focused',
      B200,
    )}`,
    outlineOffset: token('space.negative.025', '-2px'),
  },
  '&:hover + svg': {
    '--checkbox-background-color': 'var(--local-background-hover)',
    '--checkbox-border-color': 'var(--local-border-hover)',
  },
  '&:checked:hover + svg': {
    '--checkbox-background-color': 'var(--local-background-checked-hover)',
    '--checkbox-border-color': 'var(--local-border-checked-hover)',
  },
  '&:checked + svg': {
    '--checkbox-background-color': 'var(--local-background-checked)',
    '--checkbox-border-color': 'var(--local-border-checked)',
    '--checkbox-tick-color': 'var(--local-tick-checked)',
  },
  '&[data-invalid] + svg': {
    '--checkbox-border-color': 'var(--local-border-invalid)',
  },
  '&:checked[data-invalid] + svg': {
    '--checkbox-border-color': 'var(--local-border-checked-invalid)',
  },
  '&:active + svg': {
    '--checkbox-background-color': 'var(--local-background-active)',
    '--checkbox-border-color': 'var(--local-border-active)',
  },
  '&:checked:active + svg': {
    '--checkbox-background-color': 'var(--local-background-active)',
    '--checkbox-border-color': 'var(--local-border-active)',
    '--checkbox-tick-color': 'var(--local-tick-active)',
  },
  '&:disabled + svg, &:disabled:hover + svg, &:disabled:focus + svg, &:disabled:active + svg, &:disabled[data-invalid] + svg':
    {
      '--checkbox-background-color': 'var(--local-background-disabled)',
      '--checkbox-border-color': 'var(--local-border-disabled)',
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  '&:disabled:checked + svg': {
    '--checkbox-tick-color': 'var(--local-tick-disabled)',
  },
  '@media screen and (forced-colors: active)': {
    '& + svg': {
      '--checkbox-background-color': 'Canvas',
      '--checkbox-border-color': 'CanvasText',
      '--checkbox-tick-color': 'CanvasText',
    },

    '&:checked + svg, &:checked:hover + svg': {
      '--checkbox-background-color': 'Canvas',
      '--checkbox-border-color': 'CanvasText',
      '--checkbox-tick-color': 'CanvasText',
    },

    '&:focus + svg rect:first-of-type': {
      stroke: 'Highlight',
    },

    '&[data-invalid] + svg': {
      '--checkbox-border-color': 'Highlight',
    },
    '&:checked[data-invalid] + svg': {
      '--checkbox-border-color': 'Highlight',
    },

    '&:disabled + svg, &:disabled:hover + svg, &:disabled:focus + svg, &:disabled:active + svg, &:disabled[data-invalid] + svg':
      {
        '--checkbox-background-color': 'Canvas',
        '--checkbox-border-color': 'GrayText',
        '--checkbox-tick-color': 'GrayText',
      },
  },
});
/* eslint-enable @atlaskit/design-system/no-nested-styles */

/**
 * __Checkbox__
 *
 * A checkbox an input control that allows a user to select one or more options from a number of choices.
 *
 * - [Examples](https://atlassian.design/components/checkbox/examples)
 * - [Code](https://atlassian.design/components/checkbox/code)
 * - [Usage](https://atlassian.design/components/checkbox/usage)
 */
const Checkbox = memo(
  forwardRef(function Checkbox(
    props: CheckboxProps,
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
      name,
      value,
      isRequired,
      testId,
      xcss,
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

    // Use isChecked from the state if it is controlled
    const isChecked =
      isCheckedProp === undefined ? isCheckedState : isCheckedProp;

    return (
      <Label
        isDisabled={isDisabled}
        label={label as string}
        id={rest.id ? `${rest.id}-label` : undefined}
        testId={testId && `${testId}--checkbox-label`}
        // Currently the rule hasn't been updated to enable "allowed" dynamic pass-throughs.
        // When there is more usage of this pattern we'll update the lint rule.
        // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
        xcss={xcss}
      >
        <input
          // It is necessary only for Safari. It allows to render focus styles.
          tabIndex={0}
          {...rest}
          type="checkbox"
          ref={mergedRefs}
          disabled={isDisabled}
          checked={isChecked}
          value={value}
          name={name}
          required={isRequired}
          css={checkboxStyles}
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
            {isRequired && <RequiredIndicator />}
          </LabelText>
        )}
      </Label>
    );
  }),
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
