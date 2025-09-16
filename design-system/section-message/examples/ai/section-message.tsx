import React from 'react';

import { Text } from '@atlaskit/primitives/compiled';
import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';

export default [
	<SectionMessage appearance="information" title="Information">
		<Text>This is an informational message to help users understand something important.</Text>
	</SectionMessage>,
	<SectionMessage appearance="warning" title="Warning">
		<Text>Please review your settings before proceeding with this action.</Text>
	</SectionMessage>,
	<SectionMessage
		appearance="success"
		title="Success"
		actions={[
			<SectionMessageAction href="#">View Details</SectionMessageAction>,
			<SectionMessageAction href="#">Share Results</SectionMessageAction>,
		]}
	>
		<Text>Your changes have been saved successfully!</Text>
	</SectionMessage>,
];
