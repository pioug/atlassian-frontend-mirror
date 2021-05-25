import React from 'react';
import { code, md, Props, AtlassianInternalWarning } from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  Smart User Picker extends on the User Picker component by providing a ML-backed list of suggested users
   when queried.


  ## Usage

  Import the component in your React app as follows:

  ${code`import { SmartUserPicker } from '@atlaskit/user-picker';`}

  ${(
    <Props
      heading="Smart User Picker Props"
      props={require('!!extract-react-types-loader!../src/components/smart-user-picker/components/index')}
      overrides={{
        createAnalyticsEvent: () => null,
      }}
    />
  )}
`;
