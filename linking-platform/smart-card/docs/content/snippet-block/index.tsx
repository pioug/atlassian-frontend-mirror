import React from 'react';

import { TabName } from '../../utils';
import ContentTabs from '../../utils/content-tabs';
import customMd from '../../utils/custom-md';

import examples from './examples';
import reference from './reference';

const _default_1: JSX.Element = customMd`

## SnippetBlock

A snippet block provides a description for a link.
Its data is mapped to \`summary\` from a link resolver.

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
export default _default_1;
