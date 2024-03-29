/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { FC } from 'react';
import { components } from 'react-select';
import {
  ClearIndicatorProps,
  DropdownIndicatorProps,
  LoadingIndicatorProps,
} from '../types';
import Spinner from '@atlaskit/spinner';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import DownIcon from '@atlaskit/icon/glyph/chevron-down';

const iconContainerStyles = css({
  all: 'unset',
  outline: 'revert',
  display: 'flex',
  alignItems: 'center',
});

export const ClearIndicator: FC<ClearIndicatorProps<any>> = (props) => (
  <components.ClearIndicator
    {...{
      ...props,
      innerProps: { ...props.innerProps, 'aria-hidden': 'false' },
    }}
  >
    <button css={iconContainerStyles} type="button" tabIndex={-1}>
      <SelectClearIcon size="small" label="clear" />
    </button>
  </components.ClearIndicator>
);

export const DropdownIndicator: FC<DropdownIndicatorProps<any>> = (props) => (
  <components.DropdownIndicator {...props}>
    <DownIcon label="open" />
  </components.DropdownIndicator>
);

export const LoadingIndicator: FC<LoadingIndicatorProps<any>> = (props) => {
  const loadingStyles = css(props.getStyles('loadingIndicator', props));
  return (
    // This *must* be constructed this way because this is being consumed by
    // `react-select` and we don't control what it wants.
    // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
    <div css={loadingStyles} {...props.innerProps}>
      <Spinner size="small" />
    </div>
  );
};
