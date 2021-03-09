/** @jsx jsx */
import { forwardRef, memo, Ref, useMemo } from 'react';

import { css, jsx } from '@emotion/core';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import { DN600, N80, N900 } from '@atlaskit/theme/colors';
import GlobalTheme from '@atlaskit/theme/components';
import { fontFamily as getFontFamily } from '@atlaskit/theme/constants';
import { ThemeModes } from '@atlaskit/theme/types';

import getRadioStyles from './styles';
import { RadioProps } from './types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const fontFamily = getFontFamily();

const noop = () => {};

type InnerProps = RadioProps & {
  mode: ThemeModes;
};

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

  const styles = useMemo(() => getRadioStyles(mode), [mode]);

  return (
    // https://product-fabric.atlassian.net/browse/DST-1971
    // eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for
    <label
      data-testid={testId && `${testId}--radio-label`}
      data-disabled={isDisabled ? 'true' : undefined}
      css={css`
        align-items: flex-start;
        font-family: ${fontFamily};
        color: ${mode === 'light' ? N900 : DN600};
        display: flex;
        position: relative;
        /* Content box changes intended size of the input */
        box-sizing: border-box;
        &[data-disabled] {
          color: ${N80};
          cursor: not-allowed;
        }
      `}
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
        css={styles}
        ref={ref}
      />
      {label ? (
        <span
          css={css`
            padding: 2px 4px;
          `}
        >
          {label}
        </span>
      ) : null}
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
