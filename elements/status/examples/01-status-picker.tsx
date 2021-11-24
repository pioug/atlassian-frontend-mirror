import React from 'react';
import { IntlProvider } from 'react-intl-next';
import ManagedStatusPicker from '../example-helpers/ManagedStatusPicker';

export default () => (
  <IntlProvider locale="en">
    <ManagedStatusPicker
      initialSelectedColor={'green'}
      initialText={'In progress'}
    />
  </IntlProvider>
);
