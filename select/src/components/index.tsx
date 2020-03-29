import React from 'react';
import { components } from 'react-select';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';

export {
  ClearIndicator,
  DropdownIndicator,
  LoadingIndicator,
} from './indicators';

export const MultiValueRemove = (props: any) => (
  <components.MultiValueRemove {...props}>
    <SelectClearIcon
      label="Clear"
      size="small"
      primaryColor="transparent"
      secondaryColor="inherit"
    />
  </components.MultiValueRemove>
);
export const IndicatorSeparator = null;
