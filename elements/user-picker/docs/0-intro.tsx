import React from 'react';
import {
  code,
  Example,
  md,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  This is the platform field for selecting users. On top of that you can also select [Teams](https://developer.atlassian.com/platform/teams/overview/what-are-teams/).
  This package provides two different modes of selection: single and multi user/team picker.

  #### DISCLAIMER:

  Please consider using the smart-user-picker over user-picker if possible. This encourages consistency and monitoring.
  If you cannot use smart-user-picker, please reach out to the our slack channels, #help-smart-experiences,
  so that we can work with you.

  ## Usage

  Import the component in your React app as follows:

  ${code`import UserPicker from '@atlaskit/user-picker';`}

  ${(
    <Example
      packageName="@atlaskit/user-picker"
      Component={require('../examples/00-single').default}
      title="Single User Picker"
      source={require('!!raw-loader!../examples/00-single')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/user-picker"
      Component={require('../examples/01-multi').default}
      title="Multi User Picker"
      source={require('!!raw-loader!../examples/01-multi')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/user-picker"
      Component={require('../examples/11-watchers').default}
      title="Watchers"
      source={require('!!raw-loader!../examples/11-watchers')}
    />
  )}

  ${(
    <Props
      heading="User Picker Props"
      props={require('!!extract-react-types-loader!../src/components/UserPicker')}
      overrides={{
        createAnalyticsEvent: () => null,
      }}
    />
  )}
`;
