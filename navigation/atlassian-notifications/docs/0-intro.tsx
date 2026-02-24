import React from 'react';
import { md, Example, TSProps, code, DevPreviewWarning } from '@atlaskit/docs';

// This is used by the website generator to define which components are tabs, and the tab order.
// If this export is not present, tabs are generated in case-sensitive alphabetical-order (not source-code order).
export const _PageTabs: string[] = ['Code', 'Usage'];

export const Code: React.JSX.Element = (
	<TSProps props={require('!!@af/ts-morph-loader?export=Notifications!../src/Notifications.tsx')} />
);

export const Usage: any = md`
  ${(<DevPreviewWarning />)}

  ## Usage

  ${code`import { Notifications } from '@atlaskit/atlassian-notifications';`}

  ${(
		<Example
			Component={require('../examples/00-basic-usage').default}
			packageName="@atlaskit/atlassian-notifications"
			source={require('!!raw-loader!../examples/00-basic-usage')}
			title="Basic usage"
		/>
	)}
`;
