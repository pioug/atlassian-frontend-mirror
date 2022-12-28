/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';
import { components } from 'react-select';
import { MultiValueRemoveProps } from '../types';

export {
  ClearIndicator,
  DropdownIndicator,
  LoadingIndicator,
} from './indicators';

const disabledProps = css`
  display: none;
`;

const enabledProps = css`
  display: inherit;
`;

export const MultiValueRemove = (props: MultiValueRemoveProps<any>) => {
  const { isDisabled } = props.selectProps;

  return (
    <components.MultiValueRemove {...props}>
      <div
        css={isDisabled ? disabledProps : enabledProps}
        data-testid={isDisabled ? 'hide-clear-icon' : 'show-clear-icon'}
      >
        <SelectClearIcon
          label="Clear"
          size="small"
          primaryColor="transparent"
          secondaryColor="inherit"
        />
      </div>
    </components.MultiValueRemove>
  );
};

export const IndicatorSeparator = null;
