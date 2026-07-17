import React from 'react';

import { AtlassianInternalWarning, DevPreviewWarning, Example, md } from '@atlaskit/docs';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import Stack from '@atlaskit/primitives/stack';

const _default_1: any = md`
  ${(
		<Stack space="space.200">
			<AtlassianInternalWarning />
			<DevPreviewWarning />
		</Stack>
	)}

  A table is used to display data.

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/table"
			Component={require('../examples/basic').default}
			title="Basic example"
			source={require('!!raw-loader!../examples/basic')}
		/>
	)}

`;
export default _default_1;
