import React from 'react';

import { AtlassianInternalWarning, Example, md, Props } from '@atlaskit/docs';

const _default_1: any = md`
  ${(<AtlassianInternalWarning />)}

  This package contains components to launch the give kudos experience

  ### \`<GiveKudosLauncher />\`

 ${(
		<Example
			packageName="@atlaskit/give-kudos"
			Component={require('../examples/01-giveKudosLauncher').default}
			title="GiveKudosDrawer"
			source={require('!!raw-loader!../examples/01-giveKudosLauncher')}
		/>
 )}

  ${(
		<Props
			heading="Props"
			shouldCollapseProps
			props={require('!!extract-react-types-loader!../src/ui/GiveKudosLauncher')}
		/>
	)}


`;
export default _default_1;
