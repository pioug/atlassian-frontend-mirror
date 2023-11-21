/** @jsx jsx */
import { jsx, SerializedStyles } from '@emotion/react';

import { Size } from '@atlaskit/icon';
import SelectClearIcon from '@atlaskit/icon/glyph/select-clear';

interface ClearButtonProps {
  inputId?: string;
  iconSize?: Size;
  primaryColor?: string;
  label?: string;
  buttonStyles?: SerializedStyles;
  dataTestId?: string;
  onClick?: () => void;
}

/**
 * __Clear button__
 */
const ClearButton = ({
  inputId,
  iconSize = 'small',
  label = 'Clear',
  primaryColor,
  buttonStyles,
  dataTestId,
  onClick,
}: ClearButtonProps) => {
  const labelId = inputId && `label--${inputId}`;
  const clearButtonId = inputId && `clear-btn--${inputId}`;

  return (
    <button
      css={buttonStyles}
      type="button"
      tabIndex={-1}
      data-testid={`${dataTestId}--clear--btn`}
      onClick={onClick}
    >
      <span hidden id={clearButtonId}>
        Clear
      </span>
      <span
        style={{ display: 'flex' }}
        aria-labelledby={
          inputId ? `${clearButtonId} ${labelId}` : `${clearButtonId}`
        }
      >
        <SelectClearIcon
          size={iconSize}
          label={inputId ? '' : label}
          primaryColor={primaryColor}
        />
      </span>
    </button>
  );
};

export default ClearButton;
