import React from 'react';
import { type Props } from '../types';
import { SmartUserPicker } from './SmartUserPicker';
import MessagesIntlProvider from './MessagesIntlProvider';
import {
  useUFOConcurrentExperience,
  smartUserPickerRenderedUfoExperience,
  UfoErrorBoundary,
} from '../ufoExperiences';

const SmartUserPickerWithIntlProvider: React.FunctionComponent<Props> = (
  props,
) => {
  const ufoId = props.inputId || props.fieldId;
  useUFOConcurrentExperience(smartUserPickerRenderedUfoExperience, ufoId);
  return (
    <UfoErrorBoundary id={ufoId}>
      <MessagesIntlProvider>
        <SmartUserPicker {...props} />
      </MessagesIntlProvider>
    </UfoErrorBoundary>
  );
};

export default SmartUserPickerWithIntlProvider;
