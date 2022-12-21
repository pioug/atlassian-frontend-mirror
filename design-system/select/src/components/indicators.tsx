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

export const ClearIndicator: FC<ClearIndicatorProps<any>> = (props) => (
  <components.ClearIndicator {...props}>
    <SelectClearIcon size="small" label="clear" />
  </components.ClearIndicator>
);

export const DropdownIndicator: FC<DropdownIndicatorProps<any>> = (props) => (
  <components.DropdownIndicator {...props}>
    <DownIcon label="open" />
  </components.DropdownIndicator>
);

export const LoadingIndicator: FC<LoadingIndicatorProps<any>> = (props) => {
  const loadingCSS = css(props.getStyles('loadingIndicator', props));
  return (
    <div css={loadingCSS} {...props.innerProps}>
      <Spinner size="small" />
    </div>
  );
};
