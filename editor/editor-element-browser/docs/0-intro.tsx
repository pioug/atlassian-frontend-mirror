/* eslint-disable import/no-commonjs */
import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  New UI for the QuickInsert menu and Right rail

  ## Usage

  ${(
		<Example
			packageName="@atlaskit/editor-element-browser"
			Component={require('../examples/quick-insert-panel').default}
			title="Quick Insert Panel"
			source={require('!!raw-loader!../examples/quick-insert-panel')}
		/>
	)}

  ${(
		<Props
			heading="QuickInsertPanel Props"
			props={require('!!extract-react-types-loader!../src')}
		/>
	)}
`;
