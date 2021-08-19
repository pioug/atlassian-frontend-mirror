/** @jsx jsx */
import { forwardRef, memo, Ref, useMemo } from 'react';

import { css, jsx } from '@emotion/core';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import { DN600, N80, N900 } from '@atlaskit/theme/colors';
import GlobalTheme from '@atlaskit/theme/components';
import { fontFamily as getFontFamily } from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';
import { token } from '@atlaskit/tokens';

import getRadioCustomProperties from './styles';
import { RadioProps } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const fontFamily = getFontFamily();

const noop = () => {};

type InnerProps = RadioProps & {
  mode: ThemeModes;
};

const labelPaddingStyles = css({
  padding: '2px 4px',
});

const labelStyles = css({
  display: 'flex',
  boxSizing: 'border-box',
  position: 'relative',
  alignItems: 'flex-start',
  fontFamily: fontFamily,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '&[data-disabled]': {
    color: token('color.text.disabled', N80),
    cursor: 'not-allowed',
  },
});

const lightLabelStyles = css({
  color: token('color.text.highEmphasis', N900),
});

const darkLabelStyles = css({
  color: token('color.text.highEmphasis', DN600),
});

const radioStyles = css({
  display: 'flex',
  /*
    The circle should be 14px * 14px centred in a 24px * 24px box.
    This is inclusive of a 2px border and inner circle with 2px radius.
    There is a Chrome bug that makes the circle become an oval and the
    inner circle not be centred at various zoom levels. This bug is fixed
    in all browsers if a scale of 14/24 is applied.
  */
  width: '24px',
  height: '24px',
  margin: 0,
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  backgroundColor: 'var(--radio-background-color)',
  /* Border should be 2px, multiply by 24/14 to offset scale */
  border: 'calc(2px * 12 / 7) solid var(--radio-border-color)',
  borderRadius: '50%',
  MozAppearance: 'none',
  outline: 'none',

  /*
    Change the variables --radio-background-color, --radio-border-color,
    -radio-dot-color and -radio-dot-opacity according to user interactions.
    All other variables are constant
  */
  '--radio-background-color': 'var(--local-background)',
  '--radio-border-color': 'var(--local-border)',
  '--radio-dot-color': 'var(--local-dot-checked)',
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
    borderRadius: '50%',
    content: "''",
    opacity: 'var(--radio-dot-opacity)',
    transition: 'background-color 0.2s ease-in-out, opacity 0.2s ease-in-out',
  },

  '&:hover': {
    '--radio-background-color': 'var(--local-background-hover)',
    '--radio-border-color': 'var(local-border-hover)',
  },
  '&:active': {
    '--radio-background-color': 'var(--local-background-active)',
  },
  '&:focus': {
    '--radio-border-color': 'var(--local-border-focus)',
  },

  '&:checked': {
    '--radio-background-color': 'var(--local-background-checked)',
    '--radio-border-color': 'var(--local-background-checked)',
    '--radio-dot-opacity': 1,
  },
  '&:checked:hover': {
    '--radio-background-color': 'var(--local-background-checked-hover)',
    '--radio-border-color': 'var(--local-background-checked-hover)',
  },
  '&:checked:active': {
    '--radio-background-color': 'var(--local-background-checked-active)',
    '--radio-border-color': 'var(--local-border-hover)',
    '--radio-dot-color': 'var(--local-dot-active)',
  },
  '&:checked:focus': {
    '--radio-border-color': 'var(--local-border-focus)',
  },

  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '&[data-invalid], &:checked[data-invalid]': {
    '--radio-border-color': 'var(--local-invalid)',
  },

  '&:disabled, &:disabled:hover, &:disabled:focus, &:disabled:active, &:disabled[data-invalid]': {
    cursor: 'not-allowed',
    '--radio-background-color': 'var(--local-background-disabled)',
    '--radio-border-color': 'var(--local-border-disabled)',
    '--radio-dot-color': 'var(--local-dot-disabled)',
  },
  '&:checked:disabled': {
    '--radio-border-color': 'transparent', // TODO: Investigate token solution
  },
});

const RadioWithMode = forwardRef(function Radio(
  props: InnerProps,
  ref: Ref<HTMLInputElement>,
) {
  const {
    ariaLabel,
    isDisabled = false,
    isRequired,
    isInvalid = false,
    isChecked = false,
    label,
    mode,
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

  const radioCustomProperties = useMemo(
    () => css(getRadioCustomProperties(mode)),
    [mode],
  );

  return (
    // https://product-fabric.atlassian.net/browse/DST-1971
    // eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for
    <label
      data-testid={testId && `${testId}--radio-label`}
      data-disabled={isDisabled ? 'true' : undefined}
      // TODO these will no longer be dynamic styles when legacy theming removed
      // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
      css={[labelStyles, mode === 'light' ? lightLabelStyles : darkLabelStyles]}
    >
      <input
        {...rest}
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
        // TODO radioCustomProperties can be defined at top of file when legacy theming removed
        // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
        css={[radioStyles, radioCustomProperties]}
        ref={ref}
      />
      {label ? <span css={labelPaddingStyles}>{label}</span> : null}
    </label>
  );
});

const Radio = memo(
  forwardRef(function Radio(props: RadioProps, ref: Ref<HTMLInputElement>) {
    return (
      <GlobalTheme.Consumer>
        {({ mode }: { mode: ThemeModes }) => (
          <RadioWithMode {...props} ref={ref} mode={mode} />
        )}
      </GlobalTheme.Consumer>
    );
  }),
);

export default Radio;
