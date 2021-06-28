import React, { SyntheticEvent } from 'react';

import { InjectedIntlProps, injectIntl } from 'react-intl';

import { MessageDescriptor } from '../../../../types/i18n';
import { TableCssClassName as ClassName } from '../../types';

export interface ButtonProps {
  removeLabel: MessageDescriptor;
  style?: object;
  onClick?: (event: SyntheticEvent) => void;
  onMouseEnter?: (event: SyntheticEvent) => void;
  onMouseLeave?: (event: SyntheticEvent) => void;
}

const DeleteButton = ({
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  removeLabel,
  intl: { formatMessage },
}: ButtonProps & InjectedIntlProps) => (
  <div
    className={ClassName.CONTROLS_DELETE_BUTTON_WRAP}
    style={style}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <button
      type="button"
      title={formatMessage(removeLabel, { 0: 1 })}
      className={ClassName.CONTROLS_DELETE_BUTTON}
      onMouseDown={onClick}
      onMouseMove={(e) => e.preventDefault()}
    >
      <svg className={ClassName.CONTROLS_BUTTON_ICON}>
        <path
          d="M12.242 10.828L9.414 8l2.828-2.829a.999.999 0 1 0-1.414-1.414L8 6.587l-2.829-2.83a1 1 0 0 0-1.414 1.414l2.83 2.83-2.83 2.827a1 1 0 0 0 1.414 1.414l2.83-2.828 2.827 2.828a.999.999 0 1 0 1.414-1.414"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </button>
  </div>
);

export default injectIntl(DeleteButton);
