import React from 'react';
import { IntlProvider } from 'react-intl-next';
import ManagedStatusPicker from '../example-helpers/ManagedStatusPicker';

export const NeutralStatus = () => (
  <IntlProvider locale="en">
    <ManagedStatusPicker
      initialSelectedColor={'neutral'}
      initialText={'In progress'}
    />
  </IntlProvider>
);

export const PurpleStatus = () => (
  <IntlProvider locale="en">
    <ManagedStatusPicker
      initialSelectedColor={'purple'}
      initialText={'In progress'}
    />
  </IntlProvider>
);

export const BlueStatus = () => (
  <IntlProvider locale="en">
    <ManagedStatusPicker
      initialSelectedColor={'blue'}
      initialText={'In progress'}
    />
  </IntlProvider>
);

export const RedStatus = () => (
  <IntlProvider locale="en">
    <ManagedStatusPicker
      initialSelectedColor={'red'}
      initialText={'In progress'}
    />
  </IntlProvider>
);

export const YellowStatus = () => (
  <IntlProvider locale="en">
    <ManagedStatusPicker
      initialSelectedColor={'yellow'}
      initialText={'In progress'}
    />
  </IntlProvider>
);

export const GreenStatus = () => (
  <IntlProvider locale="en">
    <ManagedStatusPicker
      initialSelectedColor={'green'}
      initialText={'In progress'}
    />
  </IntlProvider>
);

export default () => (
  <IntlProvider locale="en">
    <ManagedStatusPicker
      initialSelectedColor={'green'}
      initialText={'In progress'}
    />
  </IntlProvider>
);
