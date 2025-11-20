import React from 'react';

import { ElementName, MetadataBlock, SmartLinkSize } from '../../src';

import ExampleContainer from './example-container';

export default (): React.JSX.Element => (
	<ExampleContainer>
		<MetadataBlock
			primary={[
				{ name: ElementName.AuthorGroup, size: SmartLinkSize.Small },
				{ name: ElementName.AuthorGroup, size: SmartLinkSize.Medium },
				{ name: ElementName.AuthorGroup, size: SmartLinkSize.Large },
				{ name: ElementName.AuthorGroup, size: SmartLinkSize.XLarge },
			]}
		/>
	</ExampleContainer>
);
