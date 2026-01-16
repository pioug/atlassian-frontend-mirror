import React from 'react';
import { code, Example, md, Props, AtlassianInternalWarning } from '@atlaskit/docs';

const _default_1: any = md`
  ${(<AtlassianInternalWarning />)}

  Popup version of the User Picker. Define a separate target which the menu will display under.

  ## Usage

  Import the component in your React app as follows:

  ${code`import { PopupUserPicker } from '@atlaskit/user-picker';`}

  ${(
		<Example
			packageName="@atlaskit/user-picker"
			Component={require('../examples/19-popup-config').default}
			title="Modal"
			source={require('!!raw-loader!../examples/19-popup-config')}
		/>
	)}

  ${(
		<Props
			heading="Popup User Picker Props"
			props={require('!!extract-react-types-loader!../src/components/PopupUserPicker')}
			overrides={{
				createAnalyticsEvent: () => null,
			}}
		/>
	)}
`;
export default _default_1;
