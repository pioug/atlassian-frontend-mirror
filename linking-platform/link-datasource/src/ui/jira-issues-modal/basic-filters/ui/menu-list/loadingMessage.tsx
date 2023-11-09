import React from 'react';

import Spinner from '@atlaskit/spinner';

import { asyncPopupSelectMessages } from './messages';
import CustomSelectMessage from './selectMessage';

const CustomDropdownLoadingMessage = () => {
  return (
    <CustomSelectMessage
      icon={<Spinner size="large" />}
      message={asyncPopupSelectMessages.loadingMessage}
      testId="jlol-basic-filter-popup-select--loading-message"
    />
  );
};

export default CustomDropdownLoadingMessage;
