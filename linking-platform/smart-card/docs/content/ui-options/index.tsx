import React from 'react';

import { TabName } from '../../utils';
import ContentTabs from '../../utils/content-tabs';
import customMd from '../../utils/custom-md';

import examples from './examples';
import reference from './reference';

export default customMd`

## FlexibleUiOptions

The UI options is a prop on Card component used to configure Flexible Smart Links.
It can be combined to provide a wide range of integrations.

&nbsp;

${(
	<ContentTabs
		tabs={[
			{ name: TabName.Examples, content: examples },
			{ name: TabName.Reference, content: reference },
		]}
	/>
)}
`;
