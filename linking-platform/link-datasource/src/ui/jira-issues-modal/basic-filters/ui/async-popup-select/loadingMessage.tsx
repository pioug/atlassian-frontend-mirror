import React from 'react';

import Spinner from '@atlaskit/spinner';

import CustomSelectMessage from '../custom-select-message';

import { asyncPopupSelectMessages } from './messages';

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
