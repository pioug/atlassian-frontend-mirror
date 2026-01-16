import React from 'react';
import { code, md, Props, Example, AtlassianInternalWarning } from '@atlaskit/docs';

const _default_1: any = md`
  ${(<AtlassianInternalWarning />)}

  Smart User Picker extends on [@atlaskit/user-picker](https://statlas.prod.atl-paas.net/atlassian-frontend/master#packages/elements/user-picker) by providing a ML-backed list of suggested users
   when queried.

  Capabilities:
  * Default provider to [URS](https://developer.atlassian.com/platform/user-recommendations/) for smart-ranked user search
  * Analytics for usage and relevance
  * Default value hydrator (props.defaultValues) for Confluence and Jira (hydration for other products not supported yet).


  ## Usage

  Smart User Picker can accept all User Picker props. Please refer to [@atlaskit/user-picker](https://statlas.prod.atl-paas.net/atlassian-frontend/master#packages/elements/user-picker)
   for styling or accessibility settings.

  Import the component in your React app as follows:

  ${code`import SmartUserPicker from '@atlaskit/smart-user-picker';`}

  ${(
		<Example
			packageName="@atlaskit/smart-user-picker"
			Component={require('../examples/00-smart-user-picker').default}
			title="Single User Picker"
			source={require('!!raw-loader!../examples/00-smart-user-picker')}
		/>
	)}

  ${(<Props src="../src/components" />)}

  ${(
		<Props
			heading="Smart User Picker Props"
			props={require('!!extract-react-types-loader!../src/components/SmartUserPicker')}
			overrides={{
				createAnalyticsEvent: () => null,
			}}
		/>
	)}

`;
export default _default_1;
