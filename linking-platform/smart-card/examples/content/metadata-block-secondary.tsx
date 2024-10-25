import React from 'react';

import { ElementName, MetadataBlock } from '../../src';

import ExampleContainer from './example-container';

export default () => (
	<ExampleContainer>
		<MetadataBlock
			secondary={[
				{ name: ElementName.AttachmentCount },
				{ name: ElementName.ChecklistProgress },
				{ name: ElementName.SubscriberCount },
				{ name: ElementName.CommentCount },
				{ name: ElementName.Priority },
				{ name: ElementName.State },
			]}
		/>
	</ExampleContainer>
);
