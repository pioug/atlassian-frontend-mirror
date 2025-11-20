import React from 'react';

import { type ElementItem, ElementName, MetadataBlock, SmartLinkSize } from '../../src';

import ExampleContainer from './example-container';

const metadata: ElementItem[] = [
	{ name: ElementName.CollaboratorGroup },
	{ name: ElementName.ModifiedOn },
	{ name: ElementName.State },
	{ name: ElementName.SubscriberCount },
	{ name: ElementName.CommentCount },
	{ name: ElementName.AttachmentCount },
	{ name: ElementName.ChecklistProgress },
	{ name: ElementName.Priority },
	{ name: ElementName.ViewCount },
	{ name: ElementName.VoteCount },
	{ name: ElementName.ReactCount },
];

export default (): React.JSX.Element => (
	<ExampleContainer>
		<MetadataBlock size={SmartLinkSize.Small} primary={metadata} />
		<br />
		<MetadataBlock size={SmartLinkSize.Medium} primary={metadata} />
		<br />
		<MetadataBlock size={SmartLinkSize.Large} primary={metadata} />
		<br />
		<MetadataBlock size={SmartLinkSize.XLarge} primary={metadata} />
	</ExampleContainer>
);
