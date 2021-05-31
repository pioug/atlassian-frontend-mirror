import React from 'react';
import { FormattedMessage } from 'react-intl';

export default (props: FormattedMessage.Props) => (
  <FormattedMessage {...props}>
    {(translatedString) => translatedString}
  </FormattedMessage>
);
