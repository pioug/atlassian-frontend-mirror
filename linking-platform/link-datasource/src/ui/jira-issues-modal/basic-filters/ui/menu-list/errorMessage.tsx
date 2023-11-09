import React from 'react';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { asyncPopupSelectMessages } from './messages';
import CustomSelectMessage from './selectMessage';

const CustomErrorMessage = () => {
  return (
    <CustomSelectMessage
      icon={
        <ErrorIcon
          primaryColor={token('color.icon', N500)}
          label=""
          size="xlarge"
        />
      }
      message={asyncPopupSelectMessages.errorMessage}
      testId="jlol-basic-filter-popup-select--error-message"
    />
  );
};

export default CustomErrorMessage;
