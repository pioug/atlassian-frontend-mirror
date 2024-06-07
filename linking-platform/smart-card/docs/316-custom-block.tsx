import React from 'react';

import { code } from '@atlaskit/docs';

import { TabName } from './utils';
import ContentTabs from './utils/content-tabs';
import customMd from './utils/custom-md';
import examples from './content/custom-block/examples';
import reference from './content/custom-block/reference';

export default customMd`

### Introduction

A block represents a collection of elements and actions that are arranged
in a row. All elements and actions should be contained within a Block.

### Installation

${code`
yarn add @atlaskit/smart-card
`}

### Simple usage
${code`
import { CustomBlock } from '@atlaskit/smart-card';

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
