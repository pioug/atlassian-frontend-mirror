import React from 'react';

import { TabName } from '../../utils';
import ContentTabs from '../../utils/content-tabs';
import customMd from '../../utils/custom-md';

import examples from './examples';
import reference from './reference';

export default customMd`

## PreviewBlock

A preview block provides a thumbnail for the link.
Its data is mapped to \`image\` from a link resolver.

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
