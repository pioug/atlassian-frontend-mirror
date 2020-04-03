/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FC } from 'react';
import { components } from 'react-select';
import { IndicatorProps } from '../types';
import Spinner from '@atlaskit/spinner';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import DownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';

export const ClearIndicator: FC<IndicatorProps<any>> = props => (
  <components.ClearIndicator {...props}>
    <SelectClearIcon size="small" primaryColor="inherit" label="clear" />
  </components.ClearIndicator>
);

export const DropdownIndicator: FC<IndicatorProps<any>> = props => (
  <components.DropdownIndicator {...props}>
    <DownIcon label="open" />
  </components.DropdownIndicator>
);

export const LoadingIndicator: FC<any> = props => (
  <div css={props.getStyles('loadingIndicator', props)} {...props.innerProps}>
    <Spinner size="small" />
  </div>
);
