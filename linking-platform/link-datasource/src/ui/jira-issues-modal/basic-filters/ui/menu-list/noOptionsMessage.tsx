import React from 'react';

import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { asyncPopupSelectMessages } from './messages';
import CustomSelectMessage from './selectMessage';

const CustomNoOptionsMessage = () => {
  return (
    <CustomSelectMessage
      icon={
        <QuestionCircleIcon
          primaryColor={token('color.icon', N500)}
          size="xlarge"
          label=""
        />
      }
      message={asyncPopupSelectMessages.noOptionsMessage}
      testId="jlol-basic-filter-popup-select--no-options-message"
    />
  );
};

export default CustomNoOptionsMessage;
