import { code } from '@atlaskit/docs';
import React from 'react';

import { TabName } from '../../utils';
import ContentTabs from '../../utils/content-tabs';
import customMd from '../../utils/custom-md';
import examples from './examples';
import reference from './reference';

export default customMd`

## CustomBlock

A custom block can host any react component and valid HTML elements inside Flexible Smart Links.
It is suitable for custom look that can be customised freely.

### Simple usage
${code`
<CustomBlock>
  <div>Block 1</div>
  <div>Block 2</div>
  <div>Block 3</div>
</CustomBlock>
`}

${(
	<ContentTabs
		tabs={[
			{ name: TabName.Examples, content: examples },
			{ name: TabName.Reference, content: reference },
		]}
	/>
)}
`;
