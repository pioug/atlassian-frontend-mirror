import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import { Text } from '@atlaskit/primitives/compiled';
import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';

const Example = () => (
	<SectionMessage
		title="Section Message actions"
		testId="section-message"
		actions={[
			<SectionMessageAction testId="no-href-or-click">
				No href or onClick (span)
			</SectionMessageAction>,
			<SectionMessageAction testId="with-href" href="https://https://atlassian.design/">
				With href (anchor)
			</SectionMessageAction>,
			<SectionMessageAction testId="with-click" onClick={noop}>
				With onClick (button)
			</SectionMessageAction>,
			<SectionMessageAction
				testId="with-both"
				onClick={noop}
				href="https://https://atlassian.design/"
			>
				With href and onClick (anchor)
			</SectionMessageAction>,
		]}
	>
		<Text as="p">
			These are examples of the different types of actions that can be added to a Section Message.
		</Text>
	</SectionMessage>
);

export default Example;
