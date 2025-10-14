import React from 'react';
import { md, Example, TSProps, code, DevPreviewWarning } from '@atlaskit/docs';
import { token } from '@atlaskit/tokens';

// This is used by the website generator to define which components are tabs, and the tab order.
// If this export is not present, tabs are generated in case-sensitive alphabetical-order (not source-code order).
export const _PageTabs = ['Code', 'Usage'];

export const Code = (
	<TSProps props={require('!!@af/ts-morph-loader?export=Notifications!../src/Notifications.tsx')} />
);

export const Usage = md`
  ${
		(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			<div style={{ margin: token('space.100', '8px') }}>
				<DevPreviewWarning />
			</div>
		)
	}

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
