import React from 'react';

import { TabName } from '../../utils';
import ContentTabs from '../../utils/content-tabs';
import customMd from '../../utils/custom-md';

import examples from './examples';
import reference from './reference';

export default customMd`

## TitleBlock

A title block is the foundation of Flexible Smart Links feature in Smart Links.
It contains an icon, the link, and any associated metadata and actions in one block.

The TitleBlock will also render differently given the state of the smart link.
This can be found in the corresponding Resolving, Resolved and Errored views.

${(
	<ContentTabs
		tabs={[
			{ name: TabName.Examples, content: examples },
			{ name: TabName.Reference, content: reference },
		]}
	/>
)}
`;
