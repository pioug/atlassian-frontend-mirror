import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { type StylesConfig } from '@atlaskit/select';
import * as colors from '@atlaskit/theme/colors';

import SmartUserPicker from '../src';
import { useEndpointMocks } from '../example-helpers/mock-endpoints';
import '../example-helpers/mock-ufo';

const Example = () => {
  useEndpointMocks();

  const styles: StylesConfig = {
    control: (style) => ({
      ...style,
      backgroundColor: '#7B8597',
      borderRadius: 8,
    }),
    input: (style) => ({
      ...style,
      color: colors.N10,
    }),
  };

  return (
    <IntlProvider locale="en">
      <SmartUserPicker
        fieldId="example"
        productKey="jira"
        siteId="fake-tenant-id"
        onChange={console.log.bind(console)}
        isMulti
        defaultValue={[
          {
            id: '655363:23cdc6cc-d81e-492d-8fe1-ec56fb8094a4',
            type: 'user',
          },
        ]}
        styles={styles}
      />
    </IntlProvider>
  );
};
export default Example;
