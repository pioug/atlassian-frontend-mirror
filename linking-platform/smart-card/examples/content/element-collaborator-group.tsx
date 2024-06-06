import React from 'react';
import { ElementName, MetadataBlock, SmartLinkSize } from '../../src';
import ExampleContainer from './example-container';

export default () => (
	<ExampleContainer>
		<MetadataBlock
			primary={[
				{ name: ElementName.CollaboratorGroup, size: SmartLinkSize.Small },
				{ name: ElementName.CollaboratorGroup, size: SmartLinkSize.Medium },
				{ name: ElementName.CollaboratorGroup, size: SmartLinkSize.Large },
				{ name: ElementName.CollaboratorGroup, size: SmartLinkSize.XLarge },
			]}
		/>
	</ExampleContainer>
);
