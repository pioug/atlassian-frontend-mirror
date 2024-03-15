/** @jsx jsx */
import { forwardRef, memo, Ref } from 'react';

import { css, jsx } from '@emotion/react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import __noop from '@atlaskit/ds-lib/noop';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import {
  B200,
  B300,
  B400,
  B50,
  N10,
  N100,
  N20,
  N30,
  N40,
  N70,
  N80,
  N900,
  R300,
} from '@atlaskit/theme/colors';
import { fontFamily as getFontFamily } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { RadioProps } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const fontFamily = getFontFamily();

const noop = __noop;

const labelPaddingStyles = css({
  padding: `${token('space.025', '2px')} ${token('space.050', '4px')}`,
});

const labelStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  position: 'relative',
  alignItems: 'flex-start',
  color: token('color.text', N900),
  fontFamily: fontFamily,
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '&[data-disabled]': {
    color: token('color.text.disabled', N80),
    cursor: 'not-allowed',
  },
});

const radioStyles = css({
  display: 'flex',
  // TODO https://product-fabric.atlassian.net/browse/DSP-10507 revisit and remove the scale of 14/24
  /*
    The circle should be 14px * 14px centred in a 24px * 24px box.
    This is inclusive of a 2px border and inner circle with 2px radius.
    There is a Chrome bug that makes the circle become an oval and the
    inner circle not be centred at various zoom levels. This bug is fixed
    in all browsers if a scale of 14/24 is applied.
  */
  width: '24px',
  height: '24px',
  margin: token('space.0', '0px'),
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  backgroundColor: 'var(--radio-background-color)',
  /* Border should multiply by 24/14 to offset scale, a scale of 12 / 7 is to fix a Chrome bug that makes the circle become an oval and the
    inner circle not be centred at various zoom levels */
  border: `${
    getBooleanFF(
      'platform.design-system-team.update-border-radio-checkbox_7askv',
    )
      ? token('border.width', '1px')
      : 'calc(2px * 12 / 7)'
  } solid var(--radio-border-color)`,
  borderRadius: token('border.radius.circle', '50%'),
  MozAppearance: 'none',
  outline: 'none',

  /*
    Change the variables --radio-background-color, --radio-border-color,
    -radio-dot-color and -radio-dot-opacity according to user interactions.
    All other variables are constant
  */
  '--radio-background-color': token('color.background.input', N10),
  '--radio-border-color': getBooleanFF(
    'platform.design-system-team.update-border-radio-checkbox_7askv',
  )
    ? token('color.border.bold', N100)
    : token('color.border.input', N40),
  '--radio-dot-color': token('color.icon.inverse', N10),
  '--radio-dot-opacity': 0,

  /* 24px * 7 / 12 === 14px height and width */
  transform: 'scale(calc(7 / 12))',
  transition:
    'border-color 0.2s ease-in-out, background-color 0.2s ease-in-out',
  verticalAlign: 'top',
  WebkitAppearance: 'none',

  '&::after': {
    /* Height and width should by 4px, multiply by 24/14 to offset scale */
    width: 'calc(4px * 12 / 7)',
    height: 'calc(4px * 12 / 7)',
    position: 'absolute',
    background: 'var(--radio-dot-color)',
    // TODO Delete this comment after verifying spacing token -> previous value `'50%'`
    borderRadius: token('border.radius.circle', '50%'),
    content: "''",
    opacity: 'var(--radio-dot-opacity)',
    transition: 'background-color 0.2s ease-in-out, opacity 0.2s ease-in-out',
  },

  '&:hover': {
    '--radio-background-color': token('color.background.input.hovered', N30),
    '--radio-border-color': getBooleanFF(
      'platform.design-system-team.update-border-radio-checkbox_7askv',
    )
      ? token('color.border.bold', N100)
      : token('color.border.input', N40),
  },
  '&:active': {
    '--radio-background-color': token('color.background.input.pressed', N30),
  },
  '&:focus': {
    outline: `${token('border.width.outline', '3px')} solid ${token(
      'color.border.focused',
      B200,
    )}`,
    outlineOffset: token('border.width.indicator', '3px'),
  },

  '&:checked': {
    '--radio-background-color': token('color.background.selected.bold', B400),
    '--radio-border-color': token('color.background.selected.bold', B400),
    '--radio-dot-opacity': 1,
  },
  '&:checked:hover': {
    '--radio-background-color': token(
      'color.background.selected.bold.hovered',
      B300,
    ),
    '--radio-border-color': token(
      'color.background.selected.bold.hovered',
      B300,
    ),
  },
  '&:checked:active': {
    '--radio-background-color': token(
      'color.background.selected.bold.pressed',
      B50,
    ),
    '--radio-border-color': getBooleanFF(
      'platform.design-system-team.update-border-radio-checkbox_7askv',
    )
      ? token('color.border.bold', N100)
      : token('color.border.input', N40),
    '--radio-dot-color': token('color.icon.inverse', B400),
  },
  '&:checked:focus': {
    outline: `${token('border.width.outline', '3px')} solid ${token(
      'color.border.focused',
      B200,
    )}`,
    outlineOffset: token('border.width.indicator', '3px'),
  },

  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  '&[data-invalid], &:checked[data-invalid]': {
    '--radio-border-color': token('color.icon.danger', R300),
  },

  '&:disabled, &:disabled:hover, &:disabled:focus, &:disabled:active, &:disabled[data-invalid]':
    {
      cursor: 'not-allowed',
      '--radio-background-color': token('color.background.disabled', N20),
      '--radio-border-color': token('color.border.disabled', N20),
      '--radio-dot-color': token('color.icon.disabled', N70),
    },
});

const InnerRadio = forwardRef(function Radio(
  props: RadioProps,
  ref: Ref<HTMLInputElement>,
) {
  const {
    ariaLabel,
    isDisabled = false,
    isRequired,
    isInvalid = false,
    isChecked = false,
    label,
    name,
    onChange = noop,
    value,
    testId,
    analyticsContext,
    // events and all other input props
    ...rest
  } = props;

  const onChangeAnalytics = usePlatformLeafEventHandler({
    fn: onChange,
    action: 'changed',
    analyticsData: analyticsContext,
    componentName: 'radio',
    packageName,
    packageVersion,
  });

  return (
    <label
      data-testid={testId && `${testId}--radio-label`}
      data-disabled={isDisabled ? 'true' : undefined}
      css={labelStyles}
    >
      <input
        {...rest}
        // It is necessary only for Safari. It allows to render focus styles.
        tabIndex={0}
        aria-label={ariaLabel}
        checked={isChecked}
        disabled={isDisabled}
        name={name}
        onChange={onChangeAnalytics}
        required={isRequired}
        type="radio"
        value={value}
        data-testid={testId && `${testId}--radio-input`}
        // isInvalid is used in a nonstandard way so cannot
        // use :invalid selector
        data-invalid={isInvalid ? 'true' : undefined}
        css={radioStyles}
        ref={ref}
      />
      {label ? <span css={labelPaddingStyles}>{label}</span> : null}
    </label>
  );
});

/**
 * __Radio__
 *
 * A radio input allows users to select only one option from a number of choices. Radio is generally displayed in a radio group.
 *
 * - [Examples](https://atlassian.design/components/radio/examples)
 * - [Code](https://atlassian.design/components/radio/code)
 * - [Usage](https://atlassian.design/components/radio/usage)
 */
const Radio = memo(
  forwardRef(function Radio(props: RadioProps, ref: Ref<HTMLInputElement>) {
    return <InnerRadio {...props} ref={ref} />;
  }),
);

export default Radio;
