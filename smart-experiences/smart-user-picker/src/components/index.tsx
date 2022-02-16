import React from 'react';
import { Props } from '../types';
import { SmartUserPicker } from './SmartUserPicker';
import MessagesIntlProvider from './MessagesIntlProvider';
import {
  useUFOConcurrentExperience,
  smartUserPickerRenderedUfoExperience,
} from '../ufoExperiences';

const SmartUserPickerWithIntlProvider: React.FunctionComponent<Props> = (
  props,
) => {
  useUFOConcurrentExperience(
    smartUserPickerRenderedUfoExperience,
    props.inputId || props.fieldId,
  );
  return (
    <MessagesIntlProvider>
      <SmartUserPicker {...props} />
    </MessagesIntlProvider>
  );
};

export default SmartUserPickerWithIntlProvider;
