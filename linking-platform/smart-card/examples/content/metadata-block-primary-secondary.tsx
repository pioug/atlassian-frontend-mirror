import React from 'react';

import { ElementName, MetadataBlock } from '../../src';

import ExampleContainer from './example-container';

export default (): React.JSX.Element => (
	<ExampleContainer>
		<MetadataBlock
			primary={[{ name: ElementName.CollaboratorGroup }, { name: ElementName.ModifiedOn }]}
			secondary={[
				{ name: ElementName.SubscriberCount },
				{ name: ElementName.CommentCount },
				{ name: ElementName.AttachmentCount },
				{ name: ElementName.ChecklistProgress },
				{ name: ElementName.Priority },
				{ name: ElementName.State },
			]}
		/>
	</ExampleContainer>
);
